const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, 'Làm ơn hãy nói cho chúng tôi tên của bạn']
    },
    email: {
        type: String,
        required: [true, 'Làm ơn hãy cung cấp Email của bạn'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Làm ơn hãy cung cấp một Email hợp lệ']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin','intern'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Làm ơn hãy cung cấp một mật khẩu'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Làm ơn hãy xác nhận lại mật khẩu của bạn'],
        validate: {
            // This only works on CREATE & SAVE!!!
            validator: function(el) {
                return el === this.password; 
            },
            message: 'Mật khẩu không trùng nhau!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }

});

userSchema.pre('save', async function(next) {
    // Chỉ chạy hàm này nếu mật khẩu đã thực sự được thay đổi 
    if(!this.isModified('password')) return next();

    // Băm mật khẩu với cost factor là 12 
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next){
    // Điều này trỏ đến query hiện tại
    this.find({ active: {$ne: false} });
    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword, 
    userPassword
    ) {
   return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) 
    {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime()/1000,
             10
            );

        console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp; // 100 < 200
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() +  10* 60 * 1000  ;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;