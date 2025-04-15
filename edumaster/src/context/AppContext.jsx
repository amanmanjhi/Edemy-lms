import React, { useEffect, useState } from 'react'
import { createContext } from 'react';

export const AppContext = createContext();

export const AppContextProvider = (props)=>{

    const currency = import.meta.env.VITE_CURRENCY

    const [allCourses, setAllCourses] = useState([])

    // ! fetch all courses
    const fetchAllCourses = async ()=>{

        setAllCourses(dummyCourses)
    }

    useEffect(()=>{
        fetchAllCourses()
    },[])
    
    const value = {
        currency , allCourses
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
