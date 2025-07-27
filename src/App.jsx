import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import ServerStatus from './components/ServerStatus/ServerStatus';
import Home from './pages/Home/Home';
import ProductList from './pages/Home/Items';
import SellerDashboard from './pages/Seller/SellerDashboard';
import { useAuth } from './hooks/useAuth';
import { config } from './config/env.js';
import AddProductPage from './pages/Seller/AddProduct.jsx';
import ShoppingCartPage from './pages/Home/Cart.jsx';

// Protected Route Component
const ProtectedRoute = ({ children, userType = null }) => {
  const { isAuthenticated, currentUser, userType: authUserType } = useAuth();

  console.log('ProtectedRoute - Checking access:');
  console.log('ProtectedRoute - Required userType:', userType);
  console.log('ProtectedRoute - Auth userType:', authUserType);
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - currentUser:', currentUser);

  if (!isAuthenticated || !currentUser) {
    console.log('ProtectedRoute - Redirecting to login (not authenticated)');
    return <Navigate to="/login" replace />;
  }

  if (userType && authUserType !== userType) {
    console.log('ProtectedRoute - Redirecting to home (wrong user type)');
    console.log('ProtectedRoute - Expected:', userType, 'Got:', authUserType);
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute - Access granted');
  return children;
};

// Public Route Component (redirects to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (isAuthenticated && currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout Component for authenticated pages
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {children}
    </div>
  );
};

const App = () => {
  const { isAuthenticated, currentUser, userType } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      try {
        // The useAuth hook will handle the authentication check
        // We just need to wait for it to complete
        setTimeout(() => {
          setIsLoading(false);
        }, 1000); // Give time for auth check to complete
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, currentUser]);

  // Display a loading indicator while the authentication status is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          {/* Logo/App Name */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {config.APP_NAME}
              </h1>
            </div>
            <p className="text-lg text-gray-600">Connecting suppliers and sellers</p>
          </div>

          {/* Loading Animation */}
          <div className="mb-8">
            <div className="relative">
              {/* Main loading spinner */}
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>

              {/* Floating elements around the spinner */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="w-3 h-3 bg-orange-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <p className="text-orange-600 font-semibold text-lg">Loading your marketplace...</p>
            <p className="text-gray-500 text-sm">Preparing your connection experience</p>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 max-w-xs mx-auto">
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ServerStatus />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Home page - accessible to everyone */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <AuthenticatedLayout>
                  <Home />
                </AuthenticatedLayout>
              ) : (
                <Home />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ProductList />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          {/* Buyer-specific routes */}
          <Route
            path="/buyer/*"
            element={
              <ProtectedRoute userType="buyer">
                <AuthenticatedLayout>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-white mb-4">Buyer Dashboard</h1>
                    <p className="text-gray-300">Buyer-specific features coming soon...</p>
                  </div>
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/cart"
            element={
              <ProtectedRoute userType="buyer">
                <AuthenticatedLayout>
                  <ShoppingCartPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          {/* Seller-specific routes */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute userType="seller">
                <AuthenticatedLayout>
                  <SellerDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/store"
            element={
              <ProtectedRoute userType="seller">
                <AuthenticatedLayout>
                  <SellerDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/products/add"
            element={
              <ProtectedRoute userType="seller">
                <AuthenticatedLayout>
                  <AddProductPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/*"
            element={
              <ProtectedRoute userType="seller">
                <AuthenticatedLayout>
                  <SellerDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
