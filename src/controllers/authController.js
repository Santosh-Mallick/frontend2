import authService from '../services/authService';

// Authentication Controller - Handles authentication logic and state management
class AuthController {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.userType = null;
    this.listeners = [];
  }

  // Initialize authentication state
  init() {
    // console.log('AuthController - Initializing auth state');
    
    this.isAuthenticated = authService.isAuthenticated();
    this.currentUser = authService.getCurrentUser();
    this.userType = authService.getUserType();
    
    // console.log('AuthController - Init - isAuthenticated:', this.isAuthenticated);
    // console.log('AuthController - Init - currentUser:', this.currentUser);
    // console.log('AuthController - Init - userType from localStorage:', this.userType);
    
    // Only set as authenticated if we have both token and user data
    if (this.isAuthenticated && !this.currentUser) {
      this.isAuthenticated = false;
      // Clear invalid data
      authService.logout();
    }
    
    // console.log('AuthController - Init - Final userType:', this.userType);
    this.notifyListeners();
  }

  // Login user
  async login(email, phone, password, userType) {
    try {
      const result = await authService.login(email, phone, password, userType);
      
      if (result.success) {
        this.isAuthenticated = true;
        this.currentUser = result.user;
        this.userType = userType;
        this.notifyListeners();
        
        return {
          success: true,
          message: `Successfully logged in as ${userType}`,
          user: result.user
        };
      } else {
        return {
          success: false,
          message: result.message || 'Login failed. Please check your credentials.'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login. Please try again.'
      };
    }
  }

  // Register user
  async register(userData, userType) {
    try {
      // console.log('AuthController - Register called with userType:', userType);
      // console.log('AuthController - UserData:', userData);
      
      const result = await authService.register(userData, userType);
      
      // console.log('AuthController - AuthService result:', result);
      
      if (result.success) {
        this.isAuthenticated = true;
        this.currentUser = result.user;
        this.userType = userType;
        
        // console.log('AuthController - Setting userType to:', userType);
        // console.log('AuthController - Current userType after setting:', this.userType);
        
        this.notifyListeners();
        
        return {
          success: true,
          message: `Successfully registered as ${userType}`,
          user: result.user
        };
      } else {
        return {
          success: false,
          message: result.message || 'Registration failed. Please try again.'
        };
      }
    } catch (error) {
      // console.error('Registration error:', error);
      return {
        success: false,
        message: 'An error occurred during registration. Please try again.'
      };
    }
  }

  // Logout user
  async logout() {
    try {
      await authService.logout();
      this.isAuthenticated = false;
      this.currentUser = null;
      this.userType = null;
      this.notifyListeners();
      
      return {
        success: true,
        message: 'Successfully logged out'
      };
    } catch (error) {
      // console.error('Logout error:', error);
      return {
        success: false,
        message: 'An error occurred during logout.'
      };
    }
  }

  // Get authentication state
  getAuthState() {
    return {
      isAuthenticated: this.isAuthenticated,
      currentUser: this.currentUser,
      userType: this.userType
    };
  }

  // Check if user is a buyer
  isBuyer() {
    return this.userType === 'buyer';
  }

  // Check if user is a seller
  isSeller() {
    return this.userType === 'seller';
  }

  // Get user type
  getUserType() {
    return this.userType;
  }

  // Get stored user information
  getUserInfo() {
    return authService.getUserInfo();
  }

  // Add listener for auth state changes
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners of state changes
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback(this.getAuthState());
    });
  }

  // Validate current session
  async validateSession() {
    try {
      const token = authService.getToken();
      // Simple local validation
      if (token && token.length > 10) {
        return true; // Assume valid
      }
      return false; // Invalid or missing
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  // Check if stored session is valid
  async checkStoredSession() {
    if (this.isAuthenticated && this.currentUser) {
      try {
        const isValid = await this.validateSession();
        if (!isValid) {
          this.isAuthenticated = false;
          this.currentUser = null;
          this.userType = null;
          this.notifyListeners();
        }
        return isValid;
      } catch (error) {
        // If validation fails, keep the session for now
        // This prevents clearing valid sessions when backend validation endpoint is not available
        console.log('Session validation failed, keeping current session:', error.message);
        return true; // Keep the session
      }
    }
    return false;
  }
}

export default new AuthController(); 