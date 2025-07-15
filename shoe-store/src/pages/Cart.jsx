import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please log in to view your cart.');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cymanCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [setCart]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cymanCart', JSON.stringify(cart));
  }, [cart]);

  if (!isAuthenticated) return null;

  const getSubtotal = () =>
    cart.reduce((total, item) => total + item.price, 0);

  const discount = cart.length > 2 ? getSubtotal() * 0.07 : 0;
  const total = getSubtotal() - discount;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-700">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-4 rounded shadow"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <p className="text-blue-700 font-bold">${item.price.toFixed(2)}</p>
            </div>
          ))}

          <div className="mt-6 border-t pt-4 text-right">
            <p className="text-gray-800 font-medium">
              Subtotal: ${getSubtotal().toFixed(2)}
            </p>
            {discount > 0 && (
              <p className="text-green-600 font-medium">
                Discount (7%): -${discount.toFixed(2)}
              </p>
            )}
            <p className="text-xl font-bold text-blue-800">
              Total: ${total.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;