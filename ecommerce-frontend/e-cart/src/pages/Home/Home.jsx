import React, { use, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import './Home.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts } from '../../redux/productsSlice'
import { faBackward, faForward } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Home() {
  const dispatch = useDispatch()
  const { allproducts, loading, error } = useSelector(state => state.productsReducer)

  const productsPerPage=8
  const totalPages=Math.ceil(allproducts.length/productsPerPage)
  const [currentPage,setCurrentPage]=useState(1)
  const currentPageProductLastIndex=currentPage*productsPerPage
  const currentPageProductFirstIndex=currentPageProductLastIndex-productsPerPage

  const visibleProduct=allproducts?.slice(currentPageProductFirstIndex,currentPageProductLastIndex)

  const navigatePrevPage=()=>{
    if(currentPage!=1){
      setCurrentPage(currentPage-1)
    }

    

  }
  const navigateNextPage=()=>{
    if(currentPage!=totalPages){
      setCurrentPage(currentPage+1)
    }

  }

  useEffect(() => {
    if (allproducts.length === 0) {
      dispatch(fetchAllProducts())
    }
  }, [])
  useEffect(() => {
  setCurrentPage(1)
}, [allproducts])

  return (
    <>
      <Header homeHeader={true} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='pt-36 mx-5'>
          <div className='grid grid-cols-4 gap-4'>
            {allproducts?.length > 0 ? visibleProduct?.map((product) => (
              <div key={product?.id} className='rounded p-2 shadow flex flex-col h-full'>
                <div className='flex justify-center items-center h-48'>
                  <img
                    className='h-full w-full object-contain'
                    src={product?.thumbnail}
                    alt={product?.title}
                  />
                </div>
                <div className='text-center flex flex-col flex-1'>
                  <h3 className='text-center font-bold text-2xl my-2'>{product?.title}</h3>
                  <div className='mt-auto pb-2'>
                    <Link to={`${product?.id}/view`} className='bg-emerald-600 p-1 rounded text-white mt-3 inline-block'>View More..</Link>
                  </div>
                </div>
              </div>
            )) : <p>No Products Found</p>}
          </div>

          {/* Pagination */}
          <div className='text-center mt-20 font-bold text-2xl'>
            <button onClick={navigatePrevPage}  className='cursor-pointer'>
              <FontAwesomeIcon icon={faBackward} />
            </button>
            <span className='ms-3 me-3'>{currentPage} of {totalPages}</span>
            <button onClick={navigateNextPage} className='cursor-pointer'>
              <FontAwesomeIcon icon={faForward} />
            </button>
          </div>
          
        </div>
      )}
    </>
  )
}

export default Home