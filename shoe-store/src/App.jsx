import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useSelector, useDispatch, Provider } from 'react-redux';
import store from './redux/store';
import { fetchCartFromServer, persistCartToServer } from './redux/cartSlice';
import { fetchWishlist } from './redux/wishlistSlice';

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
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const token = useSelector((state) => state.auth?.token) || localStorage.getItem('authToken');

  return (isAuthenticated || !!token) ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token) || localStorage.getItem('authToken');
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated || !!token);
  const cart = useSelector((state) => state.cart.items);

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