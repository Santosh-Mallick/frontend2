import { useState, useEffect } from 'react';
import authController from '../controllers/authController';

// Custom hook for authentication state management
export const useAuth = () => {
  const [authState, setAuthState] = useState(authController.getAuthState());

  useEffect(() => {
    console.log('useAuth - Initializing auth state');
    
    // Initialize auth state
    authController.init();

    // Check if stored session is valid
    const checkSession = async () => {
      console.log('useAuth - Checking stored session');
      await authController.checkStoredSession();
    };
    checkSession();

    // Subscribe to auth state changes
    const unsubscribe = authController.addListener((newState) => {
      console.log('useAuth - Auth state changed:', newState);
      setAuthState(newState);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const login = async (email, phone, password, userType) => {
    console.log('useAuth - Login called with userType:', userType);
    return await authController.login(email, phone, password, userType);
  };

  const register = async (userData, userType) => {
    console.log('useAuth - Register called with userType:', userType);
    return await authController.register(userData, userType);
  };

  const logout = async () => {
    return await authController.logout();
  };

  const validateSession = async () => {
    return await authController.validateSession();
  };

  const getUserInfo = () => {
    return authController.getUserInfo();
  };

  console.log('useAuth - Current auth state:', authState);
  console.log('useAuth - isBuyer:', authController.isBuyer());
  console.log('useAuth - isSeller:', authController.isSeller());

  return {
    ...authState,
    login,
    register,
    logout,
    validateSession,
    getUserInfo,
    isBuyer: authController.isBuyer(),
    isSeller: authController.isSeller()
  };
}; 