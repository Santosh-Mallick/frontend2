import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from '../Register/RegisterForm';
import { ShoppingBag, Store, Sparkles } from 'lucide-react';
import { config } from '../../config/env.js';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (loginData) => {
    console.log('Login successful:', loginData);
  };

  const handleRegister = (registerData) => {
    console.log('Registration successful:', registerData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {config.APP_NAME}
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Welcome back! Please sign in to continue</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 shadow-2xl">
          {isLogin ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign up here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <ShoppingBag className="mx-auto mb-2 text-blue-400" size={24} />
            <h3 className="text-blue-300 font-medium text-sm">Buy Products</h3>
            <p className="text-gray-400 text-xs">Browse and purchase from sellers</p>
          </div>
          <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <Store className="mx-auto mb-2 text-purple-400" size={24} />
            <h3 className="text-purple-300 font-medium text-sm">Sell Products</h3>
            <p className="text-gray-400 text-xs">List and manage your inventory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 