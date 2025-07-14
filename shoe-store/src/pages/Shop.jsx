import { useState } from 'react';
// import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';

const products = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Cyman Sneaker ${i + 1}`,
  price: 100 + i * 5,
  image: `/assets/shoe${i + 1}.jpg`,
}));

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search sneakers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-6 p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;