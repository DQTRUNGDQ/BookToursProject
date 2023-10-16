
const express = require('express');

const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


app.use(express.json());
app.use(express.static(`${__dirname}/public`))



app.use((req, res, next) => {
    console.log('Hello from the middleware 👏 ');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


//2) ROUTE HANDLES


// app.get('/api/v1/tours/:id', (req, res) => {
//     console.log(req.params);
//     const id = req.params.id * 1;

//     const tour = tours.find(el => el.id === id);

//     // if(id > tours.length)
//     if(!tour) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         })
//     }

//     res.status(200).json({
//         status: 'success',
//         tour
//     });
// });


// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);



// 3) ROUTES
//Mouting Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


module.exports = app;