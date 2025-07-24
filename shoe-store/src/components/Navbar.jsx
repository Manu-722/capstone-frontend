import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CartContext } from '../context/CartContext';
import { logout } from '../redux/authSlice';
import { persistCartToServer } from '../redux/cartSlice';  // ✅ Added

const Navbar = () => {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);

  const getCartItemCount = () =>
    cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const handleConfirmedLogout = async () => {
    try {
      await dispatch(persistCartToServer());   // ✅ Persist cart before clearing
    } catch (err) {
      console.error('Cart persistence failed:', err);
    }

    setCart([]);
    localStorage.removeItem('cymanCart');
    dispatch(logout());
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
      {/* 🔒 Logout Confirmation Overlay */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/src/assets/logout-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded shadow-lg p-6 w-80 text-center space-y-4">
              <p className="text-gray-800 text-base font-medium">
                Are you sure you want to log out?
              </p>
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
        </div>
      )}

      {/* 🛒 Main Navigation Bar */}
      <nav className="bg-black shadow px-6 py-3 flex justify-between items-center relative z-40">
        <Link to="/" className="text-xl font-bold text-red-500">Cyman Wear</Link>

        <div className="flex items-center gap-6">
          <Link to="/shop" className="text-red-500 hover:text-red-500">Shop</Link>

          <Link to="/cart" aria-label="Cart" className="relative text-2xl text-red-500 hover:text-red-500">
            🛒
            {getCartItemCount() > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1 rounded-full">
                {getCartItemCount()}
              </span>
            )}
          </Link>

          {isAuthenticated && (
            <Link to="/wishlist" className="relative text-xl hover:text-red-500">
              <span className="text-red-500">❤️</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated && user ? (
            <>
              <span className="text-sm text-gray-200">Welcome, {user.username}</span>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-red-500 hover:underline text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-red-500 hover:underline text-sm">
                Login
              </Link>
              <Link to="/register" className="text-red-500 hover:underline text-sm">
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