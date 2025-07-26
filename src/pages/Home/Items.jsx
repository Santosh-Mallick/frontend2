import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ProductList = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Mock product data for the 'Vegetables and Fruits' category
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Fresh Tomatoes',
      price: 30, // Price per kg/unit
      unit: 'kg',
      image: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Tomatoes',
      quantity: 0, // Current quantity in cart
    },
    {
      id: 2,
      name: 'Organic Spinach',
      price: 20,
      unit: 'bunch',
      image: 'https://via.placeholder.com/150/66BB6A/FFFFFF?text=Spinach',
      quantity: 0,
    },
    {
      id: 3,
      name: 'Sweet Apples',
      price: 120,
      unit: 'kg',
      image: 'https://via.placeholder.com/150/FFB74D/FFFFFF?text=Apples',
      quantity: 0,
    },
    {
      id: 4,
      name: 'Potatoes (New Crop)',
      price: 25,
      unit: 'kg',
      image: 'https://via.placeholder.com/150/BDBDBD/FFFFFF?text=Potatoes',
      quantity: 0,
    },
    {
      id: 5,
      name: 'Green Bell Peppers',
      price: 45,
      unit: 'piece',
      image: 'https://via.placeholder.com/150/8BC34A/FFFFFF?text=Bell+Peppers',
      quantity: 0,
    },
    {
      id: 6,
      name: 'Bananas (Ripe)',
      price: 60,
      unit: 'dozen',
      image: 'https://via.placeholder.com/150/FFF176/FFFFFF?text=Bananas',
      quantity: 0,
    },
  ]);

  const handleAddToCart = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, quantity: product.quantity + 1 } : product
      )
    );
  };

  const handleSubtractFromCart = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id && product.quantity > 0
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  // Calculate total items in cart for the 'Go to Cart' button
  const totalItemsInCart = products.reduce((total, product) => total + product.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      {/* Back Button */}
      <div className="container mx-auto mt-4">
        <button
          onClick={() => navigate('/')} // Navigate to the home path
          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
      </div>

      {/* Category Header */}
      <div className="container mx-auto mt-8 mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 text-center">
          Vegetables & Fruits 🍎🥦
        </h1>
        <p className="text-lg text-gray-600 text-center">
          Freshly sourced, quality produce for your street food needs.
        </p>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 border border-gray-100 flex flex-col"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  ₹{product.price} / {product.unit}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-center space-x-3 mt-auto">
                <button
                  onClick={() => handleSubtractFromCart(product.id)}
                  disabled={product.quantity === 0}
                  className={`px-3 py-1 rounded-full font-bold text-lg transition duration-300 ${
                    product.quantity === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  }`}
                >
                  -
                </button>
                <span className="text-xl font-bold text-gray-800 w-8 text-center">
                  {product.quantity}
                </span>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 transition duration-300"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed "Go to Cart" button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-orange-600 text-white shadow-lg text-center">
        <button
          className="bg-white text-orange-600 py-3 px-8 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 transition duration-300 flex items-center justify-center mx-auto"
          disabled={totalItemsInCart === 0}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.769.941 1.769H19a2 2 0 002-2v-1a2 2 0 00-2-2H8.5L7 13z"
            />
          </svg>
          Go to Cart ({totalItemsInCart} Items)
        </button>
      </div>
    </div>
  );
};

export default ProductList;
