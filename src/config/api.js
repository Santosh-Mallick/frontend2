// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
};

export default API_BASE_URL; 