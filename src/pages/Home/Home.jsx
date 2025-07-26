import { ShoppingCart, User } from 'lucide-react';
import React, { useState } from 'react';

const Home = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Mock seller data (now representing raw material providers)
  const sellers = [
    {
      id: 1,
      name: "Fresh Veggies & Fruits Co.",
      foodTypes: ['Vegetables', 'Fruits', 'Organic'],
      rating: 4.8,
      isOpen: true,
      image: 'https://via.placeholder.com/150/8BC34A/FFFFFF?text=Veggies' // Green for fresh produce
    },
    {
      id: 2,
      name: "Spices & Grains Mart",
      foodTypes: ['Spices', 'Grains', 'Pulses'],
      rating: 4.5,
      isOpen: false, // Could be closed for the day
      image: 'https://via.placeholder.com/150/FF9800/FFFFFF?text=Spices' // Orange for spices
    },
    {
      id: 3,
      name: "Dairy & Oil Supplies",
      foodTypes: ['Milk', 'Cheese', 'Cooking Oil'],
      rating: 4.9,
      isOpen: true,
      image: 'https://via.placeholder.com/150/B0BEC5/FFFFFF?text=Dairy' // Grey for dairy
    },
    {
      id: 4,
      name: "Meat & Poultry Hub",
      foodTypes: ['Chicken', 'Mutton', 'Fish'],
      rating: 4.2,
      isOpen: true,
      image: 'https://via.placeholder.com/150/E57373/FFFFFF?text=Meat' // Red for meat
    },
    {
      id: 5,
      name: "Packaging Solutions Inc.",
      foodTypes: ['Eco-friendly Bags', 'Containers'],
      rating: 4.6,
      isOpen: false, // Out of stock or closed for maintenance
      image: 'https://via.placeholder.com/150/4DD0E1/FFFFFF?text=Packaging' // Light blue for packaging
    },
    {
      id: 6,
      name: "Wholesale Bakery Goods",
      foodTypes: ['Buns', 'Breads', 'Flour'],
      rating: 4.7,
      isOpen: true,
      image: 'https://via.placeholder.com/150/D4E157/FFFFFF?text=Bakery' // Lime green for bakery
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- Sticky Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo/Name */}
          <div className="text-2xl font-bold text-gray-800">
            ProjectX
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">Home</a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">How it Works</a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">About Us</a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">Contact</a>
          </div>

          {/* Right-aligned Icons */}
          <div className="flex items-center space-x-4 relative">
            {/* Notification Bell */}
            <button className="text-gray-600 hover:text-orange-500 focus:outline-none">
                <ShoppingCart />
            </button>

            {/* Profile Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <User />
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Sign in as Street Food Seller
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Sign in as Raw Material Provider
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="bg-gradient-to-r from-orange-100 to-amber-100 py-16 px-4 md:py-24">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Column: Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
              Connect Directly with Raw Material Suppliers 🤝
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Street food sellers: Source fresh, quality ingredients. Providers: Expand your reach to local food businesses.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 flex items-center justify-center">
                <span className="mr-2">🛒</span> Find Suppliers
              </button>
              <button className="bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 flex items-center justify-center">
                <span className="mr-2">📦</span> List Your Products
              </button>
            </div>
          </div>

          {/* Right Column: Illustration/Image */}
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <img
              src="https://via.placeholder.com/600x400/FFCC80/8B4513?text=Supplier+to+Seller+Connect" // Changed placeholder text
              alt="Supplier to Seller Connection Illustration"
              className="max-w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* --- Recommended Sellers Section (now Providers) --- */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Top Raw Material Providers for You 🥕
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sellers.map((seller) => ( // Renamed 'sellers' to 'providers' for clarity in actual use
              <div
                key={seller.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer border border-gray-100"
              >
                <img
                  src={seller.image}
                  alt={seller.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{seller.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {seller.foodTypes.map((type, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-500 flex items-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.727c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {seller.rating}
                    </span>
                    <span
                      className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                        seller.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {seller.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <button
                    className={`w-full py-2 rounded-md font-semibold text-white transition duration-300 ${
                      seller.isOpen ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!seller.isOpen}
                  >
                    View Products
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Optional: Simple Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <div className="container mx-auto text-sm">
          &copy; {new Date().getFullYear()} ProjectX. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;