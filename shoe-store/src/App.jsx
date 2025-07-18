import React, { useEffect, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from './context/AuthContext';
import { CartContext, CartProvider } from './context/CartContext';

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

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { setCart } = useContext(CartContext);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const fetchCart = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/cart/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const cartData = await res.json();
          setCart(cartData);
          localStorage.setItem('cymanCart', JSON.stringify(cartData));
        }
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    };

    fetchCart();
  }, [isAuthenticated, setCart]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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
  <CartProvider>
    <Router>
      <AppRoutes />
    </Router>
  </CartProvider>
);

export default App;