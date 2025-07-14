import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);


  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">Cyman Wear</Link>

      <div className="flex items-center gap-6">
        <Link to="/shop" className="text-gray-700 hover:text-blue-600">Shop</Link>

        
        <Link to="/cart" className="relative text-2xl text-gray-700 hover:text-blue-600">
          🛒
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-1 rounded-full">
              {cart.length}
            </span>
          )}
        </Link>

        
        {user ? (
          <button onClick={logout} className="text-red-600 hover:underline text-sm">
            Logout
          </button>
        ) : (
          <Link to="/login" className="text-blue-600 hover:underline text-sm">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;