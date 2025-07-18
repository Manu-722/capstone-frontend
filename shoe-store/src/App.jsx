import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useSelector, useDispatch, Provider } from 'react-redux';
import store from './redux/store';
import { fetchCartFromServer, persistCartToServer } from './redux/cartSlice';
import { fetchWishlist } from './redux/wishlistSlice';
import { setUser, setAuthenticated, setToken } from './redux/authSlice'; // ✅ new

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import RequestReset from './components/auth/RequestReset';
import ResetPassword from './components/auth/ResetPassword';
import AdminDashboard from './admin/AdminDashboard';
import Wishlist from './pages/Wishlist';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  return isAuthenticated
    ? children
    : <Navigate to={`/login?returnTo=${location.pathname}`} replace />;
};

const AppRoutes = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    const localToken = localStorage.getItem('authToken');

    if (localToken && !token && !isAuthenticated) {
      fetch('http://localhost:8000/api/user-profile/', {
        headers: { Authorization: `Bearer ${localToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Invalid token');
          return res.json();
        })
        .then((user) => {
          dispatch(setUser(user));
          dispatch(setToken(localToken));
          dispatch(setAuthenticated(true));
        })
        .catch(() => {
          dispatch(setAuthenticated(false));
          dispatch(setToken(null));
        });
    }
  }, [dispatch, token, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchCartFromServer());
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, token, dispatch]);

  useEffect(() => {
    if (isAuthenticated && token && cart.length > 0) {
      dispatch(persistCartToServer());
    }
  }, [cart, isAuthenticated, token, dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<RequestReset />} />
        <Route path="/reset/:uidb64/:token" element={<ResetPassword />} />
      </Routes>
      <Footer />
      <ToastContainer position="top-center" autoClose={4000} />
    </>
  );
};

const App = () => (
  <Provider store={store}>
    <Router>
      <AppRoutes />
    </Router>
  </Provider>
);

export default App;