import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({course}) => {
const { currency } = useContext(AppContext)

  return (
    <Link to={'/course/' + course._id } onClick={()=>scrollTo(0,0)}>
    <div className=''>
      <img src={course.courseThumbnail} alt="" />
      <div>
        <h3>{course.courseTitle}</h3>
        <p>{course.educator.name}</p>

        <div>

          <p>4.5</p>
          <div>
            {[...Array(5)].map((_ , i)=>(<img key ={i} src={assets.star} alt='' />))}
          </div>
          <p>52</p>

        </div>
        <p>{currency}{(course.coursePrice - (course.discount*course.coursePrice/100).toFixed(2))}</p>
      </div>
    </div>
    </Link>
  )
}

export default CourseCard
