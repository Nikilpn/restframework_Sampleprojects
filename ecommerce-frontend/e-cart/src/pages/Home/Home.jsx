import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import './Home.css'

function Home() {
return (
<>
  <Header />
  <div className='pt-36 mx-5'>
    <div className='grid grid-cols-4 gap-4'>
      <div className='rounded p-2 shadow'>
        {/* image */}
        <img height={"200px"} src={"https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp"} alt="" />
        <div className='text-center'>
          {/* title */}
          <h3 className='text-center font bold text-2xl my-2'>Title</h3>
          
          {/* Link */}
          <Link to={`/:id/view`} className='bg-violet-700 p-1 rounded text-white mt-3 inline-block'>View More..</Link>
        </div>
      </div>
    </div>
  </div>
</>
  )
}
export default Home