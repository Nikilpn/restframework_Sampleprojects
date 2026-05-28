import productReducer from "./productsSlice";
// store
import { configureStore, createReducer } from "@reduxjs/toolkit";
import wishListSlice from "./slice/wishListSlice";
import cartSlice from "./slice/cartSlice"
const CartStore=configureStore({
    reducer:{
        productsReducer:productReducer,
        wishListReducer:wishListSlice,
        cartReducer:cartSlice
   
    }
})
export default CartStore