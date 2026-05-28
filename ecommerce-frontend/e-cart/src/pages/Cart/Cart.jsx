import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import './Cart.css'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { decrementQuantity, emptyCart, incrementQuantity, removeCartItem } from '../../redux/slice/cartSlice'

function Cart() {
  const cartData = useSelector(state => state.cartReducer)
  const [cartTotalAmount, setCartTotalAmount] = useState(0)
  const dispatch=useDispatch()
  const navigate=useNavigate()


  const handleDecrementQuantity=(product)=>{
    if(product?.quantity>1){
      dispatch(decrementQuantity(product?.id))
    }
    else{
      dispatch(removeCartItem(product?.id))
    }

  }
  const handleCheckOut=()=>{
    dispatch(emptyCart())
    alert("Your Order has been confirmed...Thankyou for shopping with us!!!")
    navigate("/")
  }

useEffect(() => {
  if (cartData?.length > 0) {
    const total = cartData.reduce((prev, curr) => {
      return prev + parseFloat(curr.totalprice)
    }, 0)
    setCartTotalAmount(Math.ceil(total))
  } else {
    setCartTotalAmount(0)
  }
}, [cartData])
  return (
    <>
      <Header />
      <div className='pt-32 mx-5'>
        {cartData?.length > 0 ?
          < div className='grid grid-cols-3 gap-4'>
            <h1 className='text-5xl font-bold my-5'>Cart Summary</h1>
            {/* table */}
            <div className='col-span-2 rounded shadow p-5'>
              <table className='w-full table-auto'>
                <thead>
                  <tr>
                    <th className='text-center p-3'>#</th>
                    <th className='text-center p-3'>Name</th>
                    <th className='text-center p-3'>Image</th>
                    <th className='text-center p-3'>Quantity</th>
                    <th className='text-center p-3'>Price</th>
                    <th className='text-center p-3'>...</th>
                  </tr>
                </thead>
                <tbody>
                  {cartData?.map((product, index) => (
                    <tr>
                      <td className='text-center p-3'>{index + 1}</td>
                      <td className='text-center p-3'>{product?.title}</td>
                      <td className='text-center p-3'>
                        <img width={"70px"} height={"70px"} src={product?.thumbnail} alt="Product IMG" className='mx-auto' />
                      </td>
                      <td className='text-center p-3'>
                        <div className='flex items-center justify-center'>
                          <button onClick={()=>handleDecrementQuantity(product)} className='font-bold'>-</button>
                          <input type="text" value={product?.quantity} className='border p-3 rounded w-16 mx-3' readOnly />
                          <button onClick={()=>dispatch(incrementQuantity(product?.id))} className='font-bold'>+</button>
                        </div>
                      </td>
                      <td className='text-center p-3'>{product?.totalprice}</td>
                      <td className='text-center p-3'>
                        <button onClick={()=>dispatch(removeCartItem(product?.id))}><FontAwesomeIcon icon={faTrash} className='text-red-500' /></button>
                      </td>
                    </tr>))}
                </tbody>
              </table>
              <hr className='mt-4' />
              <div className='float-right mt-4'>
                <button  onClick={()=>dispatch(emptyCart())} className='text-white text-xl p-2 rounded mx-2 bg-red-500'>Empty Cart</button>
                <Link to={"/"} className='text-white text-xl p-2 rounded mx-2 bg-blue-500'>Shop More</Link>
              </div>

            </div>
            <div className='col-span-1 rounded shadow p-5'>
              <h2 className='font-bold text-2xl mb-4'>Total Amount : <span className='text-red-500'>₹ {cartTotalAmount}</span></h2>
              <hr />
              <button onClick={handleCheckOut} className='rounded bg-green-600 p-2 text-white w-full mt-4 text-xl'>CHECKOUT</button>
            </div>
          </div>
          :
<div className="flex justify-center items-center flex-col my-10 mt-36">
  <img 
    className="w-64 h-64 object-contain" 
    src="https://img.icons8.com/clouds/1200/shopping-cart.jpg" 
    alt="Empty Cart" 
  />
  <p className="font-bold my-10 text-xl">Your cart is Empty...!</p>
  <Link to={"/"} className="text-blue-500 underline">Back to Home</Link>
</div>
        }


      </div >
    </>
  )
}

export default Cart