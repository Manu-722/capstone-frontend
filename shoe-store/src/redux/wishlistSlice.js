import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load wishlist
export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { getState }) => {
  const token = getState().auth?.token || localStorage.getItem('authToken');
  const res = await fetch('http://localhost:8000/api/wishlist/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.items || [];
});

// Add item
export const addWishlistItem = createAsyncThunk('wishlist/add', async (item, { getState }) => {
  const token = getState().auth?.token || localStorage.getItem('authToken');
  await fetch('http://localhost:8000/api/wishlist/add/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  return item;
});

// Remove item
export const removeWishlistItem = createAsyncThunk('wishlist/remove', async (itemId, { getState }) => {
  const token = getState().auth?.token || localStorage.getItem('authToken');
  await fetch(`http://localhost:8000/api/wishlist/remove/${itemId}/`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return itemId;
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    clearWishlist(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addWishlistItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;