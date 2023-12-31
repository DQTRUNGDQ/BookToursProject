// Create Model
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Một Tour phải có tên'],
            unique: true,
            trim: true,
            maxlength: [40, 'Một tên Tour phải có ít hơn hoặc bằng 40 ký tự'],
            minlength:  [10, 'Một tên Tour phải có ít nhất 10 ký tự'],
            // validate: [validator.isAlpha, 'Tour name must only contain characters']
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'Một Tour phải có một khoảng thời hạn']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'Một Tour phải có quy mô nhóm']
        },
        ratingsAverage:{
            type: Number,
            default: 4.5,
            min: [1, 'Đánh giá phải trên 1.0'],
            max: [5, 'Đánh giá phải dưới 5.0'],
            set: val => Math.round(val * 10) /10 // 4.66666, 4.7
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required:  [true, 'Một Tour phải có một mức giá']
        },
        priceDiscount: {
                type: Number,
                validate: {
                    validator:function(val) {
                        //  this only points to current doc on NEW document creation
                        return val < this.price; 
                    } , 
                    message: 'Discount price ({VALUE}) should be below regular price'
            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'Một Tour phải có mô tả']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'Một Tour phải có ảnh bìa']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        },
        startLocation: {
            // GeoJSON 
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String

        },
        locations: [
            {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
            }
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
    }, 
    {
        toJSON: { virtuals: true},
        toObject: {virtuals: true}
    }
    );

// tourSchema.index( { price: 1 } );
tourSchema.index( { price: 1, ratingsAverage: -1 } );
tourSchema.index( {slug: 1} );
tourSchema.index({ startLocation: '2dsphere'});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

//Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});
 
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises)
//     next();
// });

// tourSchema.pre('save', function(next) {
//     console.log('Will save document...')
//     next();
// });

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// });


//QUERY MIDDLEWARE
//tourSchema.pre('find', function(next)) {
 tourSchema.pre(/^find/, function(next) {
    this.find( { secretTour: {$ne: true}} );

    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function(next){
    this.populate({
            path: 'guides',
            select: '-__v -passwordChangedAt'
        });

    next();
});


 tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
 });



 // AGGREGATION MIDDLEWARE

//  tourSchema.pre('aggregate', function(next){
//     this.pipeline().unshift( {$match: {secretTour: { $ne : true }}} )

//     console.log(this.pipeline());
//     next();
//  });


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;