import React, { useEffect, useState } from 'react'
import { createContext } from 'react';
import { dummyCourses } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

export const AppContextProvider = (props)=>{

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const [ allCourses , setAllCourses] = useState([])
    const [ isEducator , setIsEducator] = useState(true)

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

    useEffect(()=>{
        fetchAllCourses()
    },[])
    
    const value = {
        currency , allCourses , navigate , calculateRating, isEducator , setIsEducator
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
