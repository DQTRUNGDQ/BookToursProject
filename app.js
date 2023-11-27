const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');


const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));


// 1) GLOBAL MIDDLEWARES

// Phục vụ những tập tin tĩnh 
app.use(express.static(path.join(__dirname, 'public')));


// Đặt bảo mật HTTP headers

app.use(helmet());

// Ghi nhật ký phát triển

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Giới hạn các yêu cầu từ cùng một API

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Quá nhiều các yêu cầu từ địa chỉ IP này, vui lòng thử lại sau 1 giờ!'
});

app.use('/api',limiter);

// Phân tích Body, đọc dữ liệu từ body vào req.body 
app.use(express.json( { limit: '10kb' } ));

// Loại bỏ dữ liệu không an toàn đối với truy vấn chèn vào NoSQL
app.use(mongoSanitize());

// Loại bỏ dữ liệu đối với XSS 
app.use(xss());

// Ngăn chặn tham số độc hại 
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));


// Kiểm tra Middleware

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});


// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;