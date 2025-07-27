import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  Tag,
  Hash,
  Box,
  Image as ImageIcon
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../hooks/useAuth';

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  const userEmail = userInfo.email;
  console.log("User email : ", userEmail);

  // Mock seller ID - in real app, get from auth context
  // const sellerId = '6885b8d5494eb7af762072ff';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // console.log('Fetching products for seller:', sellerId);
      console.log('API URL:', `${API_ENDPOINTS.GET_SELLER_PRODUCTS}/${userEmail}`);
      
      const response = await fetch(`${API_ENDPOINTS.GET_SELLER_PRODUCTS}/${userEmail}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Combine available and out of stock products
      const allProducts = [
        ...(data.products?.available || []),
        ...(data.products?.outOfStock || [])
      ];
      
      console.log('All products:', allProducts);
      setProducts(allProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DELETE_PRODUCT}/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Remove product from local state
      setProducts(products.filter(product => product._id !== productId));
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600 mt-1">
                Manage your product inventory
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/seller/products/add')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t added any products yet'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <button
                onClick={() => navigate('/seller/products/add')}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product}
                onView={() => {
                  setSelectedProduct(product);
                  setShowViewModal(true);
                }}
                onEdit={() => {
                  setSelectedProduct(product);
                  setShowEditModal(true);
                }}
                onDelete={() => {
                  setSelectedProduct(product);
                  setShowDeleteModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <ViewProductModal 
          product={selectedProduct}
          onClose={() => {
            setShowViewModal(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <EditProductModal 
          product={selectedProduct}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onUpdate={(updatedProduct) => {
            setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <DeleteConfirmationModal 
          product={selectedProduct}
          onConfirm={() => deleteProduct(selectedProduct._id)}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center relative group">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="text-gray-400" size={48} />
            <span className="text-gray-500 ml-2">No Image</span>
          </div>
        )}
        
        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
          <button
            onClick={onView}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onEdit}
            className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
            title="Edit Product"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center mb-2">
          <DollarSign className="text-green-600 mr-1" size={16} />
          <span className="text-lg font-bold text-green-600">
            ₹{product.price}
          </span>
          <span className="text-sm text-gray-500 ml-1">
            per {product.pricePerUnitOption || product.unit}
          </span>
        </div>

        {/* Category */}
        <div className="flex items-center mb-2">
          <Tag className="text-blue-500 mr-1" size={14} />
          <span className="text-sm text-gray-600">{product.category}</span>
        </div>

        {/* Stock Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Hash className="text-orange-500 mr-1" size={14} />
            <span className="text-sm text-gray-600">
              {product.quantity} {product.unit}
            </span>
          </div>
          
          {/* Stock Status */}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.quantity > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>

        {/* Description (if available) */}
        {product.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Created Date */}
        <div className="text-xs text-gray-400 mt-2">
          Added: {new Date(product.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

// View Product Modal
const ViewProductModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <Package className="text-gray-400 mx-auto mb-2" size={48} />
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600">{product.description || 'No description available'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="text-lg font-bold text-green-600">₹{product.price}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="text-gray-900">{product.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Stock</label>
                  <p className="text-gray-900">{product.quantity} {product.unit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Price Unit</label>
                  <p className="text-gray-900">per {product.pricePerUnitOption || product.unit}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  product.quantity > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Added On</label>
                <p className="text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Product Modal
const EditProductModal = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    description: product.description || '',
    category: product.category,
    quantity: product.quantity,
    unit: product.unit,
    pricePerUnitOption: product.pricePerUnitOption || product.unit,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const productUnits = ['pieces', 'kg', 'gram', 'litre', 'ml', 'packet'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_ENDPOINTS.EDIT_PRODUCT}/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();
      onUpdate(updatedProduct.product);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <p className="font-bold">Error!</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white"
                  required
                >
                  {productUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Unit <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.pricePerUnitOption}
                onChange={(e) => setFormData({...formData, pricePerUnitOption: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white"
                required
              >
                {productUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    per {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {loading ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ product, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Delete Product</h2>
              <p className="text-gray-600">This action cannot be undone.</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>"{product.name}"</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This will permanently remove the product from your inventory.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement; 