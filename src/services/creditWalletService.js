import { API_BASE_URL } from '../config/api';

// Get buyer's credit wallet information
export const getCreditWallet = async (buyerId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/buyer/credit-wallet/${buyerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch credit wallet');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching credit wallet:', error);
    throw error;
  }
};

// Apply credit points to payment
export const applyCreditPoints = async (buyerId, pointsToUse, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/buyer/apply-credit-points/${buyerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ pointsToUse })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to apply credit points');
    }

    return await response.json();
  } catch (error) {
    console.error('Error applying credit points:', error);
    throw error;
  }
};

// Place order with automatic eco-friendly point calculation
export const placeOrder = async (orderData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/buyer/place-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to place order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
}; 