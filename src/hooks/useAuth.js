import { useState, useEffect } from 'react';
import authController from '../controllers/authController';

// Custom hook for authentication state management
export const useAuth = () => {
  const [authState, setAuthState] = useState(authController.getAuthState());

  useEffect(() => {
    // Initialize auth state
    authController.init();

    // Check if stored session is valid
    const checkSession = async () => {
      await authController.checkStoredSession();
    };
    checkSession();

    // Subscribe to auth state changes
    const unsubscribe = authController.addListener((newState) => {
      setAuthState(newState);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const login = async (email, phone, password, userType) => {
    return await authController.login(email, phone, password, userType);
  };

  const register = async (userData, userType) => {
    return await authController.register(userData, userType);
  };

  const logout = async () => {
    return await authController.logout();
  };

  const validateSession = async () => {
    return await authController.validateSession();
  };

  return {
    ...authState,
    login,
    register,
    logout,
    validateSession,
    isBuyer: authController.isBuyer(),
    isSeller: authController.isSeller()
  };
}; 