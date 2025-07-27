import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, AlignLeft, Tag, Hash, Box, Image as ImageIcon, Ruler, Weight } from 'lucide-react'; // Added Ruler/Weight for unit
import { API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../hooks/useAuth';

const AddProductPage = () => {
    const navigate = useNavigate();

    // Define allowed units based on your schema enum.
    // These will be used for both quantity and price per unit.
    const productUnits = ['pieces', 'kg', 'gram', 'litre', 'ml', 'packet', 'dozen'];
    const { getUserInfo } = useAuth();
    const userInfo = getUserInfo();
    //   console.log("UserInfo : ", userInfo.email);
    const userEmail = userInfo.email;

    // Initial state for the product form data
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        quantity: '',
        unit: 'pieces', // Default quantity unit
        pricePerUnitOption: 'pieces', // New: Default price unit
        image: null,
        imageUrlPreview: null,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Handler for all text and number input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handler for file input change (image)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                image: file,
                imageUrlPreview: URL.createObjectURL(file), // Create a URL for preview
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                image: null,
                imageUrlPreview: null,
            }));
        }
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Basic validation
            if (!formData.name || !formData.price || !formData.category || !formData.quantity || !formData.unit || !formData.pricePerUnitOption) {
                throw new Error('Please fill in all required fields.');
            }

            const productData = new FormData();
            productData.append('name', formData.name);
            productData.append('price', parseFloat(formData.price)); // Convert to number
            productData.append('description', formData.description);
            productData.append('category', formData.category);
            // For seller, you'd typically get this from user context (e.g., from an authenticated user ID)
            // For this example, we'll use a placeholder or assume it's set server-side
            productData.append('sellerMail', userEmail); // Test seller ID
            productData.append('quantity', parseInt(formData.quantity, 10)); // Convert to integer
            productData.append('unit', formData.unit);
            productData.append('pricePerUnitOption', formData.pricePerUnitOption);

            if (formData.image) {
                productData.append('image', formData.image); // Append the File object
            }

            // Make API call to backend
            const response = await fetch(API_ENDPOINTS.ADD_PRODUCT, {
                method: 'POST',
                body: productData, // For FormData, fetch automatically sets Content-Type: multipart/form-data
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to add product');
            }

            setSuccessMessage('Product added successfully!');

            // Reset form after successful submission
            setFormData({
                name: '',
                price: '',
                description: '',
                category: '',
                quantity: '',
                unit: 'pieces',
                pricePerUnitOption: 'pieces',
                image: null,
                imageUrlPreview: null,
            });

            // Redirect to seller product management page after 2 seconds
            setTimeout(() => {
                navigate('/seller/product-management');
            }, 2000);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Add New Product</h1>

                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded" role="alert">
                        <p className="font-bold">Success!</p>
                        <p>{successMessage}</p>
                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => navigate('/seller/product-management')}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Manage Products
                            </button>
                            <button
                                onClick={() => {
                                    setSuccessMessage(null);
                                    setFormData({
                                        name: '',
                                        price: '',
                                        description: '',
                                        category: '',
                                        quantity: '',
                                        unit: 'pieces',
                                        pricePerUnitOption: 'pieces',
                                        image: null,
                                        imageUrlPreview: null,
                                    });
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Add Another Product
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
                        <p className="font-bold">Error!</p>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Organic Apples"
                                required
                            />
                        </div>
                    </div>

                    {/* Price and Price Unit Group */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Selling Price <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4"> {/* Use flex for horizontal layout on small screens and up */}
                            <div className="relative flex-grow"> {/* Price Input */}
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="e.g., 50.00"
                                    step="0.01" // Allow decimal values for price
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="relative sm:w-1/3 min-w-[120px]"> {/* Price Unit Dropdown */}
                                <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    id="pricePerUnitOption"
                                    name="pricePerUnitOption"
                                    value={formData.pricePerUnitOption}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    required
                                >
                                    {productUnits.map((unit) => (
                                        <option key={unit} value={unit}>
                                            per {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Set the price, e.g., "50 rupees per kg".
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 text-gray-400" size={20} />
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-y"
                                placeholder="Provide a detailed description of the product..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="" disabled>Select a category</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Eco">Eco</option>
                                <option value="Groceries">Groceries</option>
                                <option value="Meat">Meat</option>
                                <option value="Bakery">Bakery</option>
                            </select>
                        </div>
                    </div>


                    {/* Quantity and Unit (inline) */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity in Stock <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="e.g., 10"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                                Stock Unit <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    id="unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                    </div>

                    {/* Product Image */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Image
                        </label>
                        <div className="flex items-center space-x-4">
                            <label
                                htmlFor="image"
                                className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            >
                                <ImageIcon className="text-gray-400 mr-2" size={20} />
                                <span className="text-gray-700">
                                    {formData.image ? formData.image.name : 'Upload Image (Optional)'}
                                </span>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {formData.imageUrlPreview && (
                            <div className="mt-4 flex justify-center">
                                <img
                                    src={formData.imageUrlPreview}
                                    alt="Product Preview"
                                    className="max-h-48 max-w-full rounded-lg object-contain border border-gray-200 p-1"
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-200 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;