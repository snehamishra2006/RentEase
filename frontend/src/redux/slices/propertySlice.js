import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Public search/filter properties
export const fetchProperties = createAsyncThunk('properties/fetchProperties', async (filters = {}, thunkAPI) => {
  try {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.minRent) params.append('minRent', filters.minRent);
    if (filters.maxRent) params.append('maxRent', filters.maxRent);
    if (filters.bedrooms && filters.bedrooms !== 'all') params.append('bedrooms', filters.bedrooms);
    if (filters.search) params.append('search', filters.search);

    const res = await axiosClient.get(`/properties?${params.toString()}`);
    return res.data.properties;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Single property details
export const fetchPropertyDetails = createAsyncThunk('properties/fetchPropertyDetails', async (id, thunkAPI) => {
  try {
    const res = await axiosClient.get(`/properties/${id}`);
    return res.data.property;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Owner properties
export const fetchOwnerProperties = createAsyncThunk('properties/fetchOwnerProperties', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get('/properties/owner/my-properties');
    return res.data.properties;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Create property (Owner)
export const createProperty = createAsyncThunk('properties/createProperty', async (propertyData, thunkAPI) => {
  try {
    const res = await axiosClient.post('/properties', propertyData);
    return res.data.property;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Update property (Owner)
export const updateProperty = createAsyncThunk('properties/updateProperty', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axiosClient.put(`/properties/${id}`, data);
    return res.data.property;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Delete property (Owner)
export const deleteProperty = createAsyncThunk('properties/deleteProperty', async (id, thunkAPI) => {
  try {
    await axiosClient.delete(`/properties/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Admin Stats
export const fetchAdminStats = createAsyncThunk('properties/fetchAdminStats', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get('/admin/stats');
    return res.data.stats;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Admin Pending Properties / Verifications
export const fetchPendingProperties = createAsyncThunk('properties/fetchPendingProperties', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get('/admin/properties/pending');
    return res.data.properties;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const fetchPendingVerifications = fetchPendingProperties;

// Admin Verify Property
export const verifyProperty = createAsyncThunk('properties/verifyProperty', async ({ id, verificationStatus, reason }, thunkAPI) => {
  try {
    const res = await axiosClient.put(`/admin/properties/${id}/verify`, { status: verificationStatus, reason });
    return res.data.property;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Tenant Favorites
export const fetchFavorites = createAsyncThunk('properties/fetchFavorites', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get('/favorites');
    return res.data.favorites;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const toggleFavorite = createAsyncThunk('properties/toggleFavorite', async (propertyId, thunkAPI) => {
  try {
    const res = await axiosClient.post(`/favorites/${propertyId}`);
    return { propertyId, isFavorite: res.data.isFavorite };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const propertySlice = createSlice({
  name: 'properties',
  initialState: {
    list: [],
    ownerProperties: [],
    pendingProperties: [],
    favorites: [],
    adminStats: null,
    currentProperty: null,
    loading: false,
    error: null,
    filters: {
      city: '',
      type: 'all',
      minRent: '',
      maxRent: '',
      bedrooms: 'all',
      search: '',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        city: '',
        type: 'all',
        minRent: '',
        maxRent: '',
        bedrooms: 'all',
        search: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProperties
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchPropertyDetails
      .addCase(fetchPropertyDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPropertyDetails.fulfilled, (state, action) => {
        state.currentProperty = action.payload;
        state.loading = false;
      })
      .addCase(fetchPropertyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchOwnerProperties
      .addCase(fetchOwnerProperties.fulfilled, (state, action) => {
        state.ownerProperties = action.payload;
      })
      // createProperty
      .addCase(createProperty.fulfilled, (state, action) => {
        state.ownerProperties.unshift(action.payload);
      })
      // updateProperty
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.ownerProperties = state.ownerProperties.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      // deleteProperty
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.ownerProperties = state.ownerProperties.filter((p) => p._id !== action.payload);
      })
      // fetchAdminStats
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.adminStats = action.payload;
      })
      // fetchPendingProperties
      .addCase(fetchPendingProperties.fulfilled, (state, action) => {
        state.pendingProperties = action.payload;
      })
      // verifyProperty
      .addCase(verifyProperty.fulfilled, (state, action) => {
        state.pendingProperties = state.pendingProperties.filter((p) => p._id !== action.payload._id);
      })
      // fetchFavorites
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      // toggleFavorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { propertyId, isFavorite } = action.payload;
        if (!isFavorite) {
          state.favorites = state.favorites.filter((fav) => fav._id !== propertyId);
        }
      });
  },
});

export const { setFilters, resetFilters } = propertySlice.actions;
export default propertySlice.reducer;
