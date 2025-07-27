import React from 'react';

const CreditHistory = ({ creditWallet }) => {
  if (!creditWallet) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">💳 Credit Point History</h3>
      
      <div className="space-y-3">
        {/* Current Balance */}
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-900">Current Balance</span>
          <span className="text-lg font-bold text-blue-600">{creditWallet.points} points</span>
        </div>

        {/* Total Earned */}
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-green-900">Total Earned</span>
          <span className="text-lg font-bold text-green-600">{creditWallet.totalEarned} points</span>
        </div>

        {/* Total Used */}
        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
          <span className="text-sm font-medium text-orange-900">Total Used</span>
          <span className="text-lg font-bold text-orange-600">{creditWallet.totalUsed} points</span>
        </div>

        {/* Point Value */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Point Value</p>
          <p className="text-lg font-bold text-gray-800">1 Point = ₹10</p>
        </div>

        {/* How to Earn */}
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-semibold text-yellow-900 mb-2">🌱 How to Earn Points</h4>
          <ul className="text-xs text-yellow-800 space-y-1">
            <li>• Buy eco-friendly products</li>
            <li>• Earn 1 point per 100 eco-friendly items</li>
            <li>• Points are awarded automatically on order completion</li>
          </ul>
        </div>

        {/* How to Use */}
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">💸 How to Use Points</h4>
          <ul className="text-xs text-purple-800 space-y-1">
            <li>• Apply points at checkout</li>
            <li>• 1 point = ₹10 discount</li>
            <li>• Can't use more points than your order total</li>
            <li>• Points are deducted when order is placed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreditHistory; 