const mongoose = require("mongoose")

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
     console.log(`Successfully Connected to DB of address ${mongoose.connection.host}`.bgGreen.black.cyan.underline )
  } catch (error) {
    console.log(`Mongo not ready, retrying...`.red.bold)
    setTimeout(dbConnect, 5000)
  }
}

module.exports = dbConnect

