import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setMessage('Please enter both email and password.');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('cymanUser'));

    if (
      storedUser &&
      storedUser.email === email &&
      storedUser.password === password
    ) {
      login('cyman-auth-token');
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } else {
      setMessage('Incorrect email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Cyman Wear</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full px-4 py-2 border rounded focus:outline-none focus:ring"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full px-4 py-2 border rounded focus:outline-none focus:ring"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Sign In
        </button>

        {message && (
          <div className="mt-4 text-center text-sm text-green-600 animate-pulse">
            {message}
          </div>
        )}

        <div className="mt-6 text-sm text-center text-gray-600">
          Not registered yet?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;