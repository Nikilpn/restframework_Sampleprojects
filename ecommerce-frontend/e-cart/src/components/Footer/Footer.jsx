import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPeopleGroup, faHeart, faCartShopping, faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import './Footer.css'
function Footer() {
  return (
    <>
      <footer className='bg-emerald-600 text-white p-10 mt-10'>
        <div className='grid grid-cols-3 gap-4'>

          {/* Logo & About */}
          <div>
            <h2 className='text-2xl font-bold mb-3'>
              <FontAwesomeIcon icon={faPeopleGroup} className='mr-2' />
              Friends Cart
            </h2>
            <p className='text-sm text-gray-300'>Your one stop shop for all daily needs. Fast delivery, great prices!</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-xl font-bold mb-3'>Quick Links</h3>
            <ul className='space-y-2'>
              <li><Link to={"/"} className='hover:text-gray-300'>🏠 Home</Link></li>
              <li><Link to={"/Wishlist"} className='hover:text-gray-300'>
                <FontAwesomeIcon icon={faHeart} className='text-red-500 mr-1' />Wishlist
              </Link></li>
              <li><Link to={"/cart"} className='hover:text-gray-300'>
                <FontAwesomeIcon icon={faCartShopping} className='text-green-500 mr-1' />Cart
              </Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='text-xl font-bold mb-3'>Contact Us</h3>
            <ul className='space-y-2 text-sm text-gray-300'>
              <li><FontAwesomeIcon icon={faEnvelope} className='mr-2' />Friendscart@gmail.com</li>
              <li><FontAwesomeIcon icon={faPhone} className='mr-2' />+91 9876543210</li>
              <li><FontAwesomeIcon icon={faLocationDot} className='mr-2' />Kerala, India</li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className='text-center border-t border-violet-600 mt-8 pt-4 text-sm text-gray-300'>
          <p>© 2024 Friends Cart. All rights reserved.</p>
        </div>

      </footer>
    </>
  )
}

export default Footer