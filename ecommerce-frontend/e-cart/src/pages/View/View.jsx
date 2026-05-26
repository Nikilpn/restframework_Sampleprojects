import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faHeart, faStar } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import Header from '../../components/Header/Header'

function View() {
  const { id } = useParams()

  return (
    <>
     <Header />
      <div className='pt-36 mx-5'>
        <div className='grid grid-cols-2 gap-4'>

          {/* Left - Image & Buttons */}
          <div className='rounded p-2 shadow flex flex-col items-center'>
            <img
              height={"300px"}
              src={"https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"}
              alt=""
            />
            <div className='flex justify-evenly w-full mt-4'>
              <button className='bg-blue-600 text-white px-4 py-2 rounded'>
                <FontAwesomeIcon icon={faHeart} className='mr-2' />
                ADD TO WISHLIST
              </button>
              <button className='bg-green-600 text-white px-4 py-2 rounded'>
                <FontAwesomeIcon icon={faCartShopping} className='mr-2' />
                ADD TO CART
              </button>
            </div>
          </div>

          {/* Right - Details */}
          <div className='rounded p-4 shadow'>
            <h2 className='text-2xl font-bold'>Product Title</h2>
            <p className='text-red-500 text-xl font-bold mt-1'>$ 9.99</p>

            <div className='mt-3'>
              <p><span className='font-bold'>Brand :</span> Brand Name</p>
              <p><span className='font-bold'>Category :</span> Category</p>
              <p className='mt-2'><span className='font-bold'>Description :</span> Product description goes here.</p>
            </div>

            {/* Reviews */}
            <div className='mt-4'>
              <h3 className='font-bold text-lg'>Client Reviews</h3>
              <div className='mt-2 space-y-2'>
                <div className='border rounded p-2'>
                  <p><span className='font-bold'>Eleanor Collins :</span> Would not recommend!!</p>
                  <p>Rating : 3 <FontAwesomeIcon icon={faStar} className='text-yellow-400' /></p>
                </div>
                <div className='border rounded p-2'>
                  <p><span className='font-bold'>Lucas Gordon :</span> Very satisfied!!</p>
                  <p>Rating : 4 <FontAwesomeIcon icon={faStar} className='text-yellow-400' /></p>
                </div>
                <div className='border rounded p-2'>
                  <p><span className='font-bold'>Eleanor Collins :</span> Highly Impressed!!</p>
                  <p>Rating : 5 <FontAwesomeIcon icon={faStar} className='text-yellow-400' /></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default View