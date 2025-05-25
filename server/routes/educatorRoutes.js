import express from 'express'
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js'
import upload from '../config/multer.js'
import { protectEducator } from '../middlewares/authMiddleware.js'

const educatorRouter = express.Router()

// Add Educator Role 

educatorRouter.get('/update-role',updateRoleToEducator)
educatorRouter.post('/add-course',upload.single('image'), protectEducator, addCourse)
educatorRouter.get('/courses', protectEducator, getEducatorCourses) // 8:33
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData) // 8:51
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData) // 8:51

export default educatorRouter;