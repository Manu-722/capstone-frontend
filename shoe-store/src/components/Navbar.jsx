import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { cart, setCart } = useContext(CartContext);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('cymanUser'));
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getCartItemCount = () =>
    cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const handleConfirmedLogout = () => {
    setCart([]);
    localStorage.removeItem('cymanCart');
    logout();
    setShowLogoutConfirm(false);
    navigate('/');
  };

  useEffect(() => {
    if (showLogoutConfirm) {
      const timer = setTimeout(() => setShowLogoutConfirm(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showLogoutConfirm]);

  return (
    <>
      {/* Confirmation Overlay */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow p-6 w-80 text-center space-y-4 animate-fade-in">
            <p className="text-gray-800 text-base font-medium">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={handleConfirmedLogout}
                className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="bg-white shadow px-6 py-3 flex justify-between items-center relative z-40">
        <Link to="/" className="text-xl font-bold text-blue-600">Cyman Wear</Link>

        <div className="flex items-center gap-6">
          <Link to="/shop" className="text-gray-700 hover:text-blue-600">Shop</Link>

          <Link to="/cart" className="relative text-2xl text-gray-700 hover:text-blue-600">
            🛒
            {getCartItemCount() > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-1 rounded-full">
                {getCartItemCount()}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <>
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-red-600 hover:underline text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-600 hover:underline text-sm">
                Login
              </Link>
              <Link to="/register" className="text-blue-600 hover:underline text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;