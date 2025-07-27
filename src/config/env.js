// Environment Configuration
export const config = {
  // API Configuration
  API_URL: 'http://localhost:5000/api',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'MarketPlace',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Environment Configuration
  IS_DEV: import.meta.env.VITE_DEV_MODE === 'true',
  ENABLE_LOGS: import.meta.env.VITE_ENABLE_LOGS === 'true',
  
  // Feature Flags
  FEATURES: {
    REGISTRATION: true,
    LOGIN: true,
    DASHBOARD: true,
  }
};

// Helper functions
export const isDevelopment = () => config.IS_DEV;
export const isProduction = () => !config.IS_DEV;
export const shouldLog = () => config.ENABLE_LOGS;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    BUYER_LOGIN: `${config.API_URL}/auth/buyer/login`,
    BUYER_REGISTER: `${config.API_URL}/auth/buyer/register`,
    SELLER_LOGIN: `${config.API_URL}/auth/seller/login`,
    SELLER_REGISTER: `${config.API_URL}/auth/seller/register`,
    LOGOUT: `${config.API_URL}/auth/logout`,
    VALIDATE: `${config.API_URL}/auth/validate`,
  }
}; 