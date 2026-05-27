import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    addToWishList: (state, action) => {
      state.push(action.payload);
    },
    removeWishListItem: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    }
  }
});

export const { addToWishList, removeWishListItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;