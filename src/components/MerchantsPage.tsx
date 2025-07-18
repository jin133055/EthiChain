import React, { useState } from 'react';
import { Search, Shield, Award, CheckCircle, Star, ExternalLink, Filter, TrendingUp, MapPin, Calendar, User } from 'lucide-react';
import { merchantService, Merchant } from '../lib/supabase';

const MerchantsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load merchants on component mount
  React.useEffect(() => {
    loadMerchants();
  }, []);

  const loadMerchants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await merchantService.getAllMerchants();
      setMerchants(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load merchants');
      console.error('Error loading merchants:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search merchants
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await merchantService.searchMerchants(searchTerm, filterLevel);
      setMerchants(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to search merchants');
      console.error('Error searching merchants:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter merchants locally for real-time filtering
  const filteredMerchants = merchants.filter(merchant => {
    // Only show merchants with DID (verified merchants)
    const hasDID = merchant.algorand_did && merchant.algorand_did.trim() !== '';
    
    const matchesSearch = !searchTerm || 
      merchant.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterLevel === 'all' || merchant.verification_level === filterLevel;
    
    return hasDID && matchesSearch && matchesFilter;
  });

  // Handle search input with debounce
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      } else {
        loadMerchants();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterLevel]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVerificationBadge = (level: string) => {
    const badges = {
      basic: { color: 'bg-gray-100 text-gray-700', label: 'Basic' },
      advanced: { color: 'bg-blue-100 text-blue-700', label: 'Advanced' },
      premium: { color: 'bg-purple-100 text-purple-700', label: 'Premium' }
    };
    return badges[level as keyof typeof badges] || badges.basic;
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading && merchants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading verified merchants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Merchants</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadMerchants}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verified Merchants</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover ethical businesses with blockchain-verified DIDs and community trust
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-sm font-medium text-green-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            {filteredMerchants.length} DID-Verified Merchants
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search merchants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="basic">Basic</option>
                <option value="advanced">Advanced</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading indicator for search */}
        {loading && merchants.length > 0 && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
              <span className="text-blue-600 text-sm">Searching...</span>
            </div>
          </div>
        )}

        {/* Merchants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMerchants.map((merchant) => {
            const verificationBadge = getVerificationBadge(merchant.verification_level);
            
            return (
              <div key={merchant.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{merchant.business_name}</h3>
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs">DID Verified</span>
                        </div>
                      </div>
                      {merchant.website && (
                        <a
                          href={merchant.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                        >
                          <span className="truncate">{merchant.website}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {merchant.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{merchant.description}</p>
                  )}

                  {/* Trust Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Trust Score</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrustScoreColor(merchant.trust_score)}`}>
                        {merchant.trust_score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          merchant.trust_score >= 90 ? 'bg-green-500' : 
                          merchant.trust_score >= 70 ? 'bg-blue-500' :
                          merchant.trust_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${merchant.trust_score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Verification Level */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Verification Level</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${verificationBadge.color}`}>
                        {verificationBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Certifications */}
                  {merchant.certifications && merchant.certifications.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700 mb-2 block">Certifications</span>
                      <div className="flex flex-wrap gap-1">
                        {merchant.certifications.slice(0, 3).map((cert, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {cert}
                          </span>
                        ))}
                        {merchant.certifications.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{merchant.certifications.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Business Info */}
                  <div className="mb-4 space-y-2">
                    {merchant.business_type && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Shield className="h-4 w-4 mr-2" />
                        <span className="capitalize">{merchant.business_type}</span>
                      </div>
                    )}
                    {merchant.user_profile?.city && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{merchant.user_profile.city}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Verified {formatDate(merchant.verification_date)}</span>
                    </div>
                  </div>

                  {/* NFT Certificate */}
                  {merchant.nft_certificate_id && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">NFT Certificate</span>
                      </div>
                      <p className="text-xs text-purple-600 mt-1">{merchant.nft_certificate_id}</p>
                    </div>
                  )}

                  {/* Contact Info */}
                  {merchant.user_profile && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Contact</span>
                      </div>
                      {merchant.user_profile.full_name && (
                        <p className="text-sm text-gray-600">{merchant.user_profile.full_name}</p>
                      )}
                      {merchant.user_profile.email && (
                        <p className="text-sm text-gray-600">{merchant.user_profile.email}</p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>View Profile</span>
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>Review</span>
                    </button>
                  </div>

                  {/* DID Information */}
                  {merchant.algorand_did && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Blockchain DID</span>
                      </div>
                      <p className="text-xs text-blue-700 font-mono break-all">{merchant.algorand_did}</p>
                      {merchant.did_created_at && (
                        <p className="text-xs text-blue-600 mt-1">
                          Created: {formatDate(merchant.did_created_at)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

            );
          })}
        </div>

        {filteredMerchants.length === 0 && !loading && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No DID-verified merchants found</h3>
            <p className="text-gray-600">
              {searchTerm || filterLevel !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No merchants have completed DID verification yet. Merchants need to create a blockchain DID to appear here.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );

};

export default MerchantsPage;