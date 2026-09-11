import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Fetch notifications
export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get('/notifications');
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Mark notification(s) as read
export const markNotificationsRead = createAsyncThunk('notifications/markNotificationsRead', async (notificationId = null, thunkAPI) => {
  try {
    await axiosClient.put('/notifications/read', { notificationId });
    return notificationId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.list = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markNotificationsRead.fulfilled, (state, action) => {
        if (action.payload) {
          state.list = state.list.map((n) => (n._id === action.payload ? { ...n, isRead: true } : n));
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else {
          state.list = state.list.map((n) => ({ ...n, isRead: true }));
          state.unreadCount = 0;
        }
      });
  },
});

export default notificationSlice.reducer;
