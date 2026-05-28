import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    //add to cart
    addToCart: (state, action) => {
      const existingProduct = state.find(
        (item) => item.id == action.payload.id,
      );
      if (existingProduct) {
        existingProduct.quantity++;
        existingProduct.totalprice =
          existingProduct.quantity * parseFloat(existingProduct.price);
      } else {
        state.push({
          ...action.payload,
          quantity: 1,
          totalprice: parseFloat(action.payload.price),
        });
      }
    },

    // Remove cart item
    removeCartItem: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },

    // Increment quantity
    incrementQuantity: (state, action) => {
      const existingProduct = state.find((item) => item.id == action.payload);
      if (existingProduct) {
        existingProduct.quantity++;
        existingProduct.totalprice =
          existingProduct.quantity * existingProduct.price;
      }
    },

    // Decrement quantity
    decrementQuantity: (state, action) => {
      const existingProduct = state.find((item) => item.id == action.payload);
      if (existingProduct && existingProduct.quantity) {
        existingProduct.quantity--;
        existingProduct.totalprice =
          existingProduct.quantity * existingProduct.price;
      }
    },

    // Empty cart
    emptyCart: (state) => {
      return (state = []);
    },
  },
});

export const {
  addToCart,
  removeCartItem,
  incrementQuantity,
  decrementQuantity,
  emptyCart,
} = cartSlice.actions;

export default cartSlice.reducer;
