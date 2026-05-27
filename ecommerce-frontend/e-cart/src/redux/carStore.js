import productReducer from "./productsSlice";
// store
import { configureStore } from "@reduxjs/toolkit";
import wishListSlice from "./slice/wishListSlice";


const CartStore=configureStore({
    reducer:{
        productsReducer:productReducer,
        wishListReducer:wishListSlice,
   
    }
})
export default CartStore