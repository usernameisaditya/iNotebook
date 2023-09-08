const mongoose = require('mongoose');
// mongodb on cloud
const mongoURI = "mongodb+srv://adityachauhan84523:adityachauhan84523@cluster0.jfosgnq.mongodb.net/inotebook"
const connectToMongo = async() => {
   await mongoose.connect(mongoURI)
   console.log('connected to the database ')
}
module.exports = connectToMongo; 