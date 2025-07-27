import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, ChevronLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const SellerProductPage = () => {
  const { sellerId } = useParams();
  console.log("Seller ID:", sellerId); // Debugging line to check sellerId
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, totalItems } = useCart();

  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/buyer/seller-prod/${sellerId}`, 
        {method: 'GET'}
      );
      const data = await res.json();

      if (res.ok && data.products?.available) {
        setSellerProducts(data.products.available);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, [sellerId]);

  const handleIncreaseQuantity = (product) => {
    const cartItem = items.find(item => item.id === product._id);
    if (cartItem) {
      // Item already in cart, increase quantity
      updateQuantity(product._id, cartItem.quantity + 1);
    } else {
      // Add new item to cart
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        imageUrl: product.image,
        isEcoFriendly: product.isEcoFriendly || false
      });
    }
  };

  const handleDecreaseQuantity = (product) => {
    const cartItem = items.find(item => item.id === product._id);
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(product._id, cartItem.quantity - 1);
    } else if (cartItem && cartItem.quantity === 1) {
      updateQuantity(product._id, 0); // This will remove the item
    }
  };

  const getQuantityInCart = (productId) => {
    const cartItem = items.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
          <p className="text-gray-700 text-lg">Loading seller products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 text-lg mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300"
        >
          <ChevronLeft size={20} className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-md p-4 border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-1"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex-grow text-center">
            <h1 className="text-2xl font-bold text-gray-900">Seller Products</h1>
            <p className="text-md text-gray-600">Browse items available from this seller.</p>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-24">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Products</h2>

        {sellerProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-xl text-gray-600 font-semibold">No products available from this seller.</p>
            <p className="text-gray-500 mt-2">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerProducts.map((product) => {
              const quantityInCart = getQuantityInCart(product._id);
              const isInCart = quantityInCart > 0;

              return (
                <div
                  key={product._id}
                  className={`bg-white rounded-lg shadow-md p-5 flex flex-col items-center text-center border-2 ${
                    isInCart ? 'border-orange-400' : 'border-gray-200'
                  } transition-all duration-200`}
                >
                  <img
                    src={product.image || 'https://placehold.co/100x100/cccccc/ffffff?text=No+Image'}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-lg mb-4 border border-gray-100"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{product.description || 'No description provided.'}</p>
                  {product.isEcoFriendly && (
                    <div className="text-green-600 text-sm font-medium mb-2">
                      📦 50 pcs per pack
                    </div>
                  )}
                  <p className="text-2xl font-bold text-orange-600 mb-4">
                    ₹{product.price.toFixed(2)} / {product.unit}
                  </p>

                  <div className="flex items-center justify-center space-x-3 w-full">
                    <button
                      onClick={() => handleDecreaseQuantity(product)}
                      className={`p-2 rounded-full ${
                        isInCart
                          ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={!isInCart}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-2xl font-semibold text-gray-800 min-w-[40px] text-center">
                      {quantityInCart}
                    </span>
                    <button
                      onClick={() => handleIncreaseQuantity(product)}
                      className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {isInCart && (
                    <p className="mt-3 text-sm text-green-600 font-medium flex items-center gap-1">
                      <ShoppingCart size={16} /> Added to Cart!
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Go to Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-orange-500 p-4 shadow-lg">
          <div className="container mx-auto">
            <button
              onClick={() => navigate('/buyer/cart')}
              className="w-full bg-white text-orange-500 font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-md"
            >
              <ShoppingCart size={24} />
              <span className="text-lg">Go to Cart ({totalItems} Items)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductPage;
