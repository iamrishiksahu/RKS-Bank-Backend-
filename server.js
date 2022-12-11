require('dotenv').config();
const express = require('express')
const app = express();
const path = require('path');
const {requestLogger} = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/dbConfig');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const rootRouter = require('./routes/root');

const PORT = process.env.PORT || 3300;

// Connecting to mongoDB database
connectDB()

/** Log details of every request */
app.use(requestLogger)

// builtin middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-wwww-form-urlencoded'
app.use(express.urlencoded({ extended: false }))

// built-in middleware to parse json body of requests
app.use(express.json())

app.use(cookieParser())

/** All serviceable routes are under this root router */
rootRouter(app)

/** If no serviceable route matches the requested route, then we show a 404 */
app.use('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '.', 'public', '404.html'))
})

/** If the request couldn't be handled by any of the above arrangements, it's an error. */
app.use(errorHandler);

// We only want to listen if there is a mongodb connection. (Only Once)
mongoose.connection.once('open', ()=> {
    console.log('Connected to MongoDB!');
    app.listen(PORT, () =>{
        console.log(`Server is running at ${PORT}`);
    })
})