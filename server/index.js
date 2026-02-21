const express = require('express')
const app = express()
const morgan = require('morgan')
const colors = require('colors')
require('dotenv').config()
const dbConnect = require('./Config/dbConnect')
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan('dev'))

dbConnect();

//Routes
app.use('/auth', require('./Routes/auth.routes'))
app.use('/users', require('./Routes/user.routes'))
app.use('/tasks', require('./Routes/task.routes'))

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to Task Management API' });
});

try {
    app.listen(PORT,()=>{
        console.log(`Server is running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgMagenta.black.cyan.underline);
    })
    
} catch (error) {
    console.log(error);
    console.log('Failed to listen');
}