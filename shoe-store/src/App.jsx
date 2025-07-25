import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useSelector, useDispatch, Provider } from 'react-redux';
import store from './redux/store';
import {
  fetchCartFromServer,
  persistCartToServer,
} from './redux/cartSlice';
import {
  fetchWishlistFromServer,
} from './redux/wishlistSlice';
import {
  setUser,
  setAuthenticated,
  setToken,
} from './redux/authSlice';

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
import AdminDashboard from './admin/AdminDashboard';
import Wishlist from './pages/Wishlist';

import RequestReset from './pages/RequestReset';
import RequestPasswordReset from './pages/RequestPasswordReset';
import ResetPassword from './components/auth/ResetPassword';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={`/login?returnTo=${location.pathname}`} replace />
  );
};

const AppRoutes = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);
  const cart = useSelector((state) => state.cart.items);

  // Restore session from localStorage
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
        .then((userData) => {
          dispatch(setUser(userData));
          dispatch(setToken(localToken));
          dispatch(setAuthenticated(true));
          localStorage.setItem('lastUsername', userData.username);
        })
        .catch((err) => {
          console.error('Session restore failed:', err);
          dispatch(setAuthenticated(false));
          dispatch(setToken(null));
        });
    }
  }, [dispatch, token, isAuthenticated]);

  // Restore cart and wishlist when authenticated
  useEffect(() => {
    if (!isAuthenticated || !token || !user?.username) return;

    const lastKnown = localStorage.getItem('lastUsername');
    if (lastKnown && lastKnown !== user.username) {
      localStorage.removeItem('cymanCart');
      localStorage.removeItem('cymanWishlist');
      return;
    }

    dispatch(fetchCartFromServer())
      .unwrap()
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          toast.success('🛒 Cart restored');
        }
      })
      .catch((err) => {
        console.warn('Cart restore error:', err);
      });

    dispatch(fetchWishlistFromServer())
      .unwrap()
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          toast.success('✅ Wishlist restored');
        }
      })
      .catch((err) => {
        console.warn('Wishlist restore error:', err);
      });
  }, [dispatch, isAuthenticated, token, user]);

  // Persist cart after changes — even when empty
  useEffect(() => {
    if (!isAuthenticated || !token || !user?.username) return;

    const timer = setTimeout(() => {
      dispatch(persistCartToServer());
    }, 200);

    return () => clearTimeout(timer);
  }, [cart, isAuthenticated, token, user, dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={<PrivateRoute><Checkout /></PrivateRoute>}
        />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/register" element={<Register />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/request-password-reset" element={<RequestPasswordReset />} />
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