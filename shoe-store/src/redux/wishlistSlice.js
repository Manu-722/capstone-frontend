import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWishlistFromServer = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token || localStorage.getItem('authToken');
    try {
      const res = await fetch('http://localhost:8000/api/user/wishlist/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return Array.isArray(data.items) ? data.items : [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {
    addWishlistItem(state, action) {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem('cymanWishlist', JSON.stringify(state.items));
      }
    },
    removeWishlistItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem('cymanWishlist', JSON.stringify(state.items));
    },
    clearWishlist(state) {
      state.items = [];
      localStorage.removeItem('cymanWishlist');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishlistFromServer.fulfilled, (state, action) => {
      state.items = action.payload;
      localStorage.setItem('cymanWishlist', JSON.stringify(action.payload));
    });
  },
});

export const {
  addWishlistItem,
  removeWishlistItem,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;