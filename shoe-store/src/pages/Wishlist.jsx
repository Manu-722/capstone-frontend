import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { clearWishlist, removeWishlistItem } from '../redux/wishlistSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const wishlist = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(clearWishlist()); // 💥 Clears entire wishlist
    toast.success(`"${item.name}" moved to cart 🛒`);
    navigate('/cart');
  };

  const handleRemove = (itemId) => {
    dispatch(removeWishlistItem(itemId));
    toast.info('Removed from wishlist');
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => dispatch(addToCart(item)));
    dispatch(clearWishlist());
    toast.success('Moved all to cart!');
    navigate('/cart');
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-pink-600">
        Your Wishlist 💖
      </h2>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleMoveAllToCart}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              🛒 Move All to Cart
            </button>
          </div>

          <div className="grid gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center bg-white shadow rounded p-4"
              >
                <img
                  src={`http://localhost:8000/media/${item.image}`}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded"
                />
                <div className="flex-1 ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <div className="flex gap-4 items-center mt-2">
                    <span className="text-green-700 font-bold text-lg">
                      KES {item.discounted ?? item.price}
                    </span>
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="text-sm bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-sm text-red-500 ml-2 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;