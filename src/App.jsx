import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router components
import LoginPage from './components/Login/LoginPage';
// import Dashboard from './components/Dashboard/Dashboard';
import ServerStatus from './components/ServerStatus/ServerStatus';
import Home from './pages/Home/Home'; // Import the Home component
import ProductList from './pages/Home/Items'; // Import the ProductList component
import { useAuth } from './hooks/useAuth';

const App = () => {
  // const { isAuthenticated, currentUser, userType } = useAuth();
  // const [showLogin, setShowLogin] = useState(true);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Check if user is authenticated on app load
  //   // If isAuthenticated and currentUser are true, hide login and show main content
  //   if (isAuthenticated && currentUser) {
  //     setShowLogin(false);
  //   } else {
  //     setShowLogin(true); // Otherwise, show the login page
  //   }
  //   setIsLoading(false); // Authentication check is complete
  // }, [isAuthenticated, currentUser]); // Re-run effect when authentication status changes

  // // Display a loading indicator while the authentication status is being determined
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
  //       <div className="text-center text-white">
  //         <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p>Loading application...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // // If the user is not authenticated, display the login page
  // if (showLogin) {
  //   return (
  //     <>
  //       <ServerStatus /> {/* ServerStatus is always visible */}
  //       <LoginPage />
  //     </>
  //   );
  // }

  return (
    <>
      <ServerStatus /> 
      <Router>
        <Routes>
          {/* Route for the Home page, accessible at the root path for authenticated users */}
          <Route path="/" element={<Home />} />

          {/* Route for the Product List page */}
          <Route path="/products" element={<ProductList />} />

          {/* <Route path="/dashboard" element={<Dashboard />} /> */}

          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
