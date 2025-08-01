import { useState } from 'react';
import { Eye, EyeOff, User, ShoppingBag, Store, Phone, Mail, MapPin, Building, X, Edit, Globe } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LocationPicker } from '../Other/LocationPicker';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onRegister, onSwitchToLogin }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: 'buyer',
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: {
      line: '', // Added for string address
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
    location: { lat: 0, lng: 0 },
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
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [manualLocationInput, setManualLocationInput] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: (parent === 'location' && (child === 'lat' || child === 'lng'))
            ? (value === '' ? '' : parseFloat(value) || 0)
            : value
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

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      location,
    }));
    setIsLocationPickerOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    // Debug logging
    console.log('Registration - User Type:', formData.userType);
    console.log('Registration - Form Data:', formData);
    console.log('Registration - Current userType before submission:', formData.userType);

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

    // Validate seller-specific fields
    if (formData.userType === 'seller') {
      if (!formData.ownerName || formData.ownerName.trim() === '') {
        setError('Owner name is required for sellers');
        setIsLoading(false);
        return;
      }
      if (!formData.fssaiNumber || formData.fssaiNumber.trim() === '') {
        setError('FSSAI number is required for sellers');
        setIsLoading(false);
        return;
      }
      if (formData.location.lat === 0 && formData.location.lng === 0) {
        setError('Shop location is required for sellers. Please select on map or enter manually.');
        setIsLoading(false);
        return;
      }
    }

    try {
      // Prepare data based on user type
      const userData = {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        address: formData.address, // Now includes the 'line' property
        location: {
          type: "Point",
          coordinates: [formData.location.lng, formData.location.lat]
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

      console.log('Registration - Final User Data:', userData);
      console.log('Registration - User Type being sent:', formData.userType);

      const result = await register(userData, formData.userType);

      console.log('Registration - Result:', result);

      if (result.success) {
        const message = formData.userType === 'buyer'
          ? `Welcome, ${formData.name}! Your account has been created successfully.`
          : `Welcome, ${formData.ownerName}! Your store has been created successfully.`;

        setSuccessMessage(message);

        setTimeout(() => {
          console.log('Registration - Navigating to:', formData.userType === 'seller' ? '/seller/dashboard' : '/');
          if (formData.userType === 'seller') {
            navigate('/seller/dashboard');
          } else {
            navigate('/');
          }
        }, 1500);

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
          <label className="text-gray-700 text-sm font-medium">Register as:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, userType: 'buyer' }))}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${formData.userType === 'buyer'
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
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${formData.userType === 'seller'
                  ? 'border-amber-400 bg-amber-500/20 text-amber-700'
                  : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-amber-300'
                }`}
            >
              <Store size={20} />
              <span className="font-medium">Seller</span>
            </button>
          </div>
          <div className="text-center">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              formData.userType === 'buyer'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-amber-100 text-amber-700'
              }`}>
              Currently selected: {formData.userType === 'buyer' ? 'Buyer' : 'Seller'}
            </span>
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-gray-700 text-sm font-medium">
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder={formData.userType === 'buyer' ? 'Enter your full name' : 'Enter shop/stall name'}
            />
          </div>
        </div>

        {/* Owner Name (Seller only) */}
        {formData.userType === 'seller' && (
          <div className="space-y-2">
            <label htmlFor="ownerName" className="text-gray-700 text-sm font-medium">
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
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Enter owner name"
              />
            </div>

            {/* Location Input Method Toggle */}
            <div className="flex items-center justify-between mt-4">
              <label className="block text-sm font-medium text-gray-700">Location Of Shop *</label>
              <button
                type="button"
                onClick={() => setManualLocationInput(!manualLocationInput)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {manualLocationInput ? (
                  <>
                    <MapPin size={16} /> Select on Map
                  </>
                ) : (
                  <>
                    <Edit size={16} /> Enter Manually
                  </>
                )}
              </button>
            </div>

            {/* Conditional Location Input */}
            {manualLocationInput ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="lat" className="text-gray-700 text-xs font-medium">Latitude</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      id="lat"
                      name="location.lat"
                      value={formData.location.lat === 0 && formData.location.lat !== '' ? '' : formData.location.lat}
                      onChange={handleInputChange}
                      required
                      step="any"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="e.g., 22.8046"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="lng" className="text-gray-700 text-xs font-medium">Longitude</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      id="lng"
                      name="location.lng"
                      value={formData.location.lng === 0 && formData.location.lng !== '' ? '' : formData.location.lng}
                      onChange={handleInputChange}
                      required
                      step="any"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="e.g., 86.2029"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setIsLocationPickerOpen(true)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left text-gray-600 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  {formData.location.lat === 0 && formData.location.lng === 0
                    ? "Select Location on Map"
                    : `Lat: ${formData.location.lat.toFixed(4)}, Lng: ${formData.location.lng.toFixed(4)}`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Location Picker Modal */}
        {isLocationPickerOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Select Location
                  </h2>
                  <button
                    onClick={() => setIsLocationPickerOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close location picker"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <LocationPicker onLocationSelect={handleLocationSelect} />
              </div>
            </div>
          </div>
        )}

        {/* Address Line Input (New) */}
        <div className="space-y-2">
          <label htmlFor="addressLine" className="text-gray-700 text-sm font-medium">
            Address Line
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              id="addressLine"
              name="address.line" // Set name for nested property
              value={formData.address.line}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="Enter your street address, house number, etc."
            />
          </div>
        </div>

        {/* FSSAI Number (Seller only) */}
        {formData.userType === 'seller' && (
          <div className="space-y-2">
            <label htmlFor="fssaiNumber" className="text-gray-700 text-sm font-medium">
              FSSAI Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                id="fssaiNumber"
                name="fssaiNumber"
                value={formData.fssaiNumber}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Enter FSSAI license number"
              />
            </div>
            <p className="text-xs text-gray-500">FSSAI license number is required for food businesses</p>
          </div>
        )}

        {/* Phone Input */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-gray-700 text-sm font-medium">
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-gray-700 text-sm font-medium">
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="Enter your email"
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

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-gray-700 text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{successMessage}</p>
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
              Creating account...
            </div>
          ) : (
            `Register as ${formData.userType === 'buyer' ? 'Buyer' : 'Seller'}`
          )}
        </button>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
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