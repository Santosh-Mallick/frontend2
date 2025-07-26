import { useAuth } from '../../hooks/useAuth';
import { ShoppingBag, Store, LogOut, User, Settings } from 'lucide-react';
import { config } from '../../config/env.js';

const Dashboard = () => {
  const { currentUser, userType, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const buyerFeatures = [
    { icon: ShoppingBag, title: 'Browse Products', description: 'Explore thousands of products' },
    { icon: User, title: 'My Orders', description: 'Track your purchase history' },
    { icon: Settings, title: 'Preferences', description: 'Manage your account settings' }
  ];

  const sellerFeatures = [
    { icon: Store, title: 'My Store', description: 'Manage your product listings' },
    { icon: ShoppingBag, title: 'Orders', description: 'View and fulfill customer orders' },
    { icon: Settings, title: 'Analytics', description: 'Track your sales performance' }
  ];

  const features = userType === 'buyer' ? buyerFeatures : sellerFeatures;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                {userType === 'buyer' ? <ShoppingBag className="text-white" size={24} /> : <Store className="text-white" size={24} />}
              </div>
              <h1 className="text-2xl font-bold text-white">{config.APP_NAME}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Welcome, {currentUser?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to your {userType === 'buyer' ? 'Shopping' : 'Seller'} Dashboard
          </h2>
          <p className="text-xl text-gray-300">
            {userType === 'buyer' 
              ? 'Discover amazing products and start shopping!' 
              : 'Manage your store and grow your business!'
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200 hover:transform hover:scale-105"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-blue-300 font-semibold mb-2">Total {userType === 'buyer' ? 'Orders' : 'Products'}</h3>
            <p className="text-3xl font-bold text-white">24</p>
          </div>
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-purple-300 font-semibold mb-2">This Month</h3>
            <p className="text-3xl font-bold text-white">8</p>
          </div>
          <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6">
            <h3 className="text-green-300 font-semibold mb-2">Status</h3>
            <p className="text-3xl font-bold text-white">Active</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 