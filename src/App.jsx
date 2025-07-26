import { useState, useEffect } from 'react';
import LoginPage from './components/Login/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import ServerStatus from './components/ServerStatus/ServerStatus';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { isAuthenticated, currentUser, userType } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    if (isAuthenticated && currentUser) {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
    setIsLoading(false);
  }, [isAuthenticated, currentUser]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <>
        <ServerStatus />
        <LoginPage />
      </>
    );
  }

  return (
    <>
      <ServerStatus />
      <Dashboard />
    </>
  );
};

export default App;