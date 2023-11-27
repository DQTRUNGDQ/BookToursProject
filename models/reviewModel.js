// review / rating / createAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
        {
            review: {
                type: String,
                required: [true, 'Lời nhận xét không thể để trống!']
            },
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            tour: {
                type: mongoose.Schema.ObjectId,
                ref: 'Tour',
                required: [true, 'Lời nhận xét phải thuộc về một Tour.']
            },
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: [true, 'Lời nhận xét phải thuộc về một người dùng.']
            }
        },
        {
            toJSON: { virtuals: true},
            toObject: {virtuals: true}
        }
    );

reviewSchema.index( { tour: 1, user: 1 }, { unique: true } );

reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // });
    // next();

    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats =  await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
     ]);
    //  console.log(stats);

     if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating
        });
     } else {
        await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: 0,
        ratingsAverage: 4.5
        });
     }
     
};

reviewSchema.post('save', function() {
    // Điều này chỉ ra đánh giá hiện tại
    this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/findOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    // await this.findOne(); Không làm việc được ở đây, truy vấn này đã được thực thi rồi
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;


