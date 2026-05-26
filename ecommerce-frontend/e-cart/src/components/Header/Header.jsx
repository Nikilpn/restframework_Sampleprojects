import {faCartShopping, faHeart, faTruckFast } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import './Header.css';

function Header() {
    return (
        <>
            <nav className='flex justify-between p-5 text-xl bg-violet-800 text-white font-bold fixed w-full'>
                <Link to={"/"} className='text-2xl'><FontAwesomeIcon icon={faTruckFast} className='ms-3' />Daily Cart</Link>
                <ul className='flex'>

                    <li className='mx-5 rounded-1 border-2 p-3'><Link to={"/Wishlist"}><FontAwesomeIcon icon={faHeart}
                        className='text-red-500' />Wishlist <span className='p-1 bg-black rounded-full ms-1'>10</span></Link></li>

                    <li className='mx-5 rounded-1 border-2 p-3'><Link to={"/cart"}><FontAwesomeIcon icon={faCartShopping}
                        className='text-green-500' />Cart <span className='p-1 bg-black rounded-full ms-1'>10</span></Link></li>

                </ul>
            </nav>


        </>
    )
}

export default Header
