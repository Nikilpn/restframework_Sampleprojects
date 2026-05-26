import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faHouse } from '@fortawesome/free-solid-svg-icons'

function PageNotFound() {
  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen text-center'>
        <FontAwesomeIcon icon={faCartShopping} className='text-violet-800 text-8xl mb-5' />
        <h1 className='text-8xl font-bold text-violet-800'>404</h1>
        <h2 className='text-2xl font-bold mt-3'>Page Not Found</h2>
        <p className='text-gray-500 mt-2'>Oops! The page you are looking for does not exist.</p>
        <Link to={"/"} className='bg-violet-700 text-white px-5 py-2 rounded mt-5 inline-block'>
          <FontAwesomeIcon icon={faHouse} className='mr-2' />
          Back to Home
        </Link>
      </div>
    </>
  )
}

export default PageNotFound