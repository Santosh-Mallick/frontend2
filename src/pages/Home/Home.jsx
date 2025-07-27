import { ShoppingCart, User, LogOut, Store, ShoppingBag, TrendingUp, Users, Shield, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LocationManager from '../../components/LocationManager'; // Assuming this component saves location to local storage

const Home = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, userType, logout, getUserInfo } = useAuth();
  const userInfo = getUserInfo();

  // New states for closest sellers data
  const [closestSellers, setClosestSellers] = useState([]);
  const [loadingClosestSellers, setLoadingClosestSellers] = useState(true);
  const [errorClosestSellers, setErrorClosestSellers] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Mock supplier data (for Featured Suppliers section)
  const featuredSuppliers = [
    {
      id: 1,
      name: "Fresh Harvest Co.",
      categories: ['Vegetables', 'Fruits', 'Organic'],
      rating: 4.8,
      isOpen: true,
      color: 'bg-green-500',
      text: 'Fresh Produce',
      description: 'Premium quality vegetables and fruits'
    },
    {
      id: 2,
      name: "Spice & Grain Hub",
      categories: ['Spices', 'Grains', 'Pulses'],
      rating: 4.5,
      isOpen: true,
      color: 'bg-orange-500',
      text: 'Spices & Grains',
      description: 'Authentic spices and quality grains'
    },
    {
      id: 3,
      name: "Dairy Delights",
      categories: ['Milk', 'Cheese', 'Butter'],
      rating: 4.9,
      isOpen: true,
      color: 'bg-blue-500',
      text: 'Dairy Products',
      description: 'Fresh dairy products daily'
    },
    {
      id: 4,
      name: "Premium Meats",
      categories: ['Chicken', 'Mutton', 'Fish'],
      rating: 4.2,
      isOpen: true,
      color: 'bg-red-500',
      text: 'Fresh Meats',
      description: 'Quality meat and poultry'
    },
    {
      id: 5,
      name: "Eco Packaging",
      categories: ['Eco-friendly Bags', 'Containers'],
      rating: 4.6,
      isOpen: true,
      color: 'bg-cyan-500',
      text: 'Packaging',
      description: 'Sustainable packaging solutions'
    },
    {
      id: 6,
      name: "Bakery Essentials",
      categories: ['Flour', 'Breads', 'Baking Items'],
      rating: 4.7,
      isOpen: true,
      color: 'bg-amber-500',
      text: 'Bakery Items',
      description: 'Fresh bakery ingredients'
    },
  ];

  // Features for both buyers and sellers
  const features = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Quality Products",
      description: "Source fresh, high-quality ingredients from verified suppliers"
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: "Easy Management",
      description: "Manage your inventory and orders efficiently"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Opportunities",
      description: "Expand your business with reliable supply chain"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trusted Partners",
      description: "Connect with verified and trusted suppliers"
    }
  ];

  // Fetch the closest suppliers
  const fetchClosestSuppliers = async (lat, lng, productName = '', maxDistanceKm = 35) => {
    setLoadingClosestSellers(true);
    setErrorClosestSellers(null);
    try {
      const payload = {
        buyerLat: lat,
        buyerLon: lng,
        productName: productName,
        MAX_DISTANCE_KM: maxDistanceKm
      };

      const res = await fetch('http://localhost:5000/api/buyer/find-closest-sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}` // Assuming currentUser is in scope
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch closest suppliers');
      }

      const data = await res.json();
      console.log('Closest suppliers data:', data);
      return data; // Return the parsed JSON data

    } catch (error) {
      console.error('Network or other error:', error);
      setErrorClosestSellers(error.message || 'Failed to load suppliers.');
      return null;
    } finally {
      setLoadingClosestSellers(false);
    }
  };

  useEffect(() => {
    // Fetch closest suppliers when the component mounts or user location changes
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        // Changed here ------------->
        // const parsedLocation = JSON.parse(storedLocation);
        // const { lat, lng } = parsedLocation;
        // const {22.740227, 86.200408} = parsed
        const lat = 22.740227; // Replace with actual latitude from parsedLocation
        const lng = 86.200408; // Replace with actual longitude from parsedLocation

        if (lat && lng) {
          fetchClosestSuppliers(lat, lng)
            .then(data => {
              if (data && data.allSellersWithinRange) {
                setClosestSellers(data.allSellersWithinRange);
                console.log("Closest suppliers found:", data.allSellersWithinRange);
              } else if (data && data.closestSeller && data.allSellersBeyondRange) {
                // If no sellers within range but some beyond, you might want to show them
                // Or inform the user. For simplicity, we'll just log here.
                console.log("No sellers within range, but some beyond:", data.allSellersBeyondRange);
              } else {
                 setClosestSellers([]); // No sellers found at all
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
        setLoadingClosestSellers(false); // No stored location, so stop loading
        setErrorClosestSellers("No user location found. Please set your location to find nearby suppliers.");
    }
  }, [currentUser?.token]); // Re-fetch if currentUser token changes

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
            {
              userType === 'buyer' && (
                <button className="text-gray-600 hover:text-orange-500 focus:outline-none cursor-pointer"
                  onClick={() => navigate("/buyer/cart")}>
                  <ShoppingCart />
                </button>
              )
            }

            {/* Profile Avatar with Dropdown */}
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

      {/* Renders LocationManager to update userLocation in localStorage */}
      <LocationManager />

      {/* --- Hero Section --- */}
      <section className="bg-gradient-to-r from-orange-100 to-amber-100 py-16 px-4 md:py-24">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Column: Text Content */}
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

          {/* Right Column: Illustration/Image */}
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

      {/* --- Closest Suppliers Near You Section (NEW) --- */}
      {userType === 'buyer' && ( // Only show for buyers
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
                    key={sellerItem.id || index} // Use seller's actual _id if available, or index as fallback
                    className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer border border-gray-100"
                  >
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{sellerItem.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Contact Number : <span className="font-semibold text-orange-600">{sellerItem.phone}</span>
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        Distance: <span className="font-semibold text-orange-600">{sellerItem.distance_km} km</span>
                      </p>
                      {/* {sellerItem.products && sellerItem.products.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-gray-700 text-sm font-medium">Products:</span>
                          {sellerItem.products.map((product, pIndex) => (
                            <span
                              key={pIndex}
                              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      )} */}
                      <button
                        className="w-full py-2 rounded-md font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-300 mt-4"
                        onClick={() => navigate(`/buyer/s/${sellerItem.id}`)} // Link to seller's detailed page
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


      {/* --- Features Section --- */}
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

      {/* --- Top Suppliers Section (renamed to Featured Suppliers to avoid confusion with dynamic data) --- */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Featured Suppliers 🥕
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Connect with trusted suppliers offering quality ingredients and reliable service
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer border border-gray-100"
              >
                {/* Replace image with colored div */}
                <div className={`w-full h-48 ${supplier.color} flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">
                      {supplier.text === 'Fresh Produce' && '🥕'}
                      {supplier.text === 'Spices & Grains' && '🌶️'}
                      {supplier.text === 'Dairy Products' && '🥛'}
                      {supplier.text === 'Fresh Meats' && '🍖'}
                      {supplier.text === 'Packaging' && '📦'}
                      {supplier.text === 'Bakery Items' && '🥖'}
                    </div>
                    <p className="text-xl font-bold">{supplier.text}</p>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{supplier.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{supplier.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {supplier.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <button
                    className="w-full py-2 rounded-md font-semibold text-white bg-orange-500 hover:bg-orange-600 transition duration-300"
                    onClick={() => navigate('/products')}
                  >
                    View Products
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Call to Action Section --- */}
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