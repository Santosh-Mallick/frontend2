// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-sand-three-70.vercel.app';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  
  // Seller endpoints
  ADD_PRODUCT: `${API_BASE_URL}/api/seller/add-product`,
  DELETE_PRODUCT: `${API_BASE_URL}/api/seller/delete-product`,
  EDIT_PRODUCT: `${API_BASE_URL}/api/seller/edit-product`,
  GET_SELLER_PRODUCTS: `${API_BASE_URL}/api/seller/seller-products`,
  
  // Map endpoints
  MAP_ROUTES: `${API_BASE_URL}/api/map`,
  
  // Buyer endpoints
  PLACE_ORDER: `${API_BASE_URL}/api/buyer/place-order`,
  CANCEL_ORDER: `${API_BASE_URL}/api/buyer/cancel-order`,
  GET_CREDIT_WALLET: `${API_BASE_URL}/api/buyer/credit-wallet`,
  APPLY_CREDIT_POINTS: `${API_BASE_URL}/api/buyer/apply-credit-points`,
};

export { API_BASE_URL };
export default API_BASE_URL; 