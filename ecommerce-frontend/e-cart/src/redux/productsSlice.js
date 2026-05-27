import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchAllProducts=createAsyncThunk("products/fetchAllProducts",async()=>{
    const result =await axios.get("https://e-commerce-d2dn.onrender.com/api/products/")
   
    return result.data
})

const productSlice=createSlice(
    {
        name:"products",
        initialState:{
            allproducts:[],
            loading:true,
            error:""
        },
 reducers: {},
  extraReducers: (builder) => {   
    builder.addCase(fetchAllProducts.pending, (state, action) => {
      // state.allproducts = [],
      state.loading=true,
      state.error=""
    }),
      builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.allproducts = action.payload,
      state.loading=false,
      state.error=""
    }),
      builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.allproducts = [],
      state.loading=false,
      state.error="API CALL failed"
    })
    
    
  }
})
export default productSlice.reducer