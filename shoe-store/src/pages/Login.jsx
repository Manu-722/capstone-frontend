import React, { useState, useEffect, useContext } from 'react';
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
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberUsername');
    if (savedUsername) {
      setFormData((prev) => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

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
      const res = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (rememberMe) {
          localStorage.setItem('rememberUsername', username);
        } else {
          localStorage.removeItem('rememberUsername');
        }

        localStorage.setItem('authToken', data.token);
        login(data.token);
        dispatch(setToken(data.token));
        dispatch(setAuthenticated(true));
        dispatch(setUser({ username: data.username, email: data.email }));

        dispatch(fetchCartFromServer());
        dispatch(fetchWishlist());

        toast.success('Login successful! Redirecting...');
        const returnTo = new URLSearchParams(location.search).get('returnTo') || '/';
        setTimeout(() => navigate(returnTo), 1500);
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch {
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/accounts/google/login/?process=login';
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
          className="mb-4 w-full px-4 py-2 border rounded focus:ring-blue-500 focus:outline-none"
        />

        <label className="flex items-center mb-4 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          Remember Me
        </label>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded transition ${
            loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
          }`}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Sign in with Google
        </button>

        <p className="mt-6 text-sm text-center text-gray-600">
          New to Cyman Wear?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>

        <p className="mt-2 text-sm text-center text-gray-600">
          Forgot password?{' '}
          <Link to="/request-password-reset" className="text-red-600 hover:underline">
            Reset it here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;