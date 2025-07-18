import React, { useEffect, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext, AuthProvider } from './context/AuthContext';
import { CartContext, CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

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
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated, token } = useContext(AuthContext);
  const { setCart } = useContext(CartContext);

  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated || !token) return;
      try {
        const res = await fetch('http://localhost:8000/api/user/cart/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setCart(data.items);
          localStorage.setItem('cymanCart', JSON.stringify(data.items));
        }
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    };

    fetchCart();
  }, [isAuthenticated, token]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
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
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <Router>
          <AppRoutes />
        </Router>
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
);

export default App;