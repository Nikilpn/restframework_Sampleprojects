import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faHeart, faStar } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts } from '../../redux/productsSlice'
import Header from '../../components/Header/Header'

function View() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { allproducts, loading } = useSelector(state => state.productsReducer)
  const product = allproducts?.find(p => p.id === parseInt(id))

  useEffect(() => {
    if (allproducts.length === 0) {
      dispatch(fetchAllProducts())
    }
  }, [])

  if (loading || !product) return <><Header /><p className='pt-36 mx-5'>Loading...</p></>

  return (
    <>
      <Header />
      <div className='pt-36 mx-5'>
        <div className='grid grid-cols-2 gap-4'>
          {/* Left - Image & Buttons */}
          <div className='rounded p-2 shadow flex flex-col items-center'>
            <img height={"300px"} src={product?.thumbnail} alt="" />
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
            <h2 className='text-2xl font-bold'>{product?.title}</h2>
            <p className='text-red-500 text-xl font-bold mt-1'>$ {product?.price}</p>
            <div className='mt-3'>
              <p><span className='font-bold'>Brand :</span> {product?.brand}</p>
              <p><span className='font-bold'>Category :</span> {product?.category}</p>
              <p className='mt-2'><span className='font-bold'>Description :</span> {product?.description}</p>
            </div>

            {/* Reviews */}
            <div className='mt-4'>
              <h3 className='font-bold text-lg'>Client Reviews</h3>
              <div className='mt-2 space-y-2'>
                {product?.reviews?.map((review, index) => (
                  <div key={index} className='border rounded p-2'>
                    <p><span className='font-bold'>{review?.reviewerName} :</span> {review?.comment}</p>
                    <p>Rating : {review?.rating} <FontAwesomeIcon icon={faStar} className='text-yellow-400' /></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default View