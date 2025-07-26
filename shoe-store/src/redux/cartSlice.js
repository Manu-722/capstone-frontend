import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:8000/api';

const getAccessToken = () => {
  try {
    const raw = localStorage.getItem('authToken');
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed?.access) {
      return parsed.access;
    }

    if (typeof raw === 'string' && raw.length > 20 && !raw.includes('{')) {
      return raw;
    }

    return null;
  } catch {
    return null;
  }
};

export const fetchCartFromServer = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) return rejectWithValue({ detail: 'No valid token found' });

    try {
      const res = await fetch(`${API_URL}/user/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      if (text.trim().startsWith('<')) {
        console.warn('[fetchCartFromServer] Received HTML instead of JSON');
        return rejectWithValue({ detail: 'Server returned HTML response' });
      }

      let data = {};
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.warn('[fetchCartFromServer] JSON parse error:', text.slice(0, 80));
        return rejectWithValue({ detail: 'Could not parse server response' });
      }

      if (data?.code === 'token_not_valid') {
        console.warn('[fetchCartFromServer] Token rejected by backend');
        return rejectWithValue({ detail: 'Token not valid. Please log in again.' });
      }

      if (!Array.isArray(data.items)) {
        console.warn('[fetchCartFromServer] Unexpected payload:', data);
        return rejectWithValue({ detail: 'Malformed cart data' });
      }

      return data.items;
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
    if (!token) return rejectWithValue({ detail: 'No valid token found' });

    if (!Array.isArray(cart) || cart.length === 0) {
      return rejectWithValue({ detail: 'Cart is empty or invalid format' });
    }

    try {
      const res = await fetch(`${API_URL}/persist_cart/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      });

      const text = await res.text();
      if (text.trim().startsWith('<')) {
        console.warn('[persistCartToServer] Server responded with HTML');
        return rejectWithValue({ detail: 'Invalid server response format' });
      }

      let result = {};
      try {
        result = JSON.parse(text);
      } catch {
        return rejectWithValue({ detail: 'Could not decode server response' });
      }

      if (!result || typeof result !== 'object') {
        return rejectWithValue({ detail: 'Unexpected server reply' });
      }

      return result;
    } catch (err) {
      return rejectWithValue({ detail: err.message });
    }
  }
);

const loadLocalCart = () => {
  try {
    const raw = localStorage.getItem('cymanCart');
    const cart = JSON.parse(raw);
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadLocalCart(),
    status: 'idle',
    error: null,
  },
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
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('cymanCart', JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartFromServer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCartFromServer.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.error = null;
        localStorage.setItem('cymanCart', JSON.stringify(action.payload));
      })
      .addCase(fetchCartFromServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.detail || 'Cart fetch failed';
      })
      .addCase(persistCartToServer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(persistCartToServer.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(persistCartToServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.detail || 'Cart persist failed';
      });
  },
});

export const { addToCart, setCart, clearCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;