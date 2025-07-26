import { useState, useEffect } from 'react';
import { getStoredUserInfo, getUserDisplayName, getUserEmail, getShopName } from '../utils/userStorage';

const UserInfoDisplay = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Get user info when component mounts
    const info = getStoredUserInfo();
    setUserInfo(info);
  }, []);

  if (!userInfo) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No user information found. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-xl">
      <h3 className="text-xl font-semibold text-white mb-4">Stored User Information</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">User Type:</span>
          <span className="text-blue-400 font-medium capitalize">{userInfo.userType}</span>
        </div>
        
        {userInfo.userType === 'buyer' ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Name:</span>
              <span className="text-white font-medium">{userInfo.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Email:</span>
              <span className="text-white font-medium">{userInfo.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Phone:</span>
              <span className="text-white font-medium">{userInfo.phone}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Shop Name:</span>
              <span className="text-white font-medium">{userInfo.shopName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Owner Name:</span>
              <span className="text-white font-medium">{userInfo.ownerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Email:</span>
              <span className="text-white font-medium">{userInfo.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Phone:</span>
              <span className="text-white font-medium">{userInfo.phone}</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <h4 className="text-lg font-medium text-white mb-2">Utility Functions Example:</h4>
        <div className="space-y-2 text-sm">
          <p className="text-gray-300">
            <span className="text-gray-400">Display Name:</span> {getUserDisplayName()}
          </p>
          <p className="text-gray-300">
            <span className="text-gray-400">Email:</span> {getUserEmail()}
          </p>
          {userInfo.userType === 'seller' && (
            <p className="text-gray-300">
              <span className="text-gray-400">Shop Name:</span> {getShopName()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoDisplay; 