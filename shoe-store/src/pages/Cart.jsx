import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, setCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');

  const formatKES = (amount) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const incrementQty = (id) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrementQty = (id) => {
    setCart(cart.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (item.discounted ?? item.price) * (item.quantity || 1),
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-red-600">Your Cart 🛒</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white border shadow rounded-lg"
              >
                <img
                  src={`http://localhost:8000/media/${item.image}`}
                  alt={item.shoe}
                  className="w-32 h-32 object-cover rounded"
                />

                <div className="flex-1 w-full">
                  <h3 className="text-lg font-semibold text-gray-800">{item.shoe}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.description?.length > 60
                      ? `${item.description.slice(0, 60)}...`
                      : item.description}
                  </p>

                  <p className="text-md text-gray-800 mb-1">
                    Price:{' '}
                    {item.discounted && item.discounted < item.price ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">
                          {formatKES(item.price)}
                        </span>
                        <span className="text-green-700 font-semibold">
                          {formatKES(item.discounted)}
                        </span>
                        <span className="ml-2 text-sm text-red-600 font-medium">
                          Save {formatKES(item.price - item.discounted)} (
                          {Math.round((1 - item.discounted / item.price) * 100)}% off)
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-800 font-semibold">
                        {formatKES(item.price)}
                      </span>
                    )}
                  </p>

                  <div className="flex gap-2 items-center mt-2">
                    <button
                      onClick={() => decrementQty(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => incrementQty(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4 text-right">
            <p className="text-xl font-bold text-gray-800">
              Subtotal: {formatKES(subtotal)}
            </p>

            <div className="text-left">
              <label className="block mb-1 font-semibold">Payment Method:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border px-4 py-2 rounded w-full sm:w-1/2"
              >
                <option value="mpesa">M-Pesa</option>
                <option value="card">Card</option>
              </select>
            </div>

            <Link
              to={{
                pathname: '/checkout',
                search: `?method=${paymentMethod}`,
              }}
            >
              <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;