import { createSlice } from '@reduxjs/toolkit';

const tokenFromStorage = localStorage.getItem('authToken');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: tokenFromStorage || null,
    isAuthenticated: !!tokenFromStorage,
    user: null, // can be filled on login
  },
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', action.payload.token);
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('cymanCart');
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;