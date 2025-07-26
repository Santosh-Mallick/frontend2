import { config, shouldLog, API_ENDPOINTS } from '../config/env.js';

// Authentication Service - Handles all authentication-related API calls
class AuthService {
  constructor() {
    this.baseURL = config.API_URL;
    this.appName = config.APP_NAME;
    this.appVersion = config.APP_VERSION;
    this.isDevMode = config.IS_DEV;
    this.enableLogs = config.ENABLE_LOGS;
  }

  // Login user with email, phone, password, and user type
  async login(email, phone, password, userType) {
    try {
      const endpoint = userType === 'buyer' 
        ? API_ENDPOINTS.AUTH.BUYER_LOGIN
        : API_ENDPOINTS.AUTH.SELLER_LOGIN;

      const requestBody = {
        email,
        phone,
        password
      };

      if (this.enableLogs) {
        console.log('Sending request to:', endpoint);
        console.log('Request body:', requestBody);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (this.enableLogs) {
          console.log('Error response from backend:', errorData);
        }
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data in localStorage
      try {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store specific user information for easy access
        this.storeUserInfo(data.user, userType);
      } catch (error) {
        if (this.enableLogs) {
          console.error('Error storing data in localStorage:', error);
        }
      }

      return {
        success: true,
        token: data.token,
        user: data.user
      };
    } catch (error) {
      if (this.enableLogs) {
        console.error('Login error:', error);
      }
      return {
        success: false,
        message: error.message || 'Login failed. Please check your credentials.'
      };
    }
  }

  // Register user
  async register(userData, userType) {
    try {
      const endpoint = userType === 'buyer' 
        ? API_ENDPOINTS.AUTH.BUYER_REGISTER
        : API_ENDPOINTS.AUTH.SELLER_REGISTER;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Store token and user data in localStorage
      try {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store specific user information for easy access
        this.storeUserInfo(data.user, userType);
      } catch (error) {
        if (this.enableLogs) {
          console.error('Error storing data in localStorage:', error);
        }
      }

      return {
        success: true,
        token: data.token,
        user: data.user
      };
    } catch (error) {
      if (this.enableLogs) {
        console.error('Registration error:', error);
      }
      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.'
      };
    }
  }

  // Store specific user information in localStorage
  storeUserInfo(user, userType) {
    try {
      if (userType === 'buyer') {
        // Store buyer information
        localStorage.setItem('userName', user.name || '');
        localStorage.setItem('userEmail', user.email || '');
        localStorage.setItem('userPhone', user.phone || '');
        
        if (this.enableLogs) {
          console.log('Stored buyer info:', {
            name: user.name,
            email: user.email,
            phone: user.phone
          });
        }
      } else if (userType === 'seller') {
        // Store seller information
        localStorage.setItem('shopName', user.name || ''); // Shop/Stall name
        localStorage.setItem('ownerName', user.ownerName || '');
        localStorage.setItem('userEmail', user.email || '');
        localStorage.setItem('userPhone', user.phone || '');
        
        if (this.enableLogs) {
          console.log('Stored seller info:', {
            shopName: user.name,
            ownerName: user.ownerName,
            email: user.email,
            phone: user.phone
          });
        }
      }
    } catch (error) {
      if (this.enableLogs) {
        console.error('Error storing user info:', error);
      }
    }
  }

  // Get stored user information
  getUserInfo() {
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
      if (this.enableLogs) {
        console.error('Error getting user info:', error);
      }
      return null;
    }
  }

  // Logout user
  async logout() {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('user');
      
      // Clear specific user information
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('shopName');
      localStorage.removeItem('ownerName');
      
      // Optional: Call logout endpoint
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      if (this.enableLogs) {
        console.error('Logout error:', error);
      }
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    try {
      const token = localStorage.getItem('token');
      return !!token;
    } catch (error) {
      if (this.enableLogs) {
        console.error('Error checking authentication:', error);
      }
      return false;
    }
  }

  // Get current user
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      if (this.enableLogs) {
        console.error('Error parsing user from localStorage:', error);
      }
      // Clear invalid data
      localStorage.removeItem('user');
      return null;
    }
  }

  // Get user type
  getUserType() {
    try {
      return localStorage.getItem('userType');
    } catch (error) {
      if (this.enableLogs) {
        console.error('Error getting user type:', error);
      }
      return null;
    }
  }

  // Get token
  getToken() {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      if (this.enableLogs) {
        console.error('Error getting token:', error);
      }
      return null;
    }
  }

  // Validate token (optional - for token expiration)
  async validateToken() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      // For now, just check if token exists and has a valid format
      // You can implement actual token validation when you add the endpoint to your backend
      if (token && token.length > 10) {
        return true; // Assume token is valid if it exists and has reasonable length
      }
      
      return false;
    } catch (error) {
      if (this.enableLogs) {
        console.error('Token validation error:', error);
      }
      return false;
    }
  }
}

export default new AuthService(); 