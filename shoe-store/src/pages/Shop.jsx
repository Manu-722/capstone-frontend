import React, { useEffect, useState } from 'react';

const Shop = () => {
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/shoes/')
      .then((res) => res.json())
      .then((data) => setShoes(data))
      .catch((err) => console.error('Error fetching shoes:', err));
  }, []);

  const isNewArrival = (created_at) => {
    const addedDate = new Date(created_at);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return addedDate > sevenDaysAgo;
  };

  return (
    <section className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-red-600 text-center">Cyman Wear — Shop</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {shoes.map((shoe) => (
          <div key={shoe.id} className="border rounded-lg shadow hover:shadow-md p-4 relative">
            {isNewArrival(shoe.created_at) && (
              <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">New Arrival</span>
            )}
            <img
              src={`http://localhost:8000/media/${shoe.image}`}
              alt={shoe.name}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="mt-4 text-lg font-semibold">{shoe.name}</h3>
            <p className="text-gray-700 text-sm mb-2">KES {shoe.price}</p>
            <button className="mt-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Shop;