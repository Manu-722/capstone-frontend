import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { fetchCartFromServer } from '../redux/cartSlice';
import { fetchWishlist } from '../redux/wishlistSlice';
import { setAuthenticated, setUser, setToken } from '../redux/authSlice';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const registerRes = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password }),
      });

      const registerData = await registerRes.json();

      if (registerRes.ok) {
        const loginRes = await fetch('http://localhost:8000/api/token/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: name, password }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          localStorage.setItem('authToken', loginData.access);
          localStorage.setItem('refreshToken', loginData.refresh);
          localStorage.setItem('cymanUser', JSON.stringify({ name, email }));

          login(loginData.access);
          dispatch(setToken(loginData.access));
          dispatch(setAuthenticated(true));

          const profileRes = await fetch('http://localhost:8000/api/user-profile/', {
            headers: { Authorization: `Bearer ${loginData.access}` },
          });
          if (profileRes.ok) {
            const user = await profileRes.json();
            dispatch(setUser(user));
          }

          dispatch(fetchCartFromServer());
          dispatch(fetchWishlist());

          toast.success('Registered successfully! Redirecting...');
          const params = new URLSearchParams(location.search);
          const returnTo = params.get('returnTo') || '/';
          setTimeout(() => navigate(returnTo), 1500);
        } else {
          toast.error('Registered, but login failed');
        }
      } else {
        toast.error(registerData.error || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = 'http://localhost:8000/accounts/google/login/?process=signup';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Create Your Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Username"
          value={formData.name}
          onChange={handleChange}
          className="mb-4 w-full px-4 py-2 border rounded focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mb-6 w-full px-4 py-2 border rounded focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <button
          onClick={handleGoogleRegister}
          className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Sign up with Google
        </button>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;