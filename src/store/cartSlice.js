'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const GUEST_CART_KEY = 'angelpage_guest_cart';

const readGuestCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeGuestCart = (items) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  }
};

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
  reducers: {
    hydrateGuestCart(state) {
      state.items = readGuestCart();
      state.totalItems = state.items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      state.status = 'succeeded';
    },
    addGuestProduct(state, action) {
      const { product, quantity = 1 } = action.payload;
      const productId = product.id || product._id;
      const normalizedProduct = {
        ...product,
        _id: productId,
        charity: product.charity
          ? {
              ...product.charity,
              _id: product.charity._id || product.charity.id,
            }
          : undefined,
        seller: product.seller
          ? {
              ...product.seller,
              _id: product.seller._id || product.seller.id,
            }
          : undefined,
      };
      const existing = state.items.find(
        (item) => (item.productId?._id || item.productId) === productId
      );
      let nextItems;
      if (existing) {
        nextItems = state.items.map((item) =>
          (item.productId?._id || item.productId) === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        nextItems = [
          ...state.items,
          {
            productId: normalizedProduct,
            quantity,
          },
        ];
      }
      state.items = nextItems;
      state.totalItems = nextItems.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      writeGuestCart(nextItems);
    },
    clearGuestCart(state) {
      state.items = [];
      state.totalItems = 0;
      writeGuestCart([]);
    },
    updateGuestItemQuantity(state, action) {
      const { productId, quantityChange } = action.payload;
      const nextItems = state.items
        .map((item) => {
          const id = item.productId?._id || item.productId;
          if (id !== productId) return item;
          const newQty = (item.quantity || 0) + quantityChange;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        })
        .filter(Boolean);
      state.items = nextItems;
      state.totalItems = nextItems.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      writeGuestCart(nextItems);
    },
    removeGuestItem(state, action) {
      const productId = action.payload;
      const nextItems = state.items.filter((item) => {
        const id = item.productId?._id || item.productId;
        return id !== productId;
      });
      state.items = nextItems;
      state.totalItems = nextItems.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      writeGuestCart(nextItems);
    },
  },
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

export const {
  hydrateGuestCart,
  addGuestProduct,
  clearGuestCart,
  updateGuestItemQuantity,
  removeGuestItem,
} = cartSlice.actions;
export default cartSlice.reducer;
