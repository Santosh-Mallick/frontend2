import { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { config } from '../../config/env.js';

const ServerStatus = () => {
  const [serverStatus, setServerStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);

  const checkServerStatus = async () => {
    try {
      // Try to connect to any endpoint to check if server is running
      const response = await fetch(`${config.API_URL}/auth/buyer/login`, {
        method: 'OPTIONS', // Use OPTIONS to avoid triggering actual login
        mode: 'cors',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      // If we get any response (even 404), server is running
      setServerStatus('online');
    } catch (error) {
      // If we can't connect at all, server is offline
      setServerStatus('offline');
    }
    
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkServerStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'online':
        return 'text-green-400';
      case 'offline':
        return 'text-red-400';
      case 'error':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (serverStatus) {
      case 'online':
        return <Wifi size={16} />;
      case 'offline':
        return <WifiOff size={16} />;
      case 'error':
        return <AlertCircle size={16} />;
      default:
        return <Wifi size={16} />;
    }
  };

  const getStatusText = () => {
    switch (serverStatus) {
      case 'online':
        return 'Server Online';
      case 'offline':
        return 'Server Offline';
      case 'error':
        return 'Server Error';
      default:
        return 'Checking...';
    }
  };

  if (serverStatus === 'online') {
    return null; // Don't show when server is online
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-2 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        <button
          onClick={checkServerStatus}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Retry
        </button>
      </div>
      {serverStatus === 'offline' && (
        <div className="mt-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-300 text-xs">
            Backend server is not running. Please start your backend server on https://backend-sand-three-70.vercel.app
          </p>
        </div>
      )}
    </div>
  );
};

export default ServerStatus; 