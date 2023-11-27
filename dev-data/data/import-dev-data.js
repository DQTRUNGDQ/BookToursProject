const fs = require('fs')

const mongoose = require("mongoose");

const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');

// const Review = require('../../models/reviewModel');

// const User = require('../../models/userModel');


dotenv.config({path: './config.env'});

// Connect Mongoose

const DB = process.env.DATABASE.replace(
    '<PASSWORD>', 
    process.env.DATABASE_PASSWORD
);

mongoose
    // .connect(process.env.DATABASE_LOCAL, {
    .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => { 
    console.log('DB kết nối thành công!');
});


    //ĐỌC TỆP JSON

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')); 
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8')); 
// const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')); 

    //NHẬP DỮ LIỆU VÀO DATABASE
const importData = async () =>{
    try {
        await Tour.create(tours);
        // await User.create(users);
        // await Review.create(reviews);
        console.log('Dữ liệu đã được tải thành công!')
    } catch (err) {
        console.log(err)
    }
    process.exit()
};

    //XÓA TẤT CẢ DỮ LIỆU TỪ COLLECTIONS
const deleteData = async () => {
    try {
        await Tour.deleteMany();
         // await User.deleteMany(users);
        // await Review.deleteMany(reviews);
        console.log('Dữ liệu đã được xóa thành công!')
    } catch (err) {
        console.log(err)
    }
    process.exit()
};

if(process.argv[2] === '--import')
{
    importData();
} else if (process.argv[2] === '--delete') 
{
    deleteData();
}

console.log(process.argv);

// node ./dev-data/data/import-dev-data.js -- import / --delete