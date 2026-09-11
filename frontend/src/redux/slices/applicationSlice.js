import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Submit application (Tenant)
export const submitApplication = createAsyncThunk('applications/submitApplication', async (appData, thunkAPI) => {
  try {
    const res = await axiosClient.post('/applications', appData);
    return res.data.application;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Fetch tenant applications
export const fetchTenantApplications = createAsyncThunk('applications/fetchTenantApplications', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get('/applications/tenant');
    return res.data.applications;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Fetch owner applications
export const fetchOwnerApplications = createAsyncThunk('applications/fetchOwnerApplications', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get('/applications/owner');
    return res.data.applications;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Update application status (Owner approve/reject)
export const updateApplicationStatus = createAsyncThunk('applications/updateApplicationStatus', async ({ id, status }, thunkAPI) => {
  try {
    const res = await axiosClient.put(`/applications/${id}/status`, { status });
    return res.data.application;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    tenantApps: [],
    ownerApps: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // submitApplication
      .addCase(submitApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.tenantApps.unshift(action.payload);
        state.loading = false;
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchTenantApplications
      .addCase(fetchTenantApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTenantApplications.fulfilled, (state, action) => {
        state.tenantApps = action.payload;
        state.loading = false;
      })
      // fetchOwnerApplications
      .addCase(fetchOwnerApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOwnerApplications.fulfilled, (state, action) => {
        state.ownerApps = action.payload;
        state.loading = false;
      })
      // updateApplicationStatus
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.ownerApps = state.ownerApps.map((app) =>
          app._id === action.payload._id ? action.payload : app
        );
      });
  },
});

export default applicationSlice.reducer;
