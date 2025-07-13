import Slideshow from './Slideshow';

const Sidebar = () => (
  <aside className="w-64 bg-gray-100 p-4 border-r min-h-screen">
    <h2 className="text-xl font-bold mb-4 text-blue-700">Categories</h2>
    <ul className="space-y-2 mb-6">
      <li><a href="#" className="text-blue-600 hover:underline">All Sneakers</a></li>
      <li><a href="#" className="text-blue-600 hover:underline">High Tops</a></li>
      <li><a href="#" className="text-blue-600 hover:underline">Runners</a></li>
      <li><a href="#" className="text-blue-600 hover:underline">Slides</a></li>
    </ul>

    <h2 className="text-lg font-semibold mb-2 text-gray-800">Featured</h2>
    <Slideshow />

    <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-800">Top Picks</h2>
    <ul className="space-y-1 text-sm">
      <li><a href="/product/3" className="text-gray-700 hover:text-blue-600">Cyman Classic</a></li>
      <li><a href="/product/7" className="text-gray-700 hover:text-blue-600">Cyman Runner</a></li>
      <li><a href="/product/12" className="text-gray-700 hover:text-blue-600">Cyman Slide</a></li>
    </ul>
  </aside>
);

export default Sidebar;