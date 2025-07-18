import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 🔐 Fetch profile from backend using JWT
  const fetchUser = async (authToken) => {
    try {
      const res = await fetch('http://localhost:8000/api/user-profile/', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setUser(null);
    }
  };

  // 🚀 Load token and user on initial app mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  // ✳️ Handle login
  const login = (authToken) => {
    localStorage.setItem('authToken', authToken);
    setIsAuthenticated(true);
    setToken(authToken);
    fetchUser(authToken);
  };

  // 🔒 Handle logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('cymanCart'); // Optional: clear cart cache
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        token, // ✅ Now available everywhere
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};