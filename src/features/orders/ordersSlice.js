import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from '../../services/api';

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
  try { const res = await ordersAPI.getAll(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

// NAYA - Admin panel ke liye: sab customers ke orders (user ke apne orders se alag rakha gaya hai)
export const fetchAllOrdersAdmin = createAsyncThunk('orders/fetchAllAdmin', async (_, { rejectWithValue }) => {
  try { const res = await ordersAPI.getAllAdmin(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { rejectWithValue }) => {
  try { const res = await ordersAPI.getById(id); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

export const placeOrder = createAsyncThunk('orders/place', async (_, { rejectWithValue }) => {
  try { const res = await ordersAPI.create(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail || 'Order failed'); }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: [], adminList: [], selected: null, loading: false, adminLoading: false, error: null },
  reducers: { clearOrderError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (s) => { s.loading = true; })
      .addCase(fetchOrders.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchAllOrdersAdmin.pending, (s) => { s.adminLoading = true; })
      .addCase(fetchAllOrdersAdmin.fulfilled, (s, a) => { s.adminLoading = false; s.adminList = a.payload; })
      .addCase(fetchAllOrdersAdmin.rejected, (s, a) => { s.adminLoading = false; s.error = a.payload; })
      .addCase(fetchOrderById.fulfilled, (s, a) => { s.selected = a.payload; })
      .addCase(placeOrder.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(placeOrder.fulfilled, (s, a) => { s.loading = false; s.list.unshift(a.payload); s.selected = a.payload; })
      .addCase(placeOrder.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;
