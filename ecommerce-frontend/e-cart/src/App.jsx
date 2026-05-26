import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Footer from "./components/Footer/Footer"
import Home from "./pages/Home/Home"
import Cart from "./pages/Cart/Cart"
import View from "./pages/View/View"
import Wishlist from "./pages/WishList/Wishlist"
import PageNotFound from "./pages/pageNotFound/pageNotFound"

function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-1'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Cart' element={<Cart />} />
          <Route path='/Wishlist' element={<Wishlist />} />
          <Route path='/:id/view' element={<View />} />
          <Route path='/*' element={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App