import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try { const res = await productsAPI.getAll(params); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try { const res = await productsAPI.getById(id); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

export const createProduct = createAsyncThunk('products/create', async (data, { rejectWithValue }) => {
  try { const res = await productsAPI.create(data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await productsAPI.update(id, data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try { await productsAPI.delete(id); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { list: [], selected: null, loading: false, error: null, search: '' },
  reducers: {
    setSearch(state, action) { state.search = action.payload; },
    clearSelected(state) { state.selected = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchProductById.pending, (s) => { s.loading = true; s.selected = null; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.selected = a.payload; })
      .addCase(fetchProductById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createProduct.fulfilled, (s, a) => { s.list.unshift(a.payload); })
      .addCase(updateProduct.fulfilled, (s, a) => {
        const idx = s.list.findIndex((p) => p.id === a.payload.id);
        if (idx !== -1) s.list[idx] = a.payload;
        if (s.selected?.id === a.payload.id) s.selected = a.payload;
      })
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.list = s.list.filter((p) => p.id !== a.payload);
      });
  },
});

export const { setSearch, clearSelected } = productsSlice.actions;
export default productsSlice.reducer;
