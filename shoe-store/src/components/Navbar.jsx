import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('cymanUser'));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getCartItemCount = () =>
    cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
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
              onClick={handleLogout}
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
  );
};

export default Navbar;