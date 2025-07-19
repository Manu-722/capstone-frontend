import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { fetchCartFromServer } from '../redux/cartSlice';
import { fetchWishlist } from '../redux/wishlistSlice';
import { setAuthenticated, setUser, setToken } from '../redux/authSlice';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    const { username, password } = formData;
    if (!username || !password) {
      toast.error('Please fill in both fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('cymanUser', JSON.stringify({ username }));

        login(data.access); // context login if needed
        dispatch(setToken(data.access));
        dispatch(setAuthenticated(true));

        // 🔁 fetch user profile for Redux
        const profileRes = await fetch('http://localhost:8000/api/user-profile/', {
          headers: { Authorization: `Bearer ${data.access}` },
        });
        if (profileRes.ok) {
          const user = await profileRes.json();
          dispatch(setUser(user));
        }

        // 🛒 restore user's server-side cart and wishlist
        dispatch(fetchCartFromServer());
        dispatch(fetchWishlist());

        toast.success('Login successful! Redirecting...');
        const params = new URLSearchParams(location.search);
        const returnTo = params.get('returnTo') || '/';
        setTimeout(() => navigate(returnTo), 1500);
      } else {
        toast.error(data.detail || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Sign In</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="mb-4 w-full px-4 py-2 border rounded focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-6 w-full px-4 py-2 border rounded focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
          }`}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="mt-6 text-sm text-center text-gray-600">
          New to Cyman Wear?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Create an account</Link>
        </p>
        <p className="mt-2 text-sm text-center text-gray-600">
          Forgot password?{' '}
          <Link to="/reset-password" className="text-red-600 hover:underline">Reset it here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;