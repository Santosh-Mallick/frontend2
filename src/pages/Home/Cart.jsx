import React, { useState, useMemo } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, XCircle, ChevronLeft } from 'lucide-react'; // Import ChevronLeft
import { useNavigate } from 'react-router-dom';

const ShoppingCartPage = () => {
  // Mock cart items for demonstration purposes
  const [cartItems, setCartItems] = useState([
    {
      id: 'prod1',
      name: 'Organic Apples',
      price: 50.00, // Price per unit
      priceUnit: 'kg', // Unit for price (e.g., per kg)
      quantity: 2, // Quantity in cart
      unit: 'kg', // Unit of stock (e.g., kg)
      imageUrl: 'https://placehold.co/100x100/E0F2F7/000?text=Apple',
    },
    {
      id: 'prod2',
      name: 'Fresh Milk',
      price: 60.00, // Price per unit
      priceUnit: 'litre',
      quantity: 1,
      unit: 'litre',
      imageUrl: 'https://placehold.co/100x100/FFF3E0/000?text=Milk',
    },
    {
      id: 'prod3',
      name: 'Whole Wheat Bread',
      price: 35.00, // Price per unit
      priceUnit: 'pieces',
      quantity: 3,
      unit: 'pieces',
      imageUrl: 'https://placehold.co/100x100/E8F5E9/000?text=Bread',
    },
  ]);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showEmptyCartMessage, setShowEmptyCartMessage] = useState(false);
  const navigate = useNavigate();

  // Calculate subtotal and total based on cart items
  const { subtotal, totalItems } = useMemo(() => {
    let currentSubtotal = 0;
    let currentTotalItems = 0;
    cartItems.forEach(item => {
      currentSubtotal += item.price * item.quantity;
      currentTotalItems += item.quantity;
    });
    // For simplicity, no tax/shipping added here, total is just subtotal
    return { subtotal: currentSubtotal, totalItems: currentTotalItems };
  }, [cartItems]);

  // Handle quantity increase
  const handleIncreaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      ).filter(item => item.quantity > 0) // Remove item if quantity becomes 0
    );
  };

  // Handle item removal
  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Handle placing the order
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      setShowEmptyCartMessage(true);
      setTimeout(() => setShowEmptyCartMessage(false), 3000); // Hide after 3 seconds
      return;
    }
    // Simulate API call for placing order
    console.log('Placing order with items:', cartItems);
    console.log('Total amount:', subtotal);

    // In a real application, you would send this data to your backend
    // await fetch('/api/place-order', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ items: cartItems, total: subtotal })
    // });

    setOrderPlaced(true);
    setCartItems([]); // Clear cart after placing order
    setTimeout(() => setOrderPlaced(false), 5000); // Hide success message after 5 seconds
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24"> {/* pb-24 to make space for fixed button */}
      <header className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')} // Navigate to home
            className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-1"
            aria-label="Back to home"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="text-blue-600" size={24} />
            Your Shopping Cart
          </h1>
          <div className="w-10"></div> {/* Spacer to balance the header */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {orderPlaced && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg shadow-md" role="alert">
            <p className="font-bold">Order Placed Successfully!</p>
            <p>Thank you for your purchase. Your order is being processed.</p>
          </div>
        )}

        {showEmptyCartMessage && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg shadow-md" role="alert">
            <p className="font-bold">Cart is Empty!</p>
            <p>Please add items to your cart before placing an order.</p>
          </div>
        )}

        {cartItems.length === 0 && !orderPlaced && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-xl text-gray-600 font-semibold">Your cart is empty.</p>
            <p className="text-gray-500 mt-2">Add some delicious products to get started!</p>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg mr-4 border border-gray-100"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/cccccc/ffffff?text=No+Image`; }}
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price.toFixed(2)} / {item.priceUnit}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleDecreaseQuantity(item.id)}
                        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-3 text-lg font-medium text-gray-800">{item.quantity} {item.unit}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.id)}
                        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-4 p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Items ({totalItems})</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {/* Add more summary lines if needed (e.g., shipping, tax) */}
                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Place Order Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-2xl border-t border-gray-200 z-10">
          <div className="container mx-auto flex justify-end">
            <button
              onClick={handlePlaceOrder}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Place Order (₹{subtotal.toFixed(2)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartPage;