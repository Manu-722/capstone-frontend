import React, { createContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { clearWishlist } from '../redux/wishlistSlice';
import { useCart } from '../context/CartContext'; // ✅ Import CartContext for runtime flush

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();

  const { emptyCart } = useCart(); // ✅ Access CartContext flush

  const fetchUser = async (authToken) => {
    try {
      const res = await fetch('http://localhost:8000/api/user-profile/', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('lastUsername', data.username);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setUser(null);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  const login = (authToken) => {
    localStorage.setItem('authToken', authToken);
    setIsAuthenticated(true);
    setToken(authToken);
    fetchUser(authToken);
  };

  const logout = () => {
    // 🧹 Remove persisted session
    localStorage.removeItem('authToken');
    localStorage.removeItem('cymanCart');
    localStorage.removeItem('cymanWishlist');
    localStorage.removeItem('lastUsername');

    // 🚿 Flush runtime + Redux
    emptyCart();             // ✅ CartContext flush
    dispatch(clearCart());   // ✅ Redux cart flush
    dispatch(clearWishlist());

    // 🔓 Reset auth state
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);

    // 🌀 Rerender app with clean state
    setTimeout(() => {
      window.location.href = '/';
    }, 50);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};