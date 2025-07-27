import React, { useState, useEffect } from 'react';
import { Wallet, Gift, TrendingUp, History } from 'lucide-react';
import { getCreditWallet } from '../../services/creditWalletService';

const CreditWallet = ({ buyerId, token }) => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const data = await getCreditWallet(buyerId, token);
        setWalletData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (buyerId && token) {
      fetchWalletData();
    }
  }, [buyerId, token]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-600 text-center">
          <p>Error loading credit wallet: {error}</p>
        </div>
      </div>
    );
  }

  if (!walletData) {
    return null;
  }

  const { creditWallet, ecoPoints, pointValue } = walletData;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Credit Wallet</h2>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Available Credit Points</p>
            <p className="text-3xl font-bold">{creditWallet.points}</p>
            <p className="text-sm opacity-90">Worth ₹{creditWallet.points * pointValue}</p>
          </div>
          <Gift className="text-white opacity-80" size={48} />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-600" size={20} />
            <span className="text-sm font-medium text-green-800">Total Earned</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{creditWallet.totalEarned}</p>
          <p className="text-xs text-green-700">points</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <History className="text-orange-600" size={20} />
            <span className="text-sm font-medium text-orange-800">Total Used</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">{creditWallet.totalUsed}</p>
          <p className="text-xs text-orange-700">points</p>
        </div>
      </div>

      {/* Eco Points */}
      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <span className="text-sm font-medium text-emerald-800">Eco Points</span>
        </div>
        <p className="text-lg font-bold text-emerald-900">{ecoPoints}</p>
        <p className="text-xs text-emerald-700">Earned from eco-friendly choices</p>
      </div>

      {/* How to earn */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">How to earn credit points:</h3>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>• Purchase eco-friendly bags (1 point per 100 bags)</li>
          <li>• Refer friends to the platform (+2 points)</li>
          <li>• Make regular purchases (+1 point per ₹100 spent)</li>
        </ul>
      </div>

      {/* Point value info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          1 Credit Point = ₹{pointValue} discount on your next purchase
        </p>
      </div>
    </div>
  );
};

export default CreditWallet; 