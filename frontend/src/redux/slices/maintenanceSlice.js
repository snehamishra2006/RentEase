import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Submit maintenance request
export const submitMaintenanceRequest = createAsyncThunk('maintenance/submitMaintenanceRequest', async (data, thunkAPI) => {
  try {
    const res = await axiosClient.post('/maintenance', data);
    return res.data.request;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Fetch tenant maintenance requests
export const fetchTenantMaintenance = createAsyncThunk('maintenance/fetchTenantMaintenance', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get('/maintenance/tenant');
    return res.data.requests;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Fetch owner maintenance requests
export const fetchOwnerMaintenance = createAsyncThunk('maintenance/fetchOwnerMaintenance', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get('/maintenance/owner');
    return res.data.requests;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Update maintenance status (Owner)
export const updateMaintenanceStatus = createAsyncThunk('maintenance/updateMaintenanceStatus', async ({ id, status, resolutionNotes }, thunkAPI) => {
  try {
    const res = await axiosClient.put(`/maintenance/${id}/status`, { status, resolutionNotes });
    return res.data.request;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState: {
    tenantRequests: [],
    ownerRequests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // submitMaintenanceRequest
      .addCase(submitMaintenanceRequest.fulfilled, (state, action) => {
        state.tenantRequests.unshift(action.payload);
      })
      // fetchTenantMaintenance
      .addCase(fetchTenantMaintenance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTenantMaintenance.fulfilled, (state, action) => {
        state.tenantRequests = action.payload;
        state.loading = false;
      })
      // fetchOwnerMaintenance
      .addCase(fetchOwnerMaintenance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOwnerMaintenance.fulfilled, (state, action) => {
        state.ownerRequests = action.payload;
        state.loading = false;
      })
      // updateMaintenanceStatus
      .addCase(updateMaintenanceStatus.fulfilled, (state, action) => {
        state.ownerRequests = state.ownerRequests.map((r) => (r._id === action.payload._id ? action.payload : r));
      });
  },
});

export default maintenanceSlice.reducer;
