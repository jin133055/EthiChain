import React, { useState } from 'react';
import { Plus, FileText, AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';
import { ScamReport } from '../types';

const ReportsPage: React.FC = () => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const [reports, setReports] = useState<ScamReport[]>([
    {
      id: '1',
      reporterId: '0x742d35Cc4Bf8D3e8D4d9e8f9A9c3B1f2E3d4C5e6',
      targetUrl: 'https://fake-electronics-store.com',
      category: 'fake_store',
      description: 'This store is selling counterfeit electronics at suspiciously low prices. Multiple customers have reported receiving fake products.',
      evidence: ['screenshot1.png', 'email_correspondence.pdf'],
      timestamp: new Date(2024, 0, 15),
      blockchainHash: '0x8b7c9d2e1f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
      ipfsHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
      verified: true,
      votes: 47
    },
    {
      id: '2',
      reporterId: '0x9e8f7d6c5b4a3e2d1c0b9a8f7e6d5c4b3a2e1d0c9b8a7f6e5d4c3b2a1e0d9c8b7a6f5e4d3c2b1a0',
      targetUrl: 'https://cheap-fashion-outlet.com',
      category: 'unethical_labor',
      description: 'Investigation reveals this company sources from factories with poor working conditions and child labor.',
      evidence: ['investigation_report.pdf', 'factory_photos.zip'],
      timestamp: new Date(2024, 0, 10),
      blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
      ipfsHash: 'QmYfEjQHJm3N5HN8X9rYrG7XYgN8EHCJmYfEjQHJm3N5HN8X9rYrG7XYgN8EHCJm',
      verified: false,
      votes: 23
    }
  ]);

  const [newReport, setNewReport] = useState({
    targetUrl: '',
    category: 'fake_store' as const,
    description: '',
    evidence: [] as string[]
  });

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting report:', newReport);
    setShowReportForm(false);
    setNewReport({
      targetUrl: '',
      category: 'fake_store',
      description: '',
      evidence: []
    });
  };

  const filteredReports = reports.filter(report =>
    filterCategory === 'all' || report.category === filterCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fake_store': return '🏪';
      case 'unethical_labor': return '👷';
      case 'plagiarized_content': return '📄';
      case 'fake_reviews': return '⭐';
      default: return '🚨';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fake_store': return 'bg-red-100 text-red-700';
      case 'unethical_labor': return 'bg-orange-100 text-orange-700';
      case 'plagiarized_content': return 'bg-purple-100 text-purple-700';
      case 'fake_reviews': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Reports</h1>
            <p className="text-gray-600 mt-2">Help build a safer marketplace by reporting unethical practices</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowReportForm(!showReportForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>File Report</span>
            </button>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Contact Authorities</span>
            </a>
          </div>
        </div>

        {/* Report Form */}
        {showReportForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">File New Report</h2>
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target URL</label>
                <input
                  type="url"
                  value={newReport.targetUrl}
                  onChange={(e) => setNewReport({ ...newReport, targetUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newReport.category}
                  onChange={(e) => setNewReport({ ...newReport, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fake_store">Fake Store</option>
                  <option value="unethical_labor">Unethical Labor</option>
                  <option value="plagiarized_content">Plagiarized Content</option>
                  <option value="fake_reviews">Fake Reviews</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide detailed information about the unethical practice..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Evidence (Optional)</label>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.txt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Upload screenshots, documents, or other evidence</p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Submit Report
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="fake_store">Fake Store</option>
              <option value="unethical_labor">Unethical Labor</option>
              <option value="plagiarized_content">Plagiarized Content</option>
              <option value="fake_reviews">Fake Reviews</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getCategoryIcon(report.category)}</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                        {report.category.replace('_', ' ')}
                      </span>
                      {report.verified && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs">Verified</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{report.targetUrl}</h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                    <Clock className="h-4 w-4" />
                    <span>{report.timestamp.toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {report.votes} votes
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    ✓ Confirm ({report.votes})
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    ✗ Dispute
                  </button>
                  <a
                    href={`https://ipfs.io/ipfs/${report.ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Evidence</span>
                  </a>
                </div>
                <div className="text-xs text-gray-500">
                  Blockchain: {report.blockchainHash.substring(0, 10)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
