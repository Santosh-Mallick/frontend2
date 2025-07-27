import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Store, 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Settings, 
  Plus,
  ShoppingBag,
  BarChart3,
  MessageSquare
} from 'lucide-react';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();

  // Mock data for dashboard
  const stats = [
    {
      title: "Total Products",
      value: "24",
      change: "+12%",
      icon: <Package className="w-6 h-6" />,
      color: "bg-blue-500"
    },
    {
      title: "Active Orders",
      value: "8",
      change: "+3",
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "bg-green-500"
    },
    {
      title: "Monthly Revenue",
      value: "₹45,000",
      change: "+18%",
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-orange-500"
    },
    {
      title: "Total Customers",
      value: "156",
      change: "+23",
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-500"
    }
  ];

  const quickActions = [
    {
      title: "Add New Product",
      description: "List a new item in your store",
      icon: <Plus className="w-8 h-8" />,
      action: () => navigate('/seller/products/add'),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "View Orders",
      description: "Check and manage incoming orders",
      icon: <ShoppingBag className="w-8 h-8" />,
      action: () => navigate('/seller/orders'),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Analytics",
      description: "View your business performance",
      icon: <BarChart3 className="w-8 h-8" />,
      action: () => navigate('/seller/analytics'),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Messages",
      description: "Chat with your customers",
      icon: <MessageSquare className="w-8 h-8" />,
      action: () => navigate('/seller/messages'),
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "Street Food Corner",
      items: "Fresh Vegetables, Spices",
      amount: "₹2,500",
      status: "Pending",
      date: "2 hours ago"
    },
    {
      id: "#ORD-002",
      customer: "Local Restaurant",
      items: "Dairy Products, Grains",
      amount: "₹4,200",
      status: "Delivered",
      date: "1 day ago"
    },
    {
      id: "#ORD-003",
      customer: "Food Truck",
      items: "Meat, Packaging",
      amount: "₹3,800",
      status: "In Transit",
      date: "2 days ago"
    }
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
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
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{order.id}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
                      <p className="text-sm text-gray-500 mt-1">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{order.amount}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                  </div>
                ))}
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
                <p><span className="font-medium">Store Name:</span> {userInfo?.shopName}</p>
                <p><span className="font-medium">Owner:</span> {userInfo?.ownerName}</p>
                <p><span className="font-medium">Email:</span> {userInfo?.userEmail}</p>
                <p><span className="font-medium">Phone:</span> {userInfo?.userPhone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Quick Stats</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Products Listed:</span> 24</p>
                <p><span className="font-medium">Total Sales:</span> ₹1,25,000</p>
                <p><span className="font-medium">Customer Rating:</span> ⭐⭐⭐⭐⭐ 4.8</p>
                <p><span className="font-medium">Member Since:</span> March 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard; 