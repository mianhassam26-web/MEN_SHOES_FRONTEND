import { createSlice } from '@reduxjs/toolkit';

const saved = (() => { try { return JSON.parse(localStorage.getItem('wishlist')) || []; } catch { return []; } })();

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: saved },
  reducers: {
    toggleWishlist(state, action) {
      const product = action.payload;
      const exists = state.items.find((i) => i.id === product.id);
      if (exists) state.items = state.items.filter((i) => i.id !== product.id);
      else state.items.push(product);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
