'use client'
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice'; // Adjust the path
import favoritesReducer from './favoritesSlice'; // Adjust the path

const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
  },
});



export default store;
