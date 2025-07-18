import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Star, DollarSign, Eye, Award, CheckCircle, AlertTriangle } from 'lucide-react';

const MerchantAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const stats = [
    {
      title: 'Trust Score',
      value: '87/100',
      change: '+5 points',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Profile Views',
      value: '2,341',
      change: '+18% this month',
      icon: Eye,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Customer Reviews',
      value: '4.8/5',
      change: '+0.2 this month',
      icon: Users,
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

  const viewsData = [
    { month: 'Jan', views: 1200, conversions: 180 },
    { month: 'Feb', views: 1400, conversions: 220 },
    { month: 'Mar', views: 1800, conversions: 290 },
    { month: 'Apr', views: 2100, conversions: 340 },
    { month: 'May', views: 2341, conversions: 410 },
    { month: 'Jun', views: 2500, conversions: 450 }
  ];

  const trustScoreData = [
    { month: 'Jan', score: 72 },
    { month: 'Feb', score: 75 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 82 },
    { month: 'May', score: 85 },
    { month: 'Jun', score: 87 }
  ];

  const reviewsData = [
    { rating: '5 Stars', count: 145, color: '#10B981' },
    { rating: '4 Stars', count: 89, color: '#3B82F6' },
    { rating: '3 Stars', count: 23, color: '#F59E0B' },
    { rating: '2 Stars', count: 8, color: '#EF4444' },
    { rating: '1 Star', count: 3, color: '#6B7280' }
  ];

  const certifications = [
    { name: 'Fair Trade Certified', status: 'Active', expires: '2025-12-31' },
    { name: 'B-Corp Certification', status: 'Active', expires: '2024-08-15' },
    { name: 'Carbon Neutral', status: 'Pending', expires: 'N/A' },
    { name: 'Organic Certification', status: 'Active', expires: '2025-03-20' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Merchant Analytics</h1>
            <p className="text-gray-600 mt-2">Track your performance and build customer trust</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          {/* Profile Views & Conversions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Views & Conversions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8B5CF6" name="Profile Views" />
                <Bar dataKey="conversions" fill="#10B981" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trust Score Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust Score Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trustScoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Customer Reviews Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reviewsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={(entry) => `${entry.rating}: ${entry.count}`}
                >
                  {reviewsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Certifications Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications Status</h3>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      cert.status === 'Active' ? 'bg-green-100' : 
                      cert.status === 'Pending' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {cert.status === 'Active' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : cert.status === 'Pending' ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{cert.name}</p>
                      <p className="text-sm text-gray-600">
                        {cert.status === 'Active' ? `Expires: ${cert.expires}` : cert.status}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cert.status === 'Active' ? 'bg-green-100 text-green-700' :
                    cert.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Growth Rate</h4>
              <p className="text-2xl font-bold text-blue-600">+23%</p>
              <p className="text-sm text-gray-600">Monthly growth in profile views</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Verification Level</h4>
              <p className="text-2xl font-bold text-green-600">Advanced</p>
              <p className="text-sm text-gray-600">Premium upgrade available</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Customer Satisfaction</h4>
              <p className="text-2xl font-bold text-purple-600">96%</p>
              <p className="text-sm text-gray-600">Based on recent reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantAnalytics;