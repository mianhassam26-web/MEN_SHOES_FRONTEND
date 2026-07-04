import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try { const res = await cartAPI.get(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

export const addToCart = createAsyncThunk('cart/add', async (data, { rejectWithValue }) => {
  try { const res = await cartAPI.addItem(data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.detail || 'Failed to add to cart'); }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try { await cartAPI.removeItem(itemId); return itemId; }
  catch (err) { return rejectWithValue(err.response?.data?.detail); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cart: null, loading: false, error: null, isOpen: false },
  reducers: {
    toggleCart(state) { state.isOpen = !state.isOpen; },
    closeCart(state) { state.isOpen = false; },
    clearCart(state) { state.cart = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (s) => { s.loading = true; })
      .addCase(fetchCart.fulfilled, (s, a) => { s.loading = false; s.cart = a.payload; })
      .addCase(fetchCart.rejected, (s) => { s.loading = false; })
      .addCase(addToCart.fulfilled, (s, a) => { s.cart = a.payload; })
      .addCase(removeFromCart.fulfilled, (s, a) => {
        if (s.cart) s.cart.items = s.cart.items.filter((i) => i.id !== a.payload);
      });
  },
});

export const { toggleCart, closeCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
