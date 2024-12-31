'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.cart.items || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error fetching cart'
      );
    }
  }
);

export const addOrUpdateProduct = createAsyncThunk(
  'cart/addOrUpdateProduct',
  async ({ userId, productId, token }, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(
        `${API_BASE_URL}/cart/add-product-to-cart`,
        { userId, productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await dispatch(fetchCart({ userId, token })).unwrap();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error adding product'
      );
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ userId, productId, quantityChange, token }, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(
        `${API_BASE_URL}/cart/update-quantity`,
        { userId, productId, quantityChange },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await dispatch(fetchCart({ userId, token })).unwrap();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error updating quantity'
      );
    }
  }
);

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async ({ userId, productId, token }, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(
        `${API_BASE_URL}/cart/remove`,
        { userId, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await dispatch(fetchCart({ userId, token })).unwrap();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error removing product'
      );
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.totalItems = action.payload.reduce((sum, item) => sum + (item.quantity || 0), 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addOrUpdateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
