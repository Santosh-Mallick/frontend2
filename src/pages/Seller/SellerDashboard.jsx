import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    ShoppingBag,
    Plus,
    Eye,
    DollarSign, // Added for potential future use or if you add revenue back
    Users, // Added for potential future use or if you add total customers back
    BarChart3, // Added for potential future use
    MessageSquare // Added for potential future use
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SellerDashboard = () => {
    const navigate = useNavigate();
    const { getUserInfo } = useAuth();
    const userInfo = getUserInfo();
    const userEmail = userInfo?.email; // Safely access email
    console.log("UserEmail : ", userEmail);

    // State for dashboard data
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 'N/A',
        totalOrders: 'N/A',
        orders: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data for quick actions (remains unchanged as it's static navigation)
    const quickActions = [
        {
            title: "Add New Product",
            description: "List a new item in your store",
            icon: <Plus className="w-8 h-8" />,
            action: () => navigate('/seller/products/add'),
            color: "bg-green-500 hover:bg-green-600"
        },
        {
            title: "Manage Products",
            description: "View, edit, and delete your products",
            icon: <Eye className="w-8 h-8" />,
            action: () => navigate('/seller/product-management'),
            color: "bg-indigo-500 hover:bg-indigo-600"
        },
        {
            title: "View Orders",
            description: "Check and manage incoming orders",
            icon: <ShoppingBag className="w-8 h-8" />,
            action: () => navigate('/seller/orders'),
            color: "bg-blue-500 hover:bg-blue-600"
        },
        // You can uncomment these if your API provides the data or you add mock data
        // {
        //     title: "Analytics",
        //     description: "View your business performance",
        //     icon: <BarChart3 className="w-8 h-8" />,
        //     action: () => navigate('/seller/analytics'),
        //     color: "bg-purple-500 hover:bg-purple-600"
        // },
        // {
        //     title: "Messages",
        //     description: "Chat with your customers",
        //     icon: <MessageSquare className="w-8 h-8" />,
        //     action: () => navigate('/seller/messages'),
        //     color: "bg-orange-500 hover:bg-orange-600"
        // }
    ];

    useEffect(() => {
        const fetchDashboardDetails = async () => {
          console.log("USer Email : ", userEmail);
            if (!userEmail) {
                setError("User email or authentication token is missing.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://backend-sand-three-70.vercel.app/api/seller/seller-dashboard/${userEmail}`, {
                    method: 'GET',
                });

                console.log("Res : ", res)

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to fetch dashboard details');
                }

                const data = await res.json();
                console.log("Fetched dashboard data:", data);

                // Update the state with fetched data
                setDashboardData({
                    totalProducts: data.details.totalProducts,
                    totalOrders: data.details.totalOrders,
                    orders: data.details.orders || [] // Ensure orders is an array
                });

            } catch (err) {
                console.error('Error fetching dashboard details:', err);
                setError(err.message || 'Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardDetails();
    }, []); // Re-run effect if userEmail or token changes

    // Dynamically create stats based on fetched data
    const stats = [
        {
            title: "Total Products",
            value: dashboardData.totalProducts,
            change: "+12%", // This remains mock as the API doesn't provide it
            icon: <Package className="w-6 h-6" />,
            color: "bg-blue-500"
        },
        {
            title: "Total Orders",
            value: dashboardData.totalOrders,
            change: "+3", // This remains mock as the API doesn't provide it
            icon: <ShoppingBag className="w-6 h-6" />,
            color: "bg-green-500"
        },
        // Uncomment if you want to add mock or real data for these
        // {
        //     title: "Monthly Revenue",
        //     value: "₹45,000",
        //     change: "+18%",
        //     icon: <DollarSign className="w-6 h-6" />,
        //     color: "bg-orange-500"
        // },
        // {
        //     title: "Total Customers",
        //     value: "156",
        //     change: "+23",
        //     icon: <Users className="w-6 h-6" />,
        //     color: "bg-purple-500"
        // }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, {userInfo?.ownerName || userInfo?.shopName}! 👋
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Here's what's happening with your store today
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                View Home
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
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600 font-medium">
                        <p>Error: {error}</p>
                        <p>Please ensure you are logged in and your email is correctly associated with a seller account.</p>
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                            {/* Change text remains mock as API doesn't provide it */}
                                            <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                                        </div>
                                        <div className={`${stat.color} text-white p-3 rounded-lg`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Quick Actions */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                                    <div className="space-y-4">
                                        {quickActions.map((action, index) => (
                                            <button
                                                key={index}
                                                onClick={action.action}
                                                className="w-full p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 text-left group"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`${action.color} text-white p-2 rounded-lg transition-colors`}>
                                                        {action.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                                                            {action.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">{action.description}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                                        <button
                                            onClick={() => navigate('/seller/orders')}
                                            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                                        >
                                            View All
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {dashboardData.orders.length > 0 ? (
                                            dashboardData.orders.map((order) => (
                                                <div key={order._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3">
                                                            <h3 className="font-medium text-gray-900">#ORD-{order._id.substring(0, 8)}</h3> {/* Truncate ID for display */}
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{order.customerName}</p> {/* Assuming customerName field exists */}
                                                        {/* Display up to 2 items for brevity in the dashboard view */}
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {order.items.map(item => item.productName).slice(0, 2).join(', ')}
                                                            {order.items.length > 2 ? ` and ${order.items.length - 2} more` : ''}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">₹{order.totalAmount.toFixed(2)}</p> {/* Assuming totalAmount field exists */}
                                                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p> {/* Assuming createdAt for date */}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-600 py-4">No recent orders to display.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Store Information */}
                        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Store Details</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p><span className="font-medium">Store Name:</span> {userInfo?.shopName || 'N/A'}</p>
                                        <p><span className="font-medium">Owner:</span> {userInfo?.ownerName || 'N/A'}</p>
                                        <p><span className="font-medium">Email:</span> {userInfo?.email || 'N/A'}</p>
                                        <p><span className="font-medium">Phone:</span> {userInfo?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Quick Stats</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p><span className="font-medium">Products Listed:</span> {dashboardData.totalProducts}</p>
                                        <p><span className="font-medium">Total Sales:</span> {'₹0.00'}</p> {/* Mock as API doesn't provide */}
                                        <p><span className="font-medium">Customer Rating:</span> ⭐⭐⭐⭐⭐ 4.8</p> {/* Mock */}
                                        <p><span className="font-medium">Member Since:</span> March 2024</p> {/* Mock */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
