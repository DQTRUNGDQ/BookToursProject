const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync')

exports.getOverview = catchAsync(async(req, res, next) =>{
    // 1) Lấy dữ liệu tour từ collection
    const tours = await Tour.find();

    // 2) Xây dựng template
    // 3) Kết xuất template trên với việc sử dụng dữ liệu tour từ 1)
    
    res.status(200).render('overview', {
        title: 'Hàng loạt Tour trải nghiệm',
        tours
    });
});

exports.getTour  = catchAsync(async (req, res, next) =>{
    // 1) Lấy dữ liệu, cho Tour được yêu cầu (bao gồm cả đánh giá và hướng dẫn viên)
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    }); 
    // 2) Xây dựng template
    // 3) Kết xuất template sử dụng dữ liệu từ 1)

    res.status(200).render('tour', {
        title: tour.name,
        tour
    });
});