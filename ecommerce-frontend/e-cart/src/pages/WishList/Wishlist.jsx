import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faHeartCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import { useSelector, useDispatch } from 'react-redux'
import { removeWishListItem } from '../../redux/slice/wishListSlice' 
import "./Wishlist.css"
import { addToCart } from '../../redux/slice/cartSlice'


function Wishlist() {
  const wishListData = useSelector(state => state.wishListReducer)
  const dispatch = useDispatch()
  const cartData=useSelector(state=>state.cartReducer)

  const handleAddToCart=(product)=>{
    dispatch(addToCart(product))
    dispatch(removeWishListItem(product?.id))
    const existingProduct=cartData?.find(item=>item?.id==product?.id)
    if(existingProduct){
      alert("Product Updated Successfully!!!")
    }
  }


  return (
    <>
      <Header />
      <div className='pt-36 mx-5'>
        {wishListData?.length > 0 ?
          <div className='grid grid-cols-4 gap-4'>
            {wishListData.map((product) => ( 
              <div key={product.id} className='rounded p-2 shadow'>
                {/* image */}
                <img className='h-48 w-full object-contain' src={product.thumbnail} alt={product.title} />
                <div className='text-center'>
                  {/* title */}
                  <h3 className='text-center font-bold text-xl'>{product.title}</h3>
                  <p className='text-green-600 font-semibold text-lg'>${product.price}</p>


                  {/* action buttons */}
                  <div className='flex justify-center text-2xl my-2 gap-6' >
                    <button onClick={() => dispatch(removeWishListItem(product?.id))}>
                      <FontAwesomeIcon icon={faHeartCircleXmark} className='text-red-500' />
                    </button>
                    <button onClick={() => handleAddToCart(product)}>
                      <FontAwesomeIcon icon={faCartShopping} className='text-green-500' />
                    </button>
                  </div>
                  {/* Link */}
                  <Link to={`/${product.id}/view`} className='bg-emerald-600 p-1 rounded text-white mt-3 inline-block '>
                    View More..
                  </Link>
                </div>
              </div>
            ))}
          </div>
          :
          <p>Your Wishlist is Empty!!!</p>
        }
      </div>
    </>
  )
}

export default Wishlist