const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-center">
      <div>
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Cyman Wear</h1>
        <p className="text-gray-700 mb-6">Step up your sneaker game with style and comfort.</p>
        <a
          href="/shop"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
};

export default Home; 