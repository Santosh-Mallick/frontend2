import React from 'react';
import { useNavigate } from 'react-router-dom';

// MyOrders component
const MyOrders = () => {
    // Mock order data
    const orders = [
        {
            id: 'ORD-20240726-001',
            date: 'July 26, 2024',
            status: 'Delivered',
            total: 125.99,
            address: '123 Main St, Anytown, USA 12345',
            items: [
                { name: 'Product A', qty: 1, price: 50.00 },
                { name: 'Product B', qty: 2, price: 35.00 },
                { name: 'Shipping', qty: 1, price: 5.99, isShipping: true }
            ]
        },
        {
            id: 'ORD-20240725-002',
            date: 'July 25, 2024',
            status: 'Processing',
            total: 75.50,
            address: '456 Oak Ave, Cityville, USA 67890',
            items: [
                { name: 'Product C', qty: 1, price: 70.00 },
                { name: 'Shipping', qty: 1, price: 5.50, isShipping: true }
            ]
        },
        {
            id: 'ORD-20240724-003',
            date: 'July 24, 2024',
            status: 'Cancelled',
            total: 49.99,
            address: '789 Pine Ln, Villagetown, USA 98765',
            items: [
                { name: 'Product D', qty: 1, price: 45.00 },
                { name: 'Shipping', qty: 1, price: 4.99, isShipping: true }
            ]
        }
    ];

    // Function to get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const navigate = useNavigate(); 
    // Handle back button click
    const handleBackClick = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-100 font-inter">
            {/* Tailwind CSS CDN - Not needed in React if configured via PostCSS, but included for standalone preview */}
            <script src="https://cdn.tailwindcss.com"></script>
            {/* Google Font: Inter - Included in head via link tag in actual HTML, but for standalone React, it might need to be imported or assumed */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 sm:p-8 relative"> {/* Added relative for positioning back button */}
                {/* Back Button */}
                <button
                    onClick={handleBackClick}
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 rounded-full cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
                    aria-label="Go back"
                >
                    {/* Simple SVG for a back arrow */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center mt-8 sm:mt-0">My Order History</h1> {/* Adjusted margin-top for title */}

                {/* Order List Container */}
                <div id="order-list" className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                <div className="mb-2 sm:mb-0">
                                    <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
                                    <p className="text-sm text-gray-600">Placed on: {order.date}</p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-gray-700 font-medium">Total Amount:</p>
                                    <p className="text-2xl font-bold text-indigo-600">${order.total.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700 font-medium">Shipping Address:</p>
                                    <p className="text-gray-800">{order.address}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Items:</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.name} {item.qty > 1 && `(Qty: ${item.qty})`} - ${item.price.toFixed(2)}{item.qty > 1 && ` each`}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-end mt-5">
                                <button className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    View Details
                                </button>
                                <button className="ml-3 px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
                                    Invoice
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
