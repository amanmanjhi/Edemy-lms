import React, { useEffect, useState } from 'react'
import { createContext } from 'react';
import { dummyCourses } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration'

export const AppContext = createContext();

export const AppContextProvider = (props)=>{

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const [ allCourses , setAllCourses] = useState([])
    const [ isEducator , setIsEducator] = useState(true)
    const [ enrolledCourses ,setEnrolledCourses] = useState(true)

    // ! fetch all courses
    const fetchAllCourses = async ()=>{

        setAllCourses(dummyCourses)
    }


    // ! function to calculate average rating of course
    const calculateRating =(course)=>{
        let totalRating = 0;
        if(course.courseRatings.length === 0){
            return 0;
        }
        
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })

        return (totalRating / course.courseRatings.length)

    }

    // ! Function to calculate course chapter time

    const claculateChapterTime = (chapter)=>{
        let time = 0
        chapter.chapterContent.map((lecture)=>time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units:["h","m"]})
    }

    // ! function to calculate course Duration 

    const calculateCourseDuration = (course)=>{
        let time = 0
        course.courseContent.map((chapter)=>chapter.chapterContent.map((lecture)=>time+=lecture.lectureDuration))
        return humanizeDuration(time * 60 * 1000, {units:["h","m"]})
    }

    //! Function to calculate no of lectures in the course
    
    const calculateNoOfLectures =(course)=>{
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length
            }
        });
        return totalLectures;
    } 

    // ! Fetch User Enrolled Courses
    const fetchUserEnrolledCourses = async ()=>{
        setEnrolledCourses(dummyCourses)
    }

    useEffect(()=>{
        fetchAllCourses()
        fetchUserEnrolledCourses()
    },[])
    
    const value = {
        currency , allCourses , navigate , calculateRating, isEducator , setIsEducator, calculateCourseDuration, calculateNoOfLectures, claculateChapterTime, enrolledCourses, fetchUserEnrolledCourses
    }

    


    return (
        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )
};


// 
// () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default AppContext
