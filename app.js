require('dotenv').config();
// async errors
require('express-async-errors')
const express = require('express');
const app = express();

const connectDB = require('./db/connect')
const productsRouter = require('./routes/products');
const notFoundMiddleware = require('./middleware/not-found'); 
const errorMiddleware = require('./middleware/error-handler');


//middleware
app.use(express.json());


// routes

app.get('/', (req, res) => {
    res.send('<h1>Store api</h1><a href="/api/v1/products">products route</a>')
})

app.use('/api/v1/products', productsRouter)
// products route

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port  = process.env.PORT || 3000;

const start = async () => {
    try {
        // connect db
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Listening on port ${port}`))

        app.listen()
    } catch (error) {
        console.log(error)
    }
}

start();

// 05:04