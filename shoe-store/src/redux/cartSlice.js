import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 🧠 Load cart from Django
export const fetchCartFromServer = createAsyncThunk('cart/fetchCart', async (_, { getState }) => {
  const token = getState().auth?.token || localStorage.getItem('authToken');
  const res = await fetch('http://localhost:8000/api/user/cart/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.items || [];
});

// 💾 Persist cart to Django
export const persistCartToServer = createAsyncThunk('cart/persistCart', async (_, { getState }) => {
  const cart = getState().cart.items;
  const token = getState().auth?.token || localStorage.getItem('authToken');

  await fetch('http://localhost:8000/api/persist_cart/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cart),
  });
});

const loadLocalCart = () => {
  try {
    const raw = localStorage.getItem('cymanCart');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Failed to parse local cart:", err);
    return [];
  }
};

const initialState = {
  items: loadLocalCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
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
  },
});

export const { addToCart, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;