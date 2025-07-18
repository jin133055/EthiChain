import React from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, TrendingUp, Users, Award, Eye, FileText, Star, ArrowRight } from 'lucide-react';

interface BuyerDashboardProps {
  onPageChange: (page: string) => void;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onPageChange }) => {
  const features = [
    {
      icon: Search,
      title: 'URL Scanner',
      description: 'Instantly scan any website or product URL to detect potential scams and unethical practices',
      action: 'Scan Now',
      page: 'scanner',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: AlertTriangle,
      title: 'Report Scams',
      description: 'File blockchain-backed reports about fake stores, unethical practices, or fraudulent activities',
      action: 'File Report',
      page: 'reports',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: Users,
      title: 'Verified Merchants',
      description: 'Browse and discover ethical merchants verified by our community and blockchain technology',
      action: 'Browse Merchants',
      page: 'merchants',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Platform Analytics',
      description: 'View real-time analytics about scam detection, merchant verification, and community activity',
      action: 'View Analytics',
      page: 'dashboard',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  const recentActivity = [
    {
      type: 'scan',
      title: 'URL Scan Completed',
      description: 'Scanned electronics-store-deals.com - High Risk Detected',
      timestamp: '2 hours ago',
      icon: Search,
      color: 'text-blue-600'
    },
    {
      type: 'report',
      title: 'Report Submitted',
      description: 'Filed report for fake fashion outlet - Under Review',
      timestamp: '1 day ago',
      icon: FileText,
      color: 'text-orange-600'
    },
    {
      type: 'merchant',
      title: 'New Verified Merchant',
      description: 'EcoFriendly Electronics received verification',
      timestamp: '2 days ago',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  const stats = [
    {
      title: 'URLs Scanned',
      value: '47',
      change: '+12 this week',
      icon: Eye,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Reports Filed',
      value: '3',
      change: '+1 this month',
      icon: FileText,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Trusted Merchants',
      value: '23',
      change: '+5 following',
      icon: Star,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Community Score',
      value: '892',
      change: '+45 this month',
      icon: Award,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-700 mb-6">
            <Shield className="h-4 w-4 mr-2" />
            Welcome to your Buyer Dashboard
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Shop Safely with
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              EthicChain Protection
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your personal command center for ethical shopping. Scan URLs, report scams, 
            discover verified merchants, and contribute to a safer digital marketplace.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl rounded-3xl" 
                   style={{background: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})`}}></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-gray-200">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">{feature.description}</p>
                <button
                  onClick={() => onPageChange(feature.page)}
                  className={`group/btn bg-gradient-to-r ${feature.color} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105`}
                >
                  <span>{feature.action}</span>
                  <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-200/50">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
            Recent Activity
          </h3>
          <div className="space-y-6">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className={`p-3 rounded-xl bg-gray-100 ${activity.color}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
                  <p className="text-gray-600 mb-2">{activity.description}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Shield className="h-6 w-6 mr-3" />
              Smart Shopping Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <h4 className="font-semibold mb-3">🔍 Always Scan First</h4>
                <p className="text-blue-100">Use our URL scanner before making any purchase to detect potential scams and verify merchant legitimacy.</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <h4 className="font-semibold mb-3">✅ Choose Verified Merchants</h4>
                <p className="text-blue-100">Shop from our verified merchant directory to ensure ethical sourcing and authentic products.</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <h4 className="font-semibold mb-3">📢 Report Suspicious Activity</h4>
                <p className="text-blue-100">Help the community by reporting fake stores and unethical practices you encounter.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;