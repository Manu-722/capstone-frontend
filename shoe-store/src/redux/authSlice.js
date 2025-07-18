import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    isAuthenticated: false,
    user: null,
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
    setAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { login, logout, setUser, setAuthenticated, setToken } = authSlice.actions;
export default authSlice.reducer;