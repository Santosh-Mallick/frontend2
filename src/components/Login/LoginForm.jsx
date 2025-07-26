import { useState } from 'react';
import { Eye, EyeOff, User, ShoppingBag, Store } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = ({ onLogin }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    phone: '',
    password: '',
    userType: 'buyer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login(formData.identifier, formData.phone, formData.password, formData.userType);
      
      if (result.success) {
        onLogin(formData);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Type Selection */}
        <div className="space-y-3">
          <label className="text-white text-sm font-medium">Login as:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, userType: 'buyer' }))}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                formData.userType === 'buyer'
                  ? 'border-blue-400 bg-blue-500/20 text-blue-200'
                  : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
              }`}
            >
              <ShoppingBag size={20} />
              <span className="font-medium">Buyer</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, userType: 'seller' }))}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                formData.userType === 'seller'
                  ? 'border-purple-400 bg-purple-500/20 text-purple-200'
                  : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
              }`}
            >
              <Store size={20} />
              <span className="font-medium">Seller</span>
            </button>
          </div>
        </div>

        {/* Email Input (for both buyer and seller) */}
        <div className="space-y-2">
          <label htmlFor="identifier" className="text-white text-sm font-medium">
            Email Address
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Phone Input (for both buyer and seller) */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-white text-sm font-medium">
            Phone Number
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-white text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full pl-4 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </div>
          ) : (
            `Sign in as ${formData.userType}`
          )}
        </button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <a href="#" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
            Forgot your password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 