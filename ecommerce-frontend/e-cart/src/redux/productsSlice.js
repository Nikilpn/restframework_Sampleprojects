import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async () => {
    const result = await axios.get(
      "https://e-commerce-d2dn.onrender.com/api/products/",
    );
    sessionStorage.setItem("allproducts", JSON.stringify(result.data));

    return result.data;
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    allproducts: [],
    dummyAllProducts:[],
    loading: true,
    error: "",
  },
  reducers: {
    //sycnchrounous actions
    searchProducts: (state, action) => {
      state.allproducts = state.dummyAllProducts?.filter((product) =>
        product?.title.toLowerCase().includes(action.payload.toLowerCase()),
      );
    },
  },
  //asychronous actions
  extraReducers: (builder) => {
    (builder.addCase(fetchAllProducts.pending, (state, action) => {
      // state.allproducts = [],
      ((state.loading = true), (state.error = ""));
    }),
      builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
        ((state.allproducts = action.payload),
          (state.loading = false),
          (state.error = ""),
          (state.dummyAllProducts=action.payload)
        );
      }),
      builder.addCase(fetchAllProducts.rejected, (state, action) => {
        ((state.allproducts = []),
          (state.loading = false),
          (state.error = "API CALL failed"));
      }));
  },
});
export const { searchProducts } = productSlice.actions;
export default productSlice.reducer;
