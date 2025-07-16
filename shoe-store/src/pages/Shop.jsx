import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';

const products = [
  {
    id: 1,
    name: 'Cyman Blaze Runner',
    price: 1800,
    image: '/src/assets/pexels-pixabay-267301.jpg',
    description: 'Lightweight running shoes designed for speed and style.',
  },
  {
    id: 2,
    name: 'Cyman Drift Max',
    price: 3000,
    image: '/src/assets/pexels-mnzoutfits-1598505.jpg',
    description: 'High-top sneakers with durable grip and urban design.',
  },
  {
    id: 3,
    name: 'Cyman Pulse Slide',
    price: 2000,
    image: '/src/assets/pexels-mstudio-360817-1240892.jpg',
    description: 'Everyday comfort sandals with breathable sole.',
  },
  {
    id: 1,
    name: 'Cyman Blaze Runner',
    price: 1800,
    image: '/src/assets/pexels-pixabay-267301.jpg',
    description: 'Lightweight running shoes designed for speed and style.',
  },
  {
    id: 2,
    name: 'Cyman Drift Max',
    price: 3000,
    image: '/src/assets/pexels-mnzoutfits-1598505.jpg',
    description: 'High-top sneakers with durable grip and urban design.',
  },
  {
    id: 3,
    name: 'Cyman Pulse Slide',
    price: 2000,
    image: '/src/assets/pexels-mstudio-360817-1240892.jpg',
    description: 'Everyday comfort sandals with breathable sole.',
  },
  {
    id: 1,
    name: 'Cyman Blaze Runner',
    price: 1800,
    image: '/src/assets/pexels-pixabay-267301.jpg',
    description: 'Lightweight running shoes designed for speed and style.',
  },
  {
    id: 2,
    name: 'Cyman Drift Max',
    price: 3000,
    image: '/src/assets/pexels-mnzoutfits-1598505.jpg',
    description: 'High-top sneakers with durable grip and urban design.',
  },
  {
    id: 3,
    name: 'Cyman Pulse Slide',
    price: 2000,
    image: '/src/assets/pexels-mstudio-360817-1240892.jpg',
    description: 'Everyday comfort sandals with breathable sole.',
  },
  {
    id: 1,
    name: 'Cyman Blaze Runner',
    price: 1800,
    image: '/src/assets/pexels-pixabay-267301.jpg',
    description: 'Lightweight running shoes designed for speed and style.',
  },
  {
    id: 2,
    name: 'Cyman Drift Max',
    price: 3000,
    image: '/src/assets/pexels-mnzoutfits-1598505.jpg',
    description: 'High-top sneakers with durable grip and urban design.',
  },
  {
    id: 3,
    name: 'Cyman Pulse Slide',
    price: 2000,
    image: '/src/assets/pexels-mstudio-360817-1240892.jpg',
    description: 'Everyday comfort sandals with breathable sole.',
  },

];

const Shop = () => {
  const { cart, setCart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const results = products.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm]);

  const formatKES = (amount) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
    }).format(amount);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      const updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Cyman Wear Shop</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full md:w-1/2 mx-auto block mb-8 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={item.image || '/assets/shoes/default.jpg'}
                alt={item.name}
                className="h-48 w-full object-cover rounded mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="text-green-700 font-bold text-md mb-3">
                {formatKES(item.price)}
              </p>
              <button
                onClick={() => addToCart(item)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-auto"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;