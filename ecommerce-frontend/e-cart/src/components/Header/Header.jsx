import { faCartShopping, faStar, faPeopleGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import './Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from '../../redux/productsSlice';

function Header({homeHeader}) {
  const wishListData=useSelector(state=>state.wishListReducer)
  const CartData=useSelector(state=>state.cartReducer
  

  )
  const dispatch=useDispatch()
  return (
    <>
      <nav className='flex justify-between p-5 text-xl bg-emerald-600 text-white font-bold fixed w-full top-0 z-50'>
        <Link to={"/"} className='text-2xl flex items-center gap-2'>
          <FontAwesomeIcon icon={faPeopleGroup} />Friends Cart
        </Link>
        <ul className='flex desktop-nav'>
          {
            homeHeader && <li className='mx-5'>
              <input onChange={(e)=>dispatch(searchProducts(e.target.value))} type='text' className='text-white-500 p-3 rounded border outline-none'placeholder='Search Products Here'/>
              
            </li>
          }
          <li className='mx-5 rounded-1 border-2 p-3'>
            <Link to={"/Wishlist"} className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faStar} className='text-red-500' />
              Wishlist <span className='p-1 bg-black rounded-full ms-1'>{wishListData?.length}</span>
            </Link>
          </li>
          <li className='mx-5 rounded-1 border-2 p-3'>
            <Link to={"/cart"} className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faCartShopping} className='text-green-500' />
              Cart <span className='p-1 bg-black rounded-full ms-1'>{CartData?.length}</span>
            </Link>
          </li>
        </ul>

        {/* Mobile card row — shown below logo on small screens */}
        <div className='mobile-nav-cards'>
          <Link to={"/Wishlist"} className='mobile-nav-card'>
            <FontAwesomeIcon icon={faStar} className='text-red-400' />
            <span>Wishlist</span>
            <span className='mobile-nav-badge text-center'>{wishListData?.length}</span>
          </Link>
          <Link to={"/cart"} className='mobile-nav-card'>
            <FontAwesomeIcon icon={faCartShopping} className='text-green-30' />
            <span>Cart</span>
            <span className='mobile-nav-badge'>{CartData?.length}</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Header