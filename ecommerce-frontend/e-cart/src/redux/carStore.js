import productReducer from "./productsSlice";
// store
import { configureStore } from "@reduxjs/toolkit";

const CartStore=configureStore({
    reducer:{
        productsReducer:productReducer
    }
})
export default CartStore