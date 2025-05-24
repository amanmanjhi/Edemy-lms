import mongoose from "mongoose";

// ! connecting to the MongoDB dataBase

const connectDB = async ()=>{
    mongoose.connection.on('connected' , ()=>{
        console.log("dataBase connected")    
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/edemy`)
    // console.log("collection created")
}

export default connectDB;
// module.exports = {connectDB}