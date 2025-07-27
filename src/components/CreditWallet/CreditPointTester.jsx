import React, { useState } from 'react';
import { getCreditWallet, applyCreditPoints } from '../../services/creditWalletService';

const CreditPointTester = ({ userId, token }) => {
  const [testPoints, setTestPoints] = useState(1);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testGetWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCreditWallet(userId, token);
      setWalletData(data);
      setResult(`Wallet loaded: ${data.creditWallet.points} points available`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testApplyPoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applyCreditPoints(userId, testPoints, token);
      setResult(`Applied ${testPoints} points. Discount: ₹${data.discountAmount}. New balance: ${data.creditWallet.points} points`);
      setWalletData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userId || !token) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <strong>Credit Point Tester:</strong> Please login to test credit points
      </div>
    );
  }

  return (
    <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">🧪 Credit Point Tester</h3>
      
      <div className="space-y-3">
        <div>
          <button
            onClick={testGetWallet}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Get Wallet'}
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="1"
            value={testPoints}
            onChange={(e) => setTestPoints(parseInt(e.target.value) || 1)}
            className="px-2 py-1 border rounded w-20"
          />
          <button
            onClick={testApplyPoints}
            disabled={loading}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Applying...' : 'Apply Points'}
          </button>
        </div>

        {walletData && (
          <div className="bg-white p-3 rounded border">
            <h4 className="font-semibold">Wallet Data:</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(walletData, null, 2)}
            </pre>
          </div>
        )}

        {result && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded">
            {result}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditPointTester; 