// Utility functions for accessing stored user information

/**
 * Get stored user information from localStorage
 * @returns {Object|null} User information object or null if not found
 */
export const getStoredUserInfo = () => {
  try {
    const userType = localStorage.getItem('userType');
    
    if (userType === 'buyer') {
      return {
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        phone: localStorage.getItem('userPhone') || '',
        userType: 'buyer'
      };
    } else if (userType === 'seller') {
      return {
        shopName: localStorage.getItem('shopName') || '',
        ownerName: localStorage.getItem('ownerName') || '',
        email: localStorage.getItem('userEmail') || '',
        phone: localStorage.getItem('userPhone') || '',
        userType: 'seller'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting stored user info:', error);
    return null;
  }
};

/**
 * Get user's display name (name for buyer, ownerName for seller)
 * @returns {string} Display name or empty string
 */
export const getUserDisplayName = () => {
  const userInfo = getStoredUserInfo();
  if (!userInfo) return '';
  
  if (userInfo.userType === 'buyer') {
    return userInfo.name;
  } else if (userInfo.userType === 'seller') {
    return userInfo.ownerName || userInfo.shopName;
  }
  
  return '';
};

/**
 * Get user's email
 * @returns {string} Email or empty string
 */
export const getUserEmail = () => {
  const userInfo = getStoredUserInfo();
  return userInfo?.email || '';
};

/**
 * Get user's phone number
 * @returns {string} Phone number or empty string
 */
export const getUserPhone = () => {
  const userInfo = getStoredUserInfo();
  return userInfo?.phone || '';
};

/**
 * Get shop name (for sellers only)
 * @returns {string} Shop name or empty string
 */
export const getShopName = () => {
  const userInfo = getStoredUserInfo();
  return userInfo?.userType === 'seller' ? userInfo.shopName : '';
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  const userInfo = getStoredUserInfo();
  return !!(token && userInfo);
};

/**
 * Get user type
 * @returns {string} 'buyer', 'seller', or empty string
 */
export const getUserType = () => {
  const userInfo = getStoredUserInfo();
  return userInfo?.userType || '';
};

/**
 * Clear all stored user information
 */
export const clearStoredUserInfo = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('shopName');
    localStorage.removeItem('ownerName');
  } catch (error) {
    console.error('Error clearing stored user info:', error);
  }
}; 