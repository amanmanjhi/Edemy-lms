import {clerkClient} from '@clerk/express'
import User from '../models/user.js'
import Course from '../models/course.model.js'
import Purchase from '../models/purchase.model.js'
import {v2 as cloudinary} from 'cloudinary'

export const updateRoleToEducator = async (req,res)=>{
    try{
        const userId = req.auth.userId;

        let data = await clerkClient.users.updateUserMetadata(userId , {
            publicMetadata :{
                role :'educator'
            }
        })
        res.json({
            success:true,
            message:"You can publish a course now",
            data
        })

    }catch(error){
        res.json({success:false, message:error.message})
    }
}

// ! add new course

export const addCourse  = async (req, res) =>{
    try {
        const {courseData} = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId

        if( !imageFile ){
            res.json({
                success: false,
                message: "Thumbnail Not Attached"  
            })
        }

        const parseCourseData = JSON.parse(courseData)
        parseCourseData.educator = educatorId;

       const newCourse = await Course.create(parseCourseData);
       const imageUpload = await cloudinary.uploader.upload(imageFile.path);
       newCourse.courseThumbnail = imageUpload.secure_url;
       await newCourse.save()

       res.json({success: true, message:"course added successfully!"})

    } catch (error) {
        res.json({success: false, message: error.message});
    }
    
}

// ! get Educator Courses

export const getEducatorCourses = async (req, res) =>{
    try {
        const educator = req.auth.userId

        const courses = await Course.find({educator})
        res.json({success: true, courses})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// ! get educator dashboard data (total earning, enrolled students, no. of Courses )

export const educatorDashboardData = async (req, res)=>{
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const totalCourses = Course.length;

        const courseIds = courses.map(course => course._id);

        //todo calculate total earning from purchases
        const purchases = await Purchase.find({
            courseId: {$in : courseIds},
            status:'completed'
        });
        
        const totalEarnings = purchases.reduce((sum, purchase)=>sum + purchase.amount, 0)

        //todo Collect uninque enrolled students Ids with their course titles

        const enrolledStudentsData = [];
        for(const course of courses ){
            const students = await User.find({
                _id:{$in: course.enrolledStudents},
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                }); 
            });
        }

        res.json({success: true, dashboarData:{
            totalEarnings, enrolledStudentsData, totalCourses
        }})

    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// ! Get Enrolled Students Data With Purchase Data

export const getEnrolledStudentsData = async (req, res)=>{
    try {
        const educator = req.auth.userId;
        const courses = Course.find({educator});
        const courseIds = await courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: {$in : courseIds},
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map (purchase => ({
            student:purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseData: purchase.createdAt
        }));

        res.json({success:true, enrolledStudents})

    } catch (error) {
        res.json({success: false, message:error.message})
    }
}