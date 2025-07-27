import { ShoppingCart, User, LogOut, Store, ShoppingBag, TrendingUp, Shield, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LocationManager from '../../components/LocationManager';

const Home = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, userType, logout, getUserInfo } = useAuth();
  const userInfo = getUserInfo();

  // States for closest sellers and products data
  const [closestSellers, setClosestSellers] = useState([]);
  const [loadingClosestSellers, setLoadingClosestSellers] = useState(true);
  const [errorClosestSellers, setErrorClosestSellers] = useState(null);
  const [productIDs, setProductIDs] = useState([]);
  const [productsBySeller, setProductsBySeller] = useState({});

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Updated categories for Featured Suppliers
  const featuredCategories = [
    {
      id: 1,
      name: "Vegetables",
      color: 'bg-green-500',
      text: 'Vegetables',
      emoji: '🥕',
      description: 'Fresh and organic vegetables',
    },
    {
      id: 2,
      name: "Fruits",
      color: 'bg-orange-500',
      text: 'Fruits',
      emoji: '🍎',
      description: 'Juicy and fresh fruits',
    },
    {
      id: 3,
      name: "Dairy",
      color: 'bg-blue-500',
      text: 'Dairy Products',
      emoji: '🥛',
      description: 'Fresh dairy products daily',
    },
    {
      id: 4,
      name: "Groceries",
      color: 'bg-amber-500',
      text: 'Grocery Items',
      emoji: '🛒',
      description: 'Essential grocery supplies',
    },
    {
      id: 5,
      name: "Eco",
      color: 'bg-cyan-500',
      text: 'Eco-Friendly',
      emoji: '📦',
      description: 'Sustainable packaging solutions',
    },
    {
      id: 6,
      name: "Meat",
      color: 'bg-red-500',
      text: 'Fresh Meats',
      emoji: '🍖',
      description: 'Quality meat and poultry',
    },
    {
      id: 7,
      name: "Bakery",
      color: 'bg-yellow-500',
      text: 'Bakery Items',
      emoji: '🥖',
      description: 'Fresh bakery ingredients',
    },
  ];

  const features = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Quality Products",
      description: "Source fresh, high-quality ingredients from verified suppliers",
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: "Easy Management",
      description: "Manage your inventory and orders efficiently",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Opportunities",
      description: "Expand your business with reliable supply chain",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trusted Partners",
      description: "Connect with verified and trusted suppliers",
    },
  ];

  const fetchClosestSuppliers = async (lat, lng, productName = '', maxDistanceKm = 35) => {
    setLoadingClosestSellers(true);
    setErrorClosestSellers(null);
    try {
      const payload = {
        buyerLat: lat,
        buyerLon: lng,
        productName: productName,
        MAX_DISTANCE_KM: maxDistanceKm,
      };

      const res = await fetch('http://localhost:5000/api/buyer/find-closest-sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch closest suppliers');
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Network or other error:', error);
      setErrorClosestSellers(error.message || 'Failed to load suppliers.');
      return null;
    } finally {
      setLoadingClosestSellers(false);
    }
  };

  const fetchAllProducts = async (productIDs) => {
    try {
      const res = await fetch('http://localhost:5000/api/buyer/get-all-seller-products', {
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
      return data.productsBySeller || {};
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorClosestSellers(error.message || 'Failed to load products.');
      return {};
    }
  };

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        const lat = 22.740227;
        const lng = 86.200408;

        if (lat && lng) {
          fetchClosestSuppliers(lat, lng)
            .then(data => {
              if (data && data.allSellersWithinRange) {
                setClosestSellers(data.allSellersWithinRange);
                setProductIDs(data.uniqueProductIDsFound || []);
              } else if (data && data.closestSeller && data.allSellersBeyondRange) {
                console.log("No sellers within range, but some beyond:", data.allSellersBeyondRange);
              } else {
                setClosestSellers([]);
              }
            })
            .catch(error => {
              console.error('Error in useEffect fetching closest suppliers:', error);
            });
        }
      } catch (e) {
        console.error("Failed to parse user location from localStorage:", e);
        setErrorClosestSellers("Failed to load user location. Please set your location.");
        setLoadingClosestSellers(false);
      }
    } else {
      setLoadingClosestSellers(false);
      setErrorClosestSellers("No user location found. Please set your location to find nearby suppliers.");
    }
  }, [currentUser?.token]);

  useEffect(() => {
    if (productIDs.length > 0) {
      fetchAllProducts(productIDs)
        .then(data => {
          setProductsBySeller(data);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  }, [productIDs, currentUser?.token]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="sticky top-0 z-50 bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            ProjectX
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">Home</a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">How it Works</a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">About Us</a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">Contact</a>
          </div>
          <div className="flex items-center space-x-4 relative">
            {userType === 'buyer' && (
              <button className="text-gray-600 hover:text-orange-500 focus:outline-none cursor-pointer"
                onClick={() => navigate("/buyer/cart")}>
                <ShoppingCart />
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none cursor-pointer"
              >
                <User />
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        Welcome, {userType === 'buyer' ? userInfo?.name : userInfo?.ownerName || userInfo?.shopName}
                      </div>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          navigate('/products');
                        }}
                      >
                        Browse Products
                      </a>
                      {userType === 'buyer' && (
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate('/buyer/myOrders');
                          }}
                        >
                          My Orders
                        </a>
                      )}
                      {userType === 'seller' && (
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate('/seller/store');
                          }}
                        >
                          My Store
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          navigate('/login');
                        }}
                      >
                        Sign in as Food Seller
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          navigate('/login');
                        }}
                      >
                        Sign in as Supplier
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LocationManager />

      <section className="bg-gradient-to-r from-orange-100 to-amber-100 py-16 px-4 md:py-24">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
              {isAuthenticated
                ? `Welcome back, ${userType === 'buyer' ? userInfo?.name : userInfo?.ownerName || userInfo?.shopName}! 🎉`
                : 'Your Gateway to Quality Ingredients & Business Growth 🚀'
              }
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {isAuthenticated
                ? userType === 'buyer'
                  ? 'Discover fresh, quality ingredients for your food business. Connect with trusted suppliers and grow your enterprise.'
                  : 'Manage your store efficiently and connect with food sellers. Expand your reach and boost your business.'
                : 'Food sellers: Source premium ingredients. Suppliers: Reach more customers. Together, we build successful partnerships.'
              }
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/products')}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 flex items-center justify-center"
                  >
                    <span className="mr-2">🛒</span> Browse Products
                  </button>
                  {userType === 'seller' && (
                    <button
                      onClick={() => navigate('/seller/store')}
                      className="bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 flex items-center justify-center"
                    >
                      <span className="mr-2">🏪</span> Manage Store
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 flex items-center justify-center"
                  >
                    <span className="mr-2">🛒</span> Find Suppliers
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 flex items-center justify-center"
                  >
                    <span className="mr-2">📦</span> List Your Products
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="w-full max-w-md h-64 bg-gradient-to-br from-orange-200 to-amber-200 rounded-lg shadow-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🤝</div>
                <p className="text-lg font-semibold text-gray-700">Connecting Suppliers & Sellers</p>
                <p className="text-sm text-gray-600 mt-2">Building successful partnerships</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {userType === 'buyer' && (
        <section className="py-16 px-4 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Closest Suppliers Near You <MapPin className="inline-block ml-2 text-blue-600" size={28}/>
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Based on your location, here are the raw material suppliers closest to you.
            </p>
            {loadingClosestSellers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Finding closest suppliers...</p>
              </div>
            ) : errorClosestSellers ? (
              <div className="text-center py-8 text-red-600 font-medium">
                <p>Error: {errorClosestSellers}</p>
                <p>Please ensure your location is set and try again.</p>
              </div>
            ) : closestSellers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {closestSellers.map((sellerItem, index) => (
                  <div
                    key={sellerItem.id || index}
                    className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer border border-gray-100"
                  >
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{sellerItem.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Contact Number: <span className="font-semibold text-orange-600">{sellerItem.phone}</span>
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        Distance: <span className="font-semibold text-orange-600">{sellerItem.distance_km} km</span>
                      </p>
                      <button
                        className="w-full py-2 rounded-md font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-300 mt-4"
                        onClick={() => navigate(`/buyer/s/${sellerItem.id}`)}
                      >
                        View Seller
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600 font-medium">
                <p>No sellers found within your current range.</p>
                <p>Try adjusting your location or search for specific products.</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Why Choose ProjectX?
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Whether you're a food seller looking for quality ingredients or a supplier wanting to expand your reach,
            we provide the tools and connections you need to succeed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:bg-orange-50 transition duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Featured Categories 🥕
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Explore our top categories with quality products from trusted suppliers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer border border-gray-100"
              >
                <div className={`w-full h-48 ${category.color} flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">{category.emoji}</div>
                    <p className="text-xl font-bold">{category.text}</p>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                  <button
                    className="w-full py-2 rounded-md font-semibold text-white bg-orange-500 hover:bg-orange-600 transition duration-300"
                    onClick={() => navigate('/products', { state: { category: category.name, productIDs } })}
                  >
                    View Products
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of food sellers and suppliers who trust ProjectX for their business needs.
            Start your journey today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
            >
              Get Started Today
            </button>
            <button
              onClick={() => navigate('/products')}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-6 text-center">
        <div className="container mx-auto text-sm">
          &copy; {new Date().getFullYear()} ProjectX. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;