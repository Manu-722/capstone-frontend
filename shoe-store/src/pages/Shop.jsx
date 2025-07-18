import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useDispatch, useSelector } from 'react-redux';
import { addWishlistItem } from '../redux/wishlistSlice';
import { toast } from 'react-toastify'; 

const Shop = () => {
  const { cart, setCart } = useContext(CartContext);
  const [shoes, setShoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    fetch('http://localhost:8000/api/shoes/')
      .then(res => res.json())
      .then(data => setShoes(data))
      .catch(err => console.error('Failed to load shoes:', err));
  }, []);

  const formatKES = (amount) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);

  const handleAddToCart = (item) => {
    const existing = cart.find(prod => prod.id === item.id);
    if (existing) {
      const updated = cart.map(prod =>
        prod.id === item.id
          ? { ...prod, quantity: (prod.quantity || 1) + 1 }
          : prod
      );
      setCart(updated);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = (item) => {
    if (!isAuthenticated) {
      toast.info('Please log in to save items 💖');
      return;
    }
    dispatch(addWishlistItem(item));
    toast.success('Saved to wishlist 💖');
  };

  const filteredShoes = shoes.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isNewArrival = (createdAt) => {
    const addedDate = new Date(createdAt);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return addedDate > sevenDaysAgo;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-red-600 text-center">Cyman Wear Shop</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full md:w-1/2 mx-auto block mb-8 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
      />

      {filteredShoes.length === 0 ? (
        <p className="text-center text-gray-500">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredShoes.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded shadow hover:shadow-lg transition p-4 relative flex flex-col"
            >
              {isNewArrival(item.created_at) && (
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  🌟 New Arrival
                </span>
              )}

              <img
                src={`http://localhost:8000/media/${item.image}`}
                alt={item.name}
                className="h-48 w-full object-cover rounded mb-4"
              />

              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>

              <p className="text-sm text-gray-600 mb-2">
                {item.description?.length > 80
                  ? `${item.description.slice(0, 80)}...`
                  : item.description}
              </p>

              <p className="text-green-700 font-bold text-md mb-3">
                {formatKES(item.price)}
              </p>

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 bg-red-500 hover:bg-red-700 text-white py-2 rounded"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddToWishlist(item)}
                  className="flex-1 bg-red-500 hover:bg-red-700 text-white py-2 rounded"
                >
                  💖 Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;