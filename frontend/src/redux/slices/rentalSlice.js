import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Active tenant rental
export const fetchActiveTenantRental = createAsyncThunk('rentals/fetchActiveTenantRental', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get('/rentals/tenant/active');
    return res.data.rental;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Owner rentals
export const fetchOwnerRentals = createAsyncThunk('rentals/fetchOwnerRentals', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get('/rentals/owner');
    return res.data.rentals;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Terminate rental
export const terminateRental = createAsyncThunk('rentals/terminateRental', async (id, thunkAPI) => {
  try {
    const res = await axiosClient.put(`/rentals/${id}/terminate`);
    return res.data.rental;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Fetch rent payments
export const fetchRentPayments = createAsyncThunk('rentals/fetchRentPayments', async (rentalId = '', thunkAPI) => {
  try {
    const url = rentalId ? `/rent-payments?rentalId=${rentalId}` : '/rent-payments';
    const res = await axiosClient.get(url);
    return res.data.payments;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Tenant Pay Rent
export const payRent = createAsyncThunk('rentals/payRent', async ({ paymentId, paymentMethod, transactionId, notes }, thunkAPI) => {
  try {
    const res = await axiosClient.post(`/rent-payments/${paymentId}/pay`, { paymentMethod, transactionId, notes });
    return res.data.payment;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const rentalSlice = createSlice({
  name: 'rentals',
  initialState: {
    activeRental: null,
    ownerRentals: [],
    payments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchActiveTenantRental
      .addCase(fetchActiveTenantRental.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveTenantRental.fulfilled, (state, action) => {
        state.activeRental = action.payload;
        state.loading = false;
      })
      .addCase(fetchActiveTenantRental.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchOwnerRentals
      .addCase(fetchOwnerRentals.fulfilled, (state, action) => {
        state.ownerRentals = action.payload;
      })
      // terminateRental
      .addCase(terminateRental.fulfilled, (state, action) => {
        if (state.activeRental && state.activeRental._id === action.payload._id) {
          state.activeRental = null;
        }
        state.ownerRentals = state.ownerRentals.map((r) => (r._id === action.payload._id ? action.payload : r));
      })
      // fetchRentPayments
      .addCase(fetchRentPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
      })
      // payRent
      .addCase(payRent.fulfilled, (state, action) => {
        state.payments = state.payments.map((p) => (p._id === action.payload._id ? action.payload : p));
      });
  },
});

export default rentalSlice.reducer;
