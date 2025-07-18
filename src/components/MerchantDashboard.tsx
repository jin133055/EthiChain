import React from 'react';
import { Shield, Award, TrendingUp, Users, CheckCircle, Star, DollarSign, Eye, FileText, ArrowRight, Zap } from 'lucide-react';

interface MerchantDashboardProps {
  onPageChange: (page: string) => void;
}

const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ onPageChange }) => {
  const features = [
    {
      icon: Award,
      title: 'Get Verified',
      description: 'Apply for blockchain verification to build trust and receive your NFT certificate',
      action: 'Start Verification',
      page: 'verify',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track your trust score, customer feedback, and business performance metrics',
      action: 'View Analytics',
      page: 'merchant-analytics',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Manage Profile',
      description: 'Update your business information, certifications, and ethical practices documentation',
      action: 'Edit Profile',
      page: 'merchant-profile',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Shield,
      title: 'Platform Analytics',
      description: 'View industry trends, market insights, and platform-wide ethical commerce data',
      action: 'View Platform Data',
      page: 'dashboard',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  const stats = [
    {
      title: 'Trust Score',
      value: '87/100',
      change: '+5 this month',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Profile Views',
      value: '2,341',
      change: '+18% this week',
      icon: Eye,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Verification Status',
      value: 'Advanced',
      change: 'Upgrade available',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Revenue Impact',
      value: '+23%',
      change: 'Since verification',
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const recentActivity = [
    {
      type: 'verification',
      title: 'Verification Updated',
      description: 'Advanced verification documents approved',
      timestamp: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'review',
      title: 'New Customer Review',
      description: '5-star review: "Excellent ethical practices and quality"',
      timestamp: '1 day ago',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      type: 'analytics',
      title: 'Trust Score Increased',
      description: 'Your trust score improved from 82 to 87',
      timestamp: '3 days ago',
      icon: TrendingUp,
      color: 'text-blue-600'
    }
  ];

  const verificationBenefits = [
    {
      icon: Shield,
      title: 'Enhanced Trust',
      description: 'Blockchain-verified credentials build customer confidence'
    },
    {
      icon: TrendingUp,
      title: 'Increased Sales',
      description: 'Verified merchants see 40% higher conversion rates'
    },
    {
      icon: Award,
      title: 'NFT Certificate',
      description: 'Receive tamper-proof digital certificates for your achievements'
    },
    {
      icon: Users,
      title: 'Priority Listing',
      description: 'Featured placement in our verified merchant directory'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-medium text-purple-700 mb-6">
            <Award className="h-4 w-4 mr-2" />
            Merchant Command Center
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Build Trust with
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Blockchain Verification
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your comprehensive hub for managing verification, tracking performance, 
            and building customer trust through ethical business practices.
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-200/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <TrendingUp className="h-6 w-6 mr-3 text-purple-600" />
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

          {/* Verification Benefits */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-200/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Zap className="h-6 w-6 mr-3 text-yellow-600" />
              Verification Benefits
            </h3>
            <div className="space-y-6">
              {verificationBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                    <benefit.icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative text-center">
            <Award className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h3 className="text-3xl font-bold mb-4">Ready to Get Verified?</h3>
            <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
              Join thousands of ethical merchants who have increased their sales and built customer trust through blockchain verification.
            </p>
            <button
              onClick={() => onPageChange('verify')}
              className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 hover:shadow-xl transition-all duration-300 flex items-center space-x-3 mx-auto"
            >
              <Shield className="h-6 w-6" />
              <span>Start Verification Process</span>
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;