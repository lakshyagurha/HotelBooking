import React, { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

export const BookingPage = () => {

    const [redirect, setRedirect] = useState(false)
    const {id} = useParams();

    if(redirect){
        return <Navigate to={redirect} />
    }
  return (
    <div className='bg-gray-600 mt-4 mb-4 flex justify-center items-center min-h-screen '>
    <div className=''>
        <div className='text-4xl text-white mb-4'>
        Booking Successfull


        </div>
        <button onClick={()=> setRedirect('/account/bookings')} className="primary"> Go to my Bookings</button>

        
    </div>

    </div>
  )
}
