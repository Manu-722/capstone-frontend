import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Persist cart on every change
  useEffect(() => {
    localStorage.setItem('cymanCart', JSON.stringify(cart));
  }, [cart]);

  const formatKES = (amount) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
    }).format(amount);

  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const discountRate = totalQuantity >= 2 ? 0.07 : 0;

  const getItemBaseTotal = (item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity || 1);
    return isNaN(price) ? 0 : price * quantity;
  };

  const getItemDiscount = (item) => getItemBaseTotal(item) * discountRate;
  const getItemFinalTotal = (item) => getItemBaseTotal(item) - getItemDiscount(item);

  const subtotal = cart.reduce((sum, item) => sum + getItemBaseTotal(item), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + getItemDiscount(item), 0);
  const total = subtotal - totalDiscount;

  const removeItem = (id) => {
    const confirmDelete = window.confirm('Remove this item from your cart?');
    if (confirmDelete) {
      const updated = cart.filter((item) => item.id !== id);
      setCart(updated);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-700">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-4 rounded shadow"
            >
              <img
                src={item.imageUrl || item.image || '/assets/shoes/default.jpg'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="mt-2 text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="text-right">
                {discountRate > 0 ? (
                  <>
                    <p className="text-sm text-gray-500 line-through">
                      {formatKES(getItemBaseTotal(item))}
                    </p>
                    <p className="text-lg font-bold text-green-700 whitespace-nowrap">
                      {formatKES(getItemFinalTotal(item))}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-bold text-green-700 whitespace-nowrap">
                    {formatKES(getItemBaseTotal(item))}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="mt-8 border-t pt-6 text-right space-y-1">
            <p className="text-gray-800 font-medium">
              Subtotal: {formatKES(subtotal)}
            </p>
            {totalDiscount > 0 && (
              <p className="text-green-600 font-medium">
                Discount (7%): –{formatKES(totalDiscount)}
              </p>
            )}
            <p className="text-xl font-bold text-blue-800">
              Total: {formatKES(total)}
            </p>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/checkout')}
                className="mt-4 bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            ) : (
              <p className="text-sm text-gray-500 italic mt-2">
                Please log in to proceed to checkout.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;