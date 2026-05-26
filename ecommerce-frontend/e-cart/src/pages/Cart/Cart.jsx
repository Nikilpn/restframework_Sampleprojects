import React from 'react'
import Header from '../../components/Header/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import './Cart.css'

function Cart() {
  return (
    <>
      <Header />
      <div className='pt-32 mx-5'>
        <h1 className='text-5xl font-bold my-5'>Cart Summary</h1>
        <div className='grid grid-cols-3 gap-4'>
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
                <tr>
                  <td className='text-center p-3'>1</td>
                  <td className='text-center p-3'>Title</td>
                  <td className='text-center p-3'>
                    <img width={"70px"} height={"70px"} src="https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp" alt="Product IMG" className='mx-auto' />
                  </td>
                  <td className='text-center p-3'>
                    <div className='flex items-center justify-center'>
                      <button className='font-bold'>+</button>
                      <input type="text" value={10} className='border p-3 rounded w-16 mx-3' readOnly />
                      <button className='font-bold'>-</button>
                    </div>
                  </td>
                  <td className='text-center p-3'>10</td>
                  <td className='text-center p-3'>
                    <button><FontAwesomeIcon icon={faTrash} className='text-red-500' /></button>
                  </td>
                </tr>
              </tbody>
            </table>
            <hr className='mt-4' />
            <div className='float-right mt-4'>
              <button className='text-white text-xl p-2 rounded mx-2 bg-red-500'>Empty Cart</button>
              <button className='text-white text-xl p-2 rounded mx-2 bg-blue-500'>Shop More</button>
            </div>
 
          </div>
                     <div className='col-span-1 rounded shadow p-5'>
              <h2 className='font-bold text-2xl mb-4'>Total Amount : <span className='text-red-500'>₹ 499</span></h2>
              <hr />
              <button className='rounded bg-green-600 p-2 text-white w-full mt-4 text-xl'>CHECKOUT</button>
            </div>
        </div>
      </div>
    </>
  )
}

export default Cart