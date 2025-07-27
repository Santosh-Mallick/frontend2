import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, ShoppingBag, Store } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = ({ onLogin }) => {
  const { login, getUserInfo } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    phone: '',
    password: '',
    userType: 'buyer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const result = await login(formData.identifier, formData.phone, formData.password, formData.userType);
      
      if (result.success) {
        // Show success message with stored information
        const userInfo = getUserInfo();
        if (userInfo) {
          const message = formData.userType === 'buyer' 
            ? `Welcome back, ${userInfo.name}! Your information has been stored.`
            : `Welcome back, ${userInfo.ownerName}! Your shop information has been stored.`;
          
          setSuccessMessage(message);
          
          // Navigate based on user type
          setTimeout(() => {
            if (formData.userType === 'seller') {
              navigate('/seller/dashboard');
            } else {
              navigate('/');
            }
          }, 1500);
        }
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
          <label className="text-gray-700 text-sm font-medium">Login as:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, userType: 'buyer' }))}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                formData.userType === 'buyer'
                  ? 'border-orange-400 bg-orange-500/20 text-orange-700'
                  : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-orange-300'
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
                  ? 'border-amber-400 bg-amber-500/20 text-amber-700'
                  : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-amber-300'
              }`}
            >
              <Store size={20} />
              <span className="font-medium">Seller</span>
            </button>
          </div>
        </div>

        {/* Email Input (for both buyer and seller) */}
        <div className="space-y-2">
          <label htmlFor="identifier" className="text-gray-700 text-sm font-medium">
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Phone Input (for both buyer and seller) */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-gray-700 text-sm font-medium">
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-gray-700 text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          <a href="#" className="text-orange-600 hover:text-orange-700 text-sm transition-colors">
            Forgot your password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 