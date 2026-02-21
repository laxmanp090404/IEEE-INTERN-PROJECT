const mongoose = require('mongoose')
const dbConnect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
         console.log(`Successfully Connected to DB of address ${mongoose.connection.host}`.bgGreen.black.cyan.underline )
    } catch (error) {
        console.log(`Error: ${error.message}`.red.bold)
        process.exit(1)
    }
}
module.exports = dbConnect