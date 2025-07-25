import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:8000/api';

export const fetchCartFromServer = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth?.token || localStorage.getItem('authToken');
    try {
      const res = await fetch(`${API_URL}/user/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error);
      }

      const data = await res.json();
      return Array.isArray(data.items) ? data.items : [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const persistCartToServer = createAsyncThunk(
  'cart/persistCart',
  async (_, { getState, rejectWithValue }) => {
    const cart = getState().cart.items;
    const token = getState().auth?.token || localStorage.getItem('authToken');
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
      return rejectWithValue(err.message);
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
      if (Array.isArray(action.payload)) {
        state.items = action.payload;
        localStorage.setItem('cymanCart', JSON.stringify(action.payload));
      }
    });
    builder.addCase(persistCartToServer.fulfilled, () => {
      console.log('[persistCartToServer] success');
    });
    builder.addCase(persistCartToServer.rejected, (_, action) => {
      console.error('[persistCartToServer] failed:', action.payload);
    });
  },
});

export const { addToCart, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;