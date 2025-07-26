import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from '../Register/RegisterForm';
import { ShoppingBag, Store, Sparkles } from 'lucide-react';
import { config } from '../../config/env.js';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate('/');
    }
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogin = (loginData) => {
    console.log('Login successful:', loginData);
    // Navigation will be handled by the useEffect above
  };

  const handleRegister = (registerData) => {
    console.log('Registration successful:', registerData);
    // Navigation will be handled by the useEffect above
  };

  // Loading screen that matches home page theme
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          {/* Logo/App Name */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg">
                <Sparkles className="text-white" size={32} />
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

          {/* Feature Icons */}
          <div className="mt-12 flex justify-center space-x-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <ShoppingBag className="text-orange-600" size={24} />
              </div>
              <p className="text-xs text-gray-600">Buy Products</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Store className="text-amber-600" size={24} />
              </div>
              <p className="text-xs text-gray-600">Sell Products</p>
            </div>
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              {config.APP_NAME}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {isLogin ? 'Welcome back! Please sign in to continue' : 'Join our marketplace! Create your account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-lg border border-orange-200 rounded-2xl p-8 shadow-2xl">
          {isLogin ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Sign up here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
            <ShoppingBag className="mx-auto mb-2 text-orange-600" size={24} />
            <h3 className="text-orange-700 font-medium text-sm">Buy Products</h3>
            <p className="text-gray-600 text-xs">Browse and purchase from sellers</p>
          </div>
          <div className="text-center p-4 bg-amber-100/50 border border-amber-200 rounded-lg">
            <Store className="mx-auto mb-2 text-amber-600" size={24} />
            <h3 className="text-amber-700 font-medium text-sm">Sell Products</h3>
            <p className="text-gray-600 text-xs">List and manage your inventory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 