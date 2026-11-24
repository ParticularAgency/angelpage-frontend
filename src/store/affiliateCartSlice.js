'use client';

import { createSlice } from '@reduxjs/toolkit';

const AFFILIATE_CART_KEY = 'angelpage_affiliate_cart';

const readAffiliateCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AFFILIATE_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeAffiliateCart = (items) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AFFILIATE_CART_KEY, JSON.stringify(items));
  }
};

const affiliateCartSlice = createSlice({
  name: 'affiliateCart',
  initialState: {
    items: [],
    totalItems: 0,
  },
  reducers: {
    hydrateAffiliateCart: (state) => {
      state.items = readAffiliateCart();
      state.totalItems = state.items.length;
    },
    addAffiliateProduct: (state, action) => {
      const { product, affiliateUrl } = action.payload;
      const id = product._id || product.id;
      const exists = state.items.find((i) => String(i.productId) === String(id));
      if (!exists) {
        state.items.push({
          productId: id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || product.image,
          affiliateUrl,
          checkoutMode: product.checkoutMode || 'affiliate_redirect',
        });
      }
      state.totalItems = state.items.length;
      writeAffiliateCart(state.items);
    },
    removeAffiliateItem: (state, action) => {
      state.items = state.items.filter(
        (i) => String(i.productId) !== String(action.payload),
      );
      state.totalItems = state.items.length;
      writeAffiliateCart(state.items);
    },
    clearAffiliateCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      writeAffiliateCart([]);
    },
  },
});

export const {
  hydrateAffiliateCart,
  addAffiliateProduct,
  removeAffiliateItem,
  clearAffiliateCart,
} = affiliateCartSlice.actions;

export default affiliateCartSlice.reducer;
