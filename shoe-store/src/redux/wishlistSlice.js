import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:8000/api/store';

const getAccessToken = () => {
  const raw = localStorage.getItem('authToken');
  try {
    const parsed = JSON.parse(raw);
    return parsed?.access;
  } catch {
    return raw || null;
  }
};

export const fetchWishlistFromServer = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue({ detail: 'Missing token' });

    try {
      const res = await fetch(`${API_URL}/user/wishlist/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return Array.isArray(data.items) ? data.items : [];
    } catch (err) {
      return rejectWithValue({ detail: err.message });
    }
  }
);

const loadLocalWishlist = () => {
  try {
    const raw = localStorage.getItem('cymanWishlist');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: loadLocalWishlist() },
  reducers: {
    addWishlistItem(state, action) {
      const exists = state.items.some((i) => i.id === action.payload.id);
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
    builder.addCase(fetchWishlistFromServer.rejected, (_, action) => {
      console.warn('[fetchWishlistFromServer] failed:', action.payload?.detail || action.payload);
    });
  },
});

export const {
  addWishlistItem,
  removeWishlistItem,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;