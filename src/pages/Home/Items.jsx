import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';

const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, updateQuantity, items: cartItems, totalItems } = useCart();
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = location.state?.category || 'All';
  const productIDs = location.state?.productIDs || [];

  const fetchAllProducts = async () => {
    try {
      const res = await fetch('https://backend-sand-three-70.vercel.app/api/buyer/get-all-seller-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify({ productIDs }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }
      const data = await res.json();
      const allProducts = Object.values(data.productsBySeller || {}).flat();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [currentUser?.token]);

  const filteredProducts = category === 'All' 
    ? products 
    : products.filter(product => product.category === category);

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image || 'https://via.placeholder.com/150',
      isEcoFriendly: product.isEcoFriendly,
    });
  };

  const handleSubtractFromCart = (productId) => {
    const cartItem = cartItems.find(item => item.id === productId);
    if (cartItem) {
      updateQuantity(productId, cartItem.quantity - 1);
    }
  };

  const getProductQuantity = (productId) => {
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="container mx-auto mt-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
      </div>

      <div className="container mx-auto mt-8 mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 text-center">
          {category === 'All' ? 'All Products' : `${category} Products`} {category === 'Vegetable' ? '🥕' : category === 'Fruit' ? '🍎' : category === 'Dairy' ? '🥛' : category === 'Groceries' ? '🛒' : category === 'Eco' ? '📦' : category === 'Meat' ? '🍖' : category === 'Bakery' ? '🥖' : ''}
        </h1>
        <p className="text-lg text-gray-600 text-center">
          Freshly sourced, quality produce for your street food needs.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600 font-medium">
          <p>Error: {error}</p>
          <p>Please try again later.</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 border border-gray-100 flex flex-col"
            >
              <img
                src={product.image || 'https://via.placeholder.com/150'}
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
                {product.isEcoFriendly && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    🌱 Eco
                  </div>
                )}
                {product.isEcoFriendly && (
                  <div className="text-green-600 text-xs font-medium mb-2">
                    📦 50 pcs per pack
                  </div>
                )}
                <div className="flex items-center justify-center space-x-3 mt-auto">
                  <button
                    onClick={() => handleSubtractFromCart(product._id)}
                    disabled={getProductQuantity(product._id) === 0}
                    className={`px-3 py-1 rounded-full font-bold text-lg transition duration-300 ${
                      getProductQuantity(product._id) === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-gray-800 w-8 text-center">
                    {getProductQuantity(product._id)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 transition duration-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600 font-medium">
          <p>No products found in this category.</p>
          <p>Try browsing other categories or check back later.</p>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-orange-600 text-white shadow-lg text-center">
        <button
          onClick={() => navigate('/buyer/cart')}
          className={`py-3 px-8 rounded-full font-bold text-lg shadow-xl transition duration-300 flex items-center justify-center mx-auto ${
            totalItems === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-white text-orange-600 hover:bg-gray-100'
          }`}
          disabled={totalItems === 0}
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
          {totalItems === 0 ? 'Cart Empty' : `Go to Cart (${totalItems} Items)`}
        </button>
      </div>
    </div>
  );
};

export default ProductList;