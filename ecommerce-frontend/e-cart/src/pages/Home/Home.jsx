import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import './Home.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts } from '../../redux/productsSlice'

function Home() {
  const dispatch = useDispatch()
  const { allproducts, loading, error } = useSelector(state => state.productsReducer)

  useEffect(() => {
    if (allproducts.length === 0) {
      dispatch(fetchAllProducts())
    }
  }, [])

  return (
    <>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='pt-36 mx-5'>
          <div className='grid grid-cols-4 gap-4'>
            {allproducts?.length > 0 ? allproducts?.map((product) => (
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
        </div>
      )}
    </>
  )
}

export default Home