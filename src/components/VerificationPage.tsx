import React, { useState } from 'react';
import { Shield, Upload, CheckCircle, Clock, AlertCircle, Award, FileText, Globe } from 'lucide-react';
import { createBusinessDID } from '../lib/algorand-did';
import { merchantService } from '../lib/supabase';

const VerificationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingDID, setIsCreatingDID] = useState(false);
  const [didCreated, setDidCreated] = useState(false);
  const [didData, setDidData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    walletAddress: '',
    email: '',
    businessType: '',
    registrationNumber: '',
    taxId: '',
    certifications: [] as string[],
    refundPolicy: '',
    sourcingInfo: '',
    laborPractices: '',
    verificationLevel: 'basic' as 'basic' | 'advanced' | 'premium'
  });

  const verificationLevels = [
    {
      level: 'basic',
      name: 'Basic Verification',
      price: 'Free',
      features: [
        'Business license verification',
        'Basic KYC checks',
        'Website validation',
        'Basic trust score'
      ],
      requirements: [
        'Business registration document',
        'Valid email address',
        'Website with contact information'
      ]
    },
    {
      level: 'advanced',
      name: 'Advanced Verification',
      price: '$99/year',
      features: [
        'All Basic features',
        'Certification verification',
        'Supply chain audit',
        'Enhanced trust score',
        'Priority support'
      ],
      requirements: [
        'All Basic requirements',
        'Industry certifications',
        'Supplier documentation',
        'Refund policy'
      ]
    },
    {
      level: 'premium',
      name: 'Premium Verification',
      price: '$299/year',
      features: [
        'All Advanced features',
        'On-site inspection',
        'NFT certificate',
        'Maximum trust score',
        'Featured merchant status'
      ],
      requirements: [
        'All Advanced requirements',
        'Third-party labor audit',
        'Sustainability certification',
        'Detailed sourcing documentation'
      ]
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    handleCreateDID();
  };

  const handleCreateDID = async () => {
    setIsCreatingDID(true);
    setError(null);

    // Validate required field
    if (!formData.businessName || formData.businessName.trim() === '') {
      setError('Business name is required');
      setIsCreatingDID(false);
      return;
    }

    try {
      // Create DID on Algorand
      const didResult = await createBusinessDID(
        formData.businessName.trim(),
        formData.businessType,
        formData.verificationLevel,
        crypto.randomUUID(),
        {
          registrationNumber: formData.registrationNumber,
          website: formData.website
        }
      );

      if (didResult.success) {
        setDidData(didResult);
        setDidCreated(true);
        
        // Update merchant record with DID information
        if (currentUser?.id) {
          try {
            await merchantService.updateMerchantDID(currentUser.id, {
              algorand_did: didResult.did,
              did_transaction_id: didResult.transactionId,
              did_created_at: new Date().toISOString()
            });
            console.log('Merchant DID updated successfully');
          } catch (updateError) {
            console.error('Failed to update merchant DID:', updateError);
            // Don't fail the whole process if DID update fails
          }
        }
        
        console.log('DID created successfully:', didResult);
      } else {
        setError(didResult.error || 'Failed to create business DID');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create business DID');
    } finally {
      setIsCreatingDID(false);
    }
  };

  // If DID is created, show success page
  if (didCreated && didData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Application Submitted!</h1>
              <p className="text-gray-600">Your business DID has been created on Algorand blockchain</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Business DID</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <span className="text-sm text-gray-600">Decentralized Identifier</span>
                  <p className="font-mono text-lg font-bold text-blue-600 break-all">{didData.did}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Algorand Transaction ID</span>
                  <p className="font-mono text-sm text-gray-700 break-all">{didData.transactionId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Asset ID</span>
                  <p className="font-mono text-lg font-bold text-purple-600">#{didData.assetId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Algorand Address</span>
                  <p className="font-mono text-sm text-gray-700 break-all">{didData.algorandAddress}</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Business Name</span>
                    <p className="font-medium">{didData.metadata.businessName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Business Type</span>
                    <p className="font-medium capitalize">{didData.metadata.businessType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Verification Level</span>
                    <p className="font-medium capitalize">{didData.metadata.verificationLevel}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Created</span>
                    <p className="font-medium">{new Date(didData.metadata.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-medium text-blue-900 mb-4">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Document review: 3-5 business days</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">DID verification: Complete ✓</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Certificate issuance: Within 24 hours of approval</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center space-x-2 text-green-700 mb-3">
                <Shield className="h-5 w-5" />
                <span className="font-medium">DID Benefits</span>
              </div>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Immutable business identity on Algorand blockchain</li>
                <li>• Verifiable credentials for all stakeholders</li>
                <li>• Interoperable with other DID-compatible systems</li>
                <li>• Enhanced trust and transparency</li>
                <li>• Future-proof digital identity infrastructure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Choose Verification Level</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {verificationLevels.map((level) => (
                <div 
                  key={level.level}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                    formData.verificationLevel === level.level 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('verificationLevel', level.level)}
                >
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                      level.level === 'basic' ? 'bg-green-100' :
                      level.level === 'advanced' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      <Shield className={`h-8 w-8 ${
                        level.level === 'basic' ? 'text-green-600' :
                        level.level === 'advanced' ? 'text-blue-600' : 'text-purple-600'
                      }`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{level.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{level.price}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {level.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {level.requirements.map((req, index) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Business Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                <input
                  type="text"
                  value={formData.walletAddress}
                  onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@yourcompany.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Business Type</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="services">Services</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Business registration number"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Ethical Practices & Documentation</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy</label>
                <textarea
                  value={formData.refundPolicy}
                  onChange={(e) => handleInputChange('refundPolicy', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your refund and return policy..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sourcing Information</label>
                <textarea
                  value={formData.sourcingInfo}
                  onChange={(e) => handleInputChange('sourcingInfo', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your sourcing practices, suppliers, and supply chain..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Labor Practices</label>
                <textarea
                  value={formData.laborPractices}
                  onChange={(e) => handleInputChange('laborPractices', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your labor practices, worker conditions, and ethical standards..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload required documents</p>
                  <p className="text-sm text-gray-500">Business license, certifications, tax documents</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="mt-4"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Review & Submit</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Application Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Verification Level:</span>
                  <span className="font-medium capitalize">{formData.verificationLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Name:</span>
                  <span className="font-medium">{formData.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Website:</span>
                  <span className="font-medium">{formData.website}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Type:</span>
                  <span className="font-medium">{formData.businessType}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-4">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Application review: 3-5 business days</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Document verification: 1-2 business days</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">NFT certificate issuance: Within 24 hours of approval</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Merchant Verification</h1>
          <p className="text-gray-600">Join the ethical commerce revolution and build trust with your customers</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Choose Level</span>
            <span className="text-xs text-gray-500">Business Info</span>
            <span className="text-xs text-gray-500">Documentation</span>
            <span className="text-xs text-gray-500">Review</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={currentStep === 4 ? handleSubmit : handleNext}
              disabled={currentStep === 4 && isCreatingDID}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              {currentStep === 4 ? (
                isCreatingDID ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Creating DID...</span>
                  </div>
                ) : (
                  'Submit & Create DID'
                )
              ) : (
                'Next'
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;