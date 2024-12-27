'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Thunk to fetch favorite items
export const fetchFavorites = createAsyncThunk(
    'favorites/fetchFavorites',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/favorites/added`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const favoriteProducts = response.data.favoriteProducts || [];
            const favoriteCharities = response.data.favoriteCharities || [];
            const items = [
                ...favoriteProducts.map((item) =>
                    typeof item === 'string' ? item : item._id
                ),
                ...favoriteCharities.map((item) =>
                    typeof item === 'string' ? item : item._id
                ),
            ];
            return {
                items,
                count: items.length,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching favorites');
        }
    }
);

// Thunk to toggle a favorite item
export const toggleFavorite = createAsyncThunk(
    'favorites/toggleFavorite',
    async ({ userId, itemId, type, token }, { dispatch, rejectWithValue }) => {
        try {
            await axios.post(
                `${API_BASE_URL}/favorites/toggle`,
                { userId, itemId, type },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            // Refetch favorites after toggling
            dispatch(fetchFavorites(token));
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error toggling favorite');
        }
    }
);

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        items: [],
        count: 0,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.count = action.payload.count;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default favoritesSlice.reducer;
