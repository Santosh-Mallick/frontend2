import React from 'react';
import { Package, DollarSign, Tag, Hash, Box } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
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

export default ProductCard; 