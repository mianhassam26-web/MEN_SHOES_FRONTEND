import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoriesAPI } from '../../services/api';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
  try { const res = await categoriesAPI.getAll(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

export const createCategory = createAsyncThunk('categories/create', async (data, { rejectWithValue }) => {
  try { const res = await categoriesAPI.create(data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await categoriesAPI.update(id, data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
  try { await categoriesAPI.delete(id); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (s) => { s.loading = true; })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchCategories.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createCategory.fulfilled, (s, a) => { s.list.push(a.payload); })
      .addCase(updateCategory.fulfilled, (s, a) => {
        const idx = s.list.findIndex((c) => c.id === a.payload.id);
        if (idx !== -1) s.list[idx] = a.payload;
      })
      .addCase(deleteCategory.fulfilled, (s, a) => {
        s.list = s.list.filter((c) => c.id !== a.payload);
      });
  },
});

export default categoriesSlice.reducer;
