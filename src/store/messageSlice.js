'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/message/messages/recipient/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.conversations;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to fetch conversations'
      );
    }
  }
);

export const fetchUnreadMessages = createAsyncThunk(
  'messages/fetchUnreadMessages',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/message/unread-messages/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.messages;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to fetch unread messages'
      );
    }
  }
);

export const fetchConversationDetails = createAsyncThunk(
  'messages/fetchConversationDetails',
  async ({ conversationId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/message/conversations/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to fetch conversation details'
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (
    {
      conversationId,
      senderId,
      senderType,
      recipientId,
      recipientType,
      content,
      token,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/message/messages/send`,
        {
          conversationId,
          senderId,
          senderType,
          recipientId,
          recipientType,
          content,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to send message');
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'messages/markMessagesAsRead',
  async ({ conversationId, messageIds, token }, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_URL}/message/messages/mark-as-read`,
        { conversationId, messageIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { conversationId, messageIds };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to mark messages as read'
      );
    }
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    unreadMessages: [],
    unreadCount: 0,
    selectedConversation: null,
    messages: [],
    typingUsers: {},
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
    addRealtimeMessage(state, action) {
      const { conversationId, message } = action.payload;
      if (state.selectedConversation?._id === conversationId) {
        const exists = state.messages.some((m) => m._id === message._id);
        if (!exists) {
          state.messages.push(message);
        }
      }
      state.conversations = state.conversations.map((conv) =>
        conv.conversationId === conversationId
          ? { ...conv, lastMessage: message, unreadCount: 0 }
          : conv
      );
    },
    updateConversationPreview(state, action) {
      const { conversationId, lastMessage } = action.payload;
      state.conversations = state.conversations.map((conv) =>
        conv.conversationId === conversationId
          ? { ...conv, lastMessage, updatedAt: new Date().toISOString() }
          : conv
      );
    },
    setTypingUser(state, action) {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = {};
      }
      if (isTyping) {
        state.typingUsers[conversationId][userId] = true;
      } else {
        delete state.typingUsers[conversationId][userId];
      }
    },
    markConversationRead(state, action) {
      const conversationId = action.payload;
      state.messages = state.messages.map((msg) =>
        msg.conversationId === conversationId
          ? { ...msg, status: 'read' }
          : msg
      );
      state.conversations = state.conversations.map((conv) =>
        conv.conversationId === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUnreadMessages.fulfilled, (state, action) => {
        state.unreadMessages = action.payload;
        state.unreadCount = action.payload?.length || 0;
      })
      .addCase(fetchConversationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
        state.selectedConversation = action.payload.conversation;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const exists = state.messages.some(
            (m) => m._id === action.payload._id
          );
          if (!exists) {
            state.messages.push(action.payload);
          }
        }
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const { messageIds } = action.payload;
        if (messageIds?.length) {
          state.messages = state.messages.map((msg) =>
            messageIds.includes(msg._id) ? { ...msg, status: 'read' } : msg
          );
        }
      });
  },
});

export const {
  selectConversation,
  clearMessages,
  addRealtimeMessage,
  updateConversationPreview,
  setTypingUser,
  markConversationRead,
} = messageSlice.actions;

export default messageSlice.reducer;
