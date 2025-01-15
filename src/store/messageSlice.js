'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Async Thunks
export const fetchConversations = createAsyncThunk(
    'messages/fetchConversations',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/message/messages/recipient/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.conversations;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch conversations');
        }
    }
);

export const fetchUnreadMessages = createAsyncThunk(
    'messages/fetchUnreadMessages',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/message/unread-messages/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.messages;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch unread messages');
        }
    }
);

export const fetchConversationDetails = createAsyncThunk(
    'messages/fetchConversationDetails',
    async ({ conversationId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/message/conversations/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch conversation details');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async ({ conversationId, senderId, senderType, recipientId, recipientType, content, token }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/message/messages/send`,
                { conversationId, senderId, senderType, recipientId, recipientType, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to send message');
        }
    }
);

export const markMessagesAsRead = createAsyncThunk(
    'messages/markMessagesAsRead',
    async ({ messageIds, token }, { rejectWithValue }) => {
        try {
            await axios.post(
                `${API_URL}/message/messages/mark-as-read`,
                { messageIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return messageIds;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to mark messages as read');
        }
    }
);

// Slice
const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        conversations: [],
        unreadMessages: [],
        selectedConversation: null,
        messages: [],
        loading: false,
        error: null,
    },
    reducers: {
        selectConversation(state, action) {
            state.selectedConversation = action.payload;
        },
        clearMessages(state) {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        // Fetch Conversations
        builder.addCase(fetchConversations.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchConversations.fulfilled, (state, action) => {
            state.loading = false;
            state.conversations = action.payload;
        });
        builder.addCase(fetchConversations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Fetch Unread Messages
        builder.addCase(fetchUnreadMessages.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUnreadMessages.fulfilled, (state, action) => {
            state.loading = false;
            state.unreadMessages = action.payload;
        });
        builder.addCase(fetchUnreadMessages.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Fetch Conversation Details
        builder.addCase(fetchConversationDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchConversationDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.messages = action.payload.messages;
        });
        builder.addCase(fetchConversationDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Send Message
        builder.addCase(sendMessage.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            state.loading = false;
            state.messages.push(action.payload);
        });
        builder.addCase(sendMessage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Mark Messages as Read
        builder.addCase(markMessagesAsRead.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(markMessagesAsRead.fulfilled, (state, action) => {
            state.loading = false;
            state.messages = state.messages.map((msg) =>
                action.payload.includes(msg._id) ? { ...msg, status: 'read' } : msg
            );
        });
        builder.addCase(markMessagesAsRead.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

// Actions and Reducer
export const { selectConversation, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
