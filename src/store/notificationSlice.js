import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/notification/alert`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.notifications || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching notifications');
        }
    }
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllNotificationsAsRead',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/notification/read-all`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data.modifiedCount || 0;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error marking notifications as read');
        }
    }
);

// Add new notification
export const addNewNotification = createAsyncThunk(
    'notifications/addNewNotification',
    async (notification, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/notification/alert`,
                notification,
                {
                    headers: { Authorization: `Bearer ${notification.token}` },
                }
            );
            dispatch(fetchNotifications(notification.token)); // Re-fetch notifications
            return response.data.notification;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error adding new notification');
        }
    }
);

// Remove a notification
export const removeNotification = createAsyncThunk(
    'notifications/removeNotification',
    async ({ notificationId, token }, { rejectWithValue }) => {
        try {
             await axios.delete(`${API_BASE_URL}/notification/${notificationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return notificationId;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error removing notification');
        }
    }
);

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(
                    (notification) => !notification.isRead
                ).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(markAllNotificationsAsRead.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.status = 'succeeded';
                state.notifications.forEach((notification) => {
                    notification.isRead = true;
                });
                state.unreadCount = 0;
            })
            .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(removeNotification.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeNotification.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notifications = state.notifications.filter(
                    (notification) => notification._id !== action.payload
                );
                state.unreadCount = state.notifications.filter(
                    (notification) => !notification.isRead
                ).length;
            })
            .addCase(removeNotification.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addNewNotification.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addNewNotification.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notifications.unshift(action.payload); // Add new notification to the top
                state.unreadCount += 1;  // Increase unread count
            })
            .addCase(addNewNotification.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default notificationsSlice.reducer;
