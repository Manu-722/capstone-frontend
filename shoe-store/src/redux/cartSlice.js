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

export const fetchCartFromServer = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue({ detail: 'Missing token' });

    try {
      const res = await fetch(`${API_URL}/user/cart/`, {
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

export const persistCartToServer = createAsyncThunk(
  'cart/persistCart',
  async (_, { getState, rejectWithValue }) => {
    const cart = getState().cart.items;
    const token = getAccessToken();
    if (!token) return rejectWithValue({ detail: 'Missing token' });

    try {
      const res = await fetch(`${API_URL}/persist_cart/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error);
      }
    } catch (err) {
      return rejectWithValue({ detail: err.message });
    }
  }
);

const loadLocalCart = () => {
  try {
    const raw = localStorage.getItem('cymanCart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadLocalCart() },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem('cymanCart', JSON.stringify(state.items));
    },
    setCart(state, action) {
      state.items = action.payload;
      localStorage.setItem('cymanCart', JSON.stringify(action.payload));
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem('cymanCart');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartFromServer.fulfilled, (state, action) => {
      state.items = action.payload;
      localStorage.setItem('cymanCart', JSON.stringify(action.payload));
    });
    builder.addCase(fetchCartFromServer.rejected, (_, action) => {
      console.warn('[fetchCartFromServer] failed:', action.payload?.detail || action.payload);
    });
    builder.addCase(persistCartToServer.fulfilled, () => {
      console.log('[persistCartToServer] success');
    });
    builder.addCase(persistCartToServer.rejected, (_, action) => {
      console.error('[persistCartToServer] failed:', action.payload?.detail || action.payload);
    });
  },
});

export const { addToCart, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;