'use client'
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import cartReducer from './cartSlice';
import affiliateCartReducer from './affiliateCartSlice';
import favoritesReducer from './favoritesSlice';
import notificationsReducer from './notificationSlice';
import messageReducer from './messageSlice';
import { angelpageApi } from './api/angelpageApi';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    affiliateCart: affiliateCartReducer,
    favorites: favoritesReducer,
    notifications: notificationsReducer,
    messages: messageReducer,
    [angelpageApi.reducerPath]: angelpageApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(angelpageApi.middleware),
});

setupListeners(store.dispatch);

export default store;