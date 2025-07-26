import { useState } from 'react';
import { Eye, EyeOff, User, ShoppingBag, Store, Phone, Mail, MapPin, Building } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const RegisterForm = ({ onRegister, onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    userType: 'buyer',
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: {
      line: '',
      locality: '',
      city: '',
      pincode: '',
      state: ''
    },
    // Seller specific fields
    ownerName: '',
    products: [],
    fssaiNumber: '',
    shopPhoto: '',
    bannerImage: '',
    paymentInfo: {
      upiId: '',
      bankAccountNumber: '',
      ifscCode: '',
      accountHolderName: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data based on user type
      const userData = {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
        location: {
          type: "Point",
          coordinates: [0, 0] // Default coordinates - should be updated with actual location
        }
      };

      if (formData.userType === 'buyer') {
        userData.email = formData.email;
      } else {
        // Seller specific fields
        userData.email = formData.email;
        userData.ownerName = formData.ownerName;
        userData.products = formData.products;
        userData.fssaiNumber = formData.fssaiNumber;
        userData.shopPhoto = formData.shopPhoto;
        userData.bannerImage = formData.bannerImage;
        userData.paymentInfo = formData.paymentInfo;
      }

      const result = await register(userData, formData.userType);
      
      if (result.success) {
        onRegister(formData);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
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
          <label className="text-white text-sm font-medium">Register as:</label>
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

        {/* Name Input */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-white text-sm font-medium">
            {formData.userType === 'buyer' ? 'Full Name' : 'Shop/Stall Name'}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder={formData.userType === 'buyer' ? 'Enter your full name' : 'Enter shop/stall name'}
            />
          </div>
        </div>

        {/* Owner Name (Seller only) */}
        {formData.userType === 'seller' && (
          <div className="space-y-2">
            <label htmlFor="ownerName" className="text-white text-sm font-medium">
              Owner Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter owner name"
              />
            </div>
          </div>
        )}

        {/* Phone Input */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-white text-sm font-medium">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-white text-sm font-medium">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
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

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-white text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full pl-4 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Confirm your password"
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
              Creating account...
            </div>
          ) : (
            `Register as ${formData.userType}`
          )}
        </button>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm; 