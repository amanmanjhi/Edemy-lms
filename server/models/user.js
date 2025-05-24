
import mongoose, { mongo } from "mongoose";
// import { type } from "os";


const userSchema = new mongoose.Schema(
    {
        _id:{type: String, required:true},
        name:{type: String, required:true},
        email:{type: String, required:true},
        image:{type: String, required:false},
        imageUrl:{type: String, required:false}, //todo: make it true after postman testing
        enrolledCourses :[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }],
    },
    { timestamps:true, minimize:false}
);

const User = mongoose.model('User', userSchema);

export default User

