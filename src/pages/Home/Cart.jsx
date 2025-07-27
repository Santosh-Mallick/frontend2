import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, XCircle, ChevronLeft } from 'lucide-react'; // Import ChevronLeft
import { useNavigate } from 'react-router-dom';
import { getCreditWallet, applyCreditPoints, placeOrder } from '../../services/creditWalletService';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import CreditHistory from '../../components/CreditWallet/CreditHistory';


const ShoppingCartPage = () => {
  const { items: cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalItems, totalEcoFriendlyQuantity } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showEmptyCartMessage, setShowEmptyCartMessage] = useState(false);
  const [creditWallet, setCreditWallet] = useState(null);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser, userType, isAuthenticated } = useAuth();
  const token = localStorage.getItem('token'); // Get token directly from localStorage



  // Calculate final total after discount
  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - discountApplied);
  }, [subtotal, discountApplied]);

  // Handle quantity increase
  const handleIncreaseQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      removeFromCart(id);
    }
  };

  // Handle item removal
  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  // Get user ID from currentUser object (check both _id and id fields)
  const getUserId = () => {
    return currentUser?._id || currentUser?.id;
  };

  // Check if user is properly authenticated
  const isUserAuthenticated = () => {
    const userId = getUserId();
    const hasToken = !!token;
    const isAuth = isAuthenticated;
    const isBuyer = userType === 'buyer';
    
    return userId && hasToken && isAuth && isBuyer;
  };

  // Load credit wallet on component mount
  useEffect(() => {
    const fetchCreditWallet = async () => {
      if (isUserAuthenticated()) {
        const userId = getUserId();
        try {
          const data = await getCreditWallet(userId, token);
          setCreditWallet(data.creditWallet);
        } catch (err) {
          console.error('Error fetching credit wallet:', err);
          // Fallback to mock data for demo
          setCreditWallet({
            points: 5,
            totalEarned: 10,
            totalUsed: 5
          });
        }
      }
    };

    fetchCreditWallet();
  }, [currentUser, token, isAuthenticated, userType]);

  // Handle applying credit points
  const handleApplyPoints = async () => {
    if (pointsToUse <= 0) {
      setError('Please enter a valid number of points to use');
      return;
    }

    if (pointsToUse > creditWallet?.points) {
      setError(`You only have ${creditWallet?.points} points available`);
      return;
    }

    // Calculate maximum points that can be used (1 point = ₹10)
    const maxPointsForSubtotal = Math.ceil(subtotal / 10);
    if (pointsToUse > maxPointsForSubtotal) {
      setError(`You can only use up to ${maxPointsForSubtotal} points for this order (₹${subtotal.toFixed(2)} subtotal)`);
      return;
    }

    if (!isUserAuthenticated()) {
      setError('Please login as a buyer to use credit points');
      return;
    }

    try {
      setLoading(true);
      const userId = getUserId();
      const result = await applyCreditPoints(userId, pointsToUse, token);
      
      setDiscountApplied(result.discountAmount);
      setCreditWallet(result.creditWallet);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle placing the order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setShowEmptyCartMessage(true);
      setTimeout(() => setShowEmptyCartMessage(false), 3000); // Hide after 3 seconds
      return;
    }

    if (!isUserAuthenticated()) {
      setError('Please login as a buyer to place an order');
      return;
    }

    try {
      setLoading(true);
      
      const userId = getUserId(); // Get userId here
      const orderData = {
        products: cartItems.map(item => ({
          productId: item.id,
          quantity: {
            value: item.quantity,
            unit: item.unit
          }
        })),
        buyerId: userId,
        sellerId: '507f1f77bcf86cd799439011', // Default seller ID for demo
        totalAmount: finalTotal,
        shippingAddress: currentUser.address || {
          line: 'Demo Address',
          locality: 'Demo Locality',
          city: 'Demo City',
          pincode: '123456',
          state: 'Demo State'
        }
      };

      const result = await placeOrder(orderData, token);
      
      setOrderPlaced(true);
      clearCart(); // Clear cart after placing order
      setDiscountApplied(0);
      setPointsToUse(0);
      
      // Refresh credit wallet if points were awarded
      if (result.ecoFriendlyPointsAwarded > 0) {
        const walletData = await getCreditWallet(userId, token);
        setCreditWallet(walletData.creditWallet);
      }
      
      setTimeout(() => setOrderPlaced(false), 5000); // Hide success message after 5 seconds
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md" role="alert">
            <p className="font-bold">Error!</p>
            <p>{error}</p>
          </div>
        )}

        {discountApplied > 0 && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg shadow-md" role="alert">
            <p className="font-bold">Credit Points Applied!</p>
            <p>You've saved ₹{discountApplied.toFixed(2)} using {pointsToUse} credit points.</p>
          </div>
        )}

        {/* Show message if user is logged in but not as a buyer */}
        {isAuthenticated && userType !== 'buyer' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg shadow-md" role="alert">
            <p className="font-bold">Access Restricted</p>
            <p>You are logged in as a {userType}. Only buyers can access the cart and place orders.</p>
          </div>
        )}



        {cartItems.length === 0 && !orderPlaced && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 text-center py-12 bg-white rounded-lg shadow-md">
              <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-xl text-gray-600 font-semibold">Your cart is empty.</p>
              <p className="text-gray-500 mt-2">Add some delicious products to get started!</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
            
            {/* Show credit history even when cart is empty */}
            <div className="lg:col-span-1 space-y-4">
              <CreditHistory creditWallet={creditWallet} />
              

            </div>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-md border border-gray-200 relative">
                  {/* Eco-friendly badge */}
                  {item.isEcoFriendly && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10">
                      🌱 Official Eco Bags
                    </div>
                  )}
                  
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg mr-4 border border-gray-100"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/cccccc/ffffff?text=No+Image`; }}
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price.toFixed(2)} / {item.unit}</p>
                    {item.isEcoFriendly && (
                      <p className="text-green-600 text-sm font-medium">📦 50 pcs per pack</p>
                    )}
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
              
              {/* Eco-friendly Points Info */}
              {totalEcoFriendlyQuantity > 0 && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-sm font-semibold text-green-900 mb-2">🌱 Eco-Friendly Products</h3>
                  <div className="text-xs text-green-700">
                    <p>Eco-friendly pieces in cart: <span className="font-semibold">{totalEcoFriendlyQuantity}</span></p>
                    <p>Points to earn: <span className="font-semibold">{Math.floor(totalEcoFriendlyQuantity / 100)}</span></p>
                    <p className="text-xs text-green-600 mt-1">(1 point per 100 eco-friendly pieces)</p>
                    <p className="text-xs text-green-600">Only eco-friendly products earn credit points!</p>
                  </div>
                </div>
              )}
              
              {/* Credit Wallet Section */}
              {creditWallet && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">💳 Credit Wallet</h3>
                  <div className="text-xs text-blue-700 mb-2">
                    <p>Available Points: <span className="font-semibold">{creditWallet.points}</span></p>
                    <p>Total Earned: <span className="font-semibold">{creditWallet.totalEarned}</span></p>
                    <p>Total Used: <span className="font-semibold">{creditWallet.totalUsed}</span></p>
                    <p className="text-blue-600 font-medium">1 Point = ₹10 discount</p>
                    
                    {/* Point calculation preview */}
                    {pointsToUse > 0 && (
                      <div className="mt-2 p-2 bg-blue-100 rounded border border-blue-200">
                        <p className="font-semibold text-blue-800">Preview:</p>
                        <p>Using {pointsToUse} points = ₹{(pointsToUse * 10).toFixed(2)} discount</p>
                        <p>New total: ₹{(finalTotal - (pointsToUse * 10)).toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        max={Math.min(creditWallet.points, Math.ceil(subtotal / 10))}
                        value={pointsToUse}
                        onChange={(e) => setPointsToUse(parseInt(e.target.value) || 0)}
                        className="flex-1 px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Points to use"
                        disabled={creditWallet.points === 0}
                      />
                      <button
                        onClick={handleApplyPoints}
                        disabled={loading || pointsToUse <= 0 || creditWallet.points === 0}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                    
                    {/* Quick apply buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPointsToUse(1)}
                        disabled={loading || creditWallet.points < 1}
                        className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Use 1
                      </button>
                      <button
                        onClick={() => setPointsToUse(Math.min(5, creditWallet.points))}
                        disabled={loading || creditWallet.points < 1}
                        className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Use 5
                      </button>
                      <button
                        onClick={() => setPointsToUse(Math.min(creditWallet.points, Math.ceil(subtotal / 10)))}
                        disabled={loading || creditWallet.points < 1}
                        className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Use Max
                      </button>
                    </div>
                    
                    {discountApplied > 0 && (
                      <button
                        onClick={() => {
                          setDiscountApplied(0);
                          setPointsToUse(0);
                          setError(null);
                        }}
                        className="w-full px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Clear Applied Points
                      </button>
                    )}
                    
                    {creditWallet.points === 0 && (
                      <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded border">
                        No points available. Buy eco-friendly items to earn points!
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Items ({totalItems})</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                {discountApplied > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Credit Points Discount</span>
                    <span>-₹{discountApplied.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Add more summary lines if needed (e.g., shipping, tax) */}
                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
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
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} />
              {loading ? 'Processing...' : `Place Order (₹${finalTotal.toFixed(2)})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartPage;