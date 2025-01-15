'use client'
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice'; // Adjust the path
import favoritesReducer from './favoritesSlice'; // Adjust the path
import notificationsReducer from './notificationSlice';
import messageReducer from './messageSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
    notifications: notificationsReducer,
    messages: messageReducer,
  },
});



export default store;