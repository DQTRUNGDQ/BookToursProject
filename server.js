const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');


// 4) START SERVER
console.log(process.env.NODE_ENV)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

const x=23;
x = 22