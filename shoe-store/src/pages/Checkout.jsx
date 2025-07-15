import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const discountRate = totalQuantity >= 2 ? 0.07 : 0;

  const getItemTotal = (item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity || 1);
    const baseTotal = isNaN(price) ? 0 : price * quantity;
    return baseTotal - baseTotal * discountRate;
  };

  const formatKES = (amount) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
    }).format(amount);

  const total = cart.reduce((sum, item) => sum + getItemTotal(item), 0);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      phone,
      address,
      items: cart,
      total,
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      // Optional: clear cart
      setCart([]);
      localStorage.removeItem('cymanCart');

      toast.success('Order placed successfully!');
      navigate('/thank-you');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-center text-blue-700">Checkout</h2>

      <form onSubmit={handleOrderSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          ></textarea>
        </div>

        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Order Summary</h3>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between text-sm text-gray-700 mb-1">
              <span>
                {item.name} × {item.quantity || 1}
              </span>
              <span>{formatKES(getItemTotal(item))}</span>
            </div>
          ))}
          <p className="text-right text-xl font-bold text-blue-700 mt-3">
            Total: {formatKES(total)}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 ${
            loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          } text-white font-semibold px-6 py-2 rounded`}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;