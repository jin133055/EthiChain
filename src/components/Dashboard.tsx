import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Shield, AlertTriangle, CheckCircle, Award, FileText, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const stats = [
    {
      title: 'Total Reports',
      value: '12,543',
      change: '+12.5%',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Verified Merchants',
      value: '2,891',
      change: '+8.2%',
      icon: Shield,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Active Users',
      value: '48,329',
      change: '+15.3%',
      icon: Users,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Scams Prevented',
      value: '$2.4M',
      change: '+22.1%',
      icon: DollarSign,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const reportsData = [
    { month: 'Jan', reports: 850, verified: 720 },
    { month: 'Feb', reports: 980, verified: 850 },
    { month: 'Mar', reports: 1200, verified: 1050 },
    { month: 'Apr', reports: 1100, verified: 980 },
    { month: 'May', reports: 1350, verified: 1200 },
    { month: 'Jun', reports: 1400, verified: 1280 }
  ];

  const categoryData = [
    { name: 'Fake Stores', value: 35, color: '#EF4444' },
    { name: 'Unethical Labor', value: 28, color: '#F97316' },
    { name: 'Fake Reviews', value: 22, color: '#EAB308' },
    { name: 'Plagiarized Content', value: 15, color: '#8B5CF6' }
  ];

  const trustScoreData = [
    { month: 'Jan', avgScore: 72 },
    { month: 'Feb', avgScore: 74 },
    { month: 'Mar', avgScore: 76 },
    { month: 'Apr', avgScore: 78 },
    { month: 'May', avgScore: 80 },
    { month: 'Jun', avgScore: 82 }
  ];

  const recentActivities = [
    {
      type: 'report',
      title: 'New scam report filed',
      description: 'Fake electronics store reported by verified user',
      timestamp: '2 hours ago',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      type: 'verification',
      title: 'Merchant verified',
      description: 'EcoFriendly Electronics completed premium verification',
      timestamp: '4 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'nft',
      title: 'NFT certificate issued',
      description: 'Certificate #ETH-CERT-125 minted for verified merchant',
      timestamp: '6 hours ago',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      type: 'scan',
      title: 'High-risk URL detected',
      description: 'AI scanner flagged suspicious domain pattern',
      timestamp: '8 hours ago',
      icon: Shield,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor ethical commerce trends and platform performance</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Reports Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Reports</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reports" fill="#3B82F6" name="Total Reports" />
                <Bar dataKey="verified" fill="#10B981" name="Verified Reports" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trust Score Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Trust Score Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trustScoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 90]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;