import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faHeartCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'

function Wishlist() {
  return (
    <>
    <Header/>
    <div className='pt-36 mx-5'>
    <div className='grid grid-cols-4 gap-4'>
      <div className='rounded p-2 shadow'>
        {/* image */}
        <img height={"200px"} src={"https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp"} alt="" />
        <div className='text-center'>
          {/* title */}
          <h3 className='text-center font-bold text-xl'>Title</h3>
          {/* action button */}
          <div className='flex justify-evenly text-2xl my-2'>
            <button className=''><FontAwesomeIcon icon={faHeartCircleXmark} className='text-red-500'/></button>
            <button className=''><FontAwesomeIcon icon={faCartShopping} className='text-green-500'/></button>
          </div>
          {/* Link */}
          <Link to={`/:id/view`} className='bg-emerald-600 p-1 rounded text-white mt-3 inline-block'>View More..</Link>
        </div>
      </div>
    </div>
  </div>
  </>
  )
}

export default Wishlist
