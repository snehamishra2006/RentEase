import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Initial welcome message from RentEase AI
const INITIAL_WELCOME_MESSAGE = {
  id: 'welcome-1',
  sender: 'ai',
  text: "Hello! I'm **RentEase AI**, your Smart Property Assistant. Ask me anything in natural language—like *\"2 BHK in Ghaziabad under ₹20,000\"* or *\"Furnished apartment near metro\"*!",
  properties: [],
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

// Thunk 1: AI Natural Language Property Search
export const searchPropertiesAI = createAsyncThunk(
  'ai/searchPropertiesAI',
  async (messageText, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/ai/property-search', {
        message: messageText,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to process AI search';
      return rejectWithValue(message);
    }
  }
);

// Thunk 2: Fetch Personalized Smart Recommendations for Logged-In Tenants
export const fetchAIRecommendations = createAsyncThunk(
  'ai/fetchAIRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/ai/recommendations');
      return response.data.recommendations;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to load AI recommendations';
      return rejectWithValue(message);
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    messages: [INITIAL_WELCOME_MESSAGE],
    isOpen: false,
    loading: false,
    error: null,
    recommendations: [],
    recommendationsLoading: false,
  },
  reducers: {
    toggleChatDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChatDrawer: (state) => {
      state.isOpen = true;
    },
    closeChatDrawer: (state) => {
      state.isOpen = false;
    },
    clearMessages: (state) => {
      state.messages = [INITIAL_WELCOME_MESSAGE];
    },
    addUserMessage: (state, action) => {
      state.messages.push({
        id: `user-${Date.now()}`,
        sender: 'user',
        text: action.payload,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // AI Search
      .addCase(searchPropertiesAI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPropertiesAI.fulfilled, (state, action) => {
        state.loading = false;
        const { reply, properties, suggestions, isFallback, fallbackReason } = action.payload;

        state.messages.push({
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          properties: properties || [],
          suggestions: suggestions || [],
          isFallback: Boolean(isFallback),
          fallbackReason: fallbackReason || '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      })
      .addCase(searchPropertiesAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        state.messages.push({
          id: `ai-error-${Date.now()}`,
          sender: 'ai',
          text: `Sorry, I encountered an issue searching properties: ${action.payload}. Please try again!`,
          properties: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      })

      // AI Recommendations
      .addCase(fetchAIRecommendations.pending, (state) => {
        state.recommendationsLoading = true;
      })
      .addCase(fetchAIRecommendations.fulfilled, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchAIRecommendations.rejected, (state) => {
        state.recommendationsLoading = false;
      });
  },
});

export const {
  toggleChatDrawer,
  openChatDrawer,
  closeChatDrawer,
  clearMessages,
  addUserMessage,
} = aiSlice.actions;

export default aiSlice.reducer;
