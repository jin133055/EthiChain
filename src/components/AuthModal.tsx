import React, { useState } from 'react';
import { X, Mail, Lock, User, MapPin, Wallet, Shield, ShoppingCart, Package } from 'lucide-react';
import { authService, merchantService } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (userData: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [authMethod, setAuthMethod] = useState<'wallet' | 'email'>('wallet');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    city: '',
    pincode: '',
    name: '',
    walletAddress: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // For demo, assume login is successful
        if (formData.email && formData.password) {
          const { user, profile } = await authService.signInWithEmail(formData.email, formData.password);
          if (user && profile) {
            onConnect({
              method: 'email',
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              role: profile.role,
              city: profile.city,
              pincode: profile.pincode,
              auth_method: profile.auth_method,
              wallet_address: profile.wallet_address
            });
            onClose();
            resetForm();
          }
        }
      } else {
        // Registration flow
        if (formData.email && formData.password && formData.confirmPassword && formData.name) {
          if (formData.password === formData.confirmPassword) {
            setStep(2);
          } else {
            setError('Passwords do not match');
          }
        } else {
          setError('Please fill in all required fields');
        }
      }
    } catch (err: any) {
      // Handle specific Supabase error codes
      if (err.message && (err.message.includes('Email not confirmed') || err.message.includes('email and click the confirmation link'))) {
        setError('Please check your email and click the confirmation link to complete your account setup.');
      } else if (err.code === 'email_not_confirmed' || (err.message && err.message.includes('email_not_confirmed'))) {
        setError('Please check your email and click the confirmation link to complete your account setup.');
      } else if (err.message && err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (err.message && err.message.includes('Signup requires a valid password')) {
        setError('Please enter a valid password (minimum 6 characters).');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelection = async (role: string) => {
    setFormData(prev => ({ ...prev, role }));
    setIsLoading(true);
    setError('');

    try {
      if (role === 'buyer') {
        setStep(3);
      } else {
        await completeEmailAuth(role);
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('Email not confirmed') || err.message.includes('email and click the confirmation link'))) {
        setError('Please check your email and click the confirmation link to complete your account setup.');
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (formData.city && formData.pincode) {
        await completeEmailAuth(formData.role);
      } else {
        setError('Please fill in all location fields');
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('Email not confirmed') || err.message.includes('email and click the confirmation link'))) {
        setError('Please check your email and click the confirmation link to complete your account setup.');
      } else {
        setError(err.message || 'Failed to complete registration');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const completeEmailAuth = async (role: string) => {
    if (isLogin) {
      // Handle login
      const { user, profile } = await authService.signInWithEmail(formData.email, formData.password);
      if (user && profile) {
        onConnect({
          method: 'email',
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          city: profile.city,
          pincode: profile.pincode,
          auth_method: profile.auth_method,
          wallet_address: profile.wallet_address
        });
      }
    } else {
      // Handle signup - create new account and profile
      const userData = await authService.signUpWithEmail(formData.email, formData.password, {
        full_name: formData.name,
        role: role as 'buyer' | 'supplier',
        city: role === 'buyer' ? formData.city : undefined,
        pincode: role === 'buyer' ? formData.pincode : undefined
      });

      if (userData.user) {
        // If supplier, create merchant profile
        if (role === 'supplier') {
          try {
            await authService.createMerchantProfile(userData.user.id, {
              verification_level: 'basic'
            });
          } catch (merchantError) {
            console.error('Failed to create merchant profile:', merchantError);
            // Continue with user creation even if merchant profile fails
          }
        }

        // Return the profile data directly since we just created it
        onConnect({
          method: 'email',
          id: userData.user.id,
          email: userData.user.email,
          full_name: formData.name,
          role: role as 'buyer' | 'supplier',
          city: role === 'buyer' ? formData.city : undefined,
          pincode: role === 'buyer' ? formData.pincode : undefined,
          auth_method: 'email'
        });
      }
    }

    onClose();
    resetForm();
  };

  const handleWalletConnect = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate MetaMask connection
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];
        
        // Check if user already exists
        const existingUser = await authService.getUserByWallet(walletAddress);
        
        if (existingUser) {
          onConnect({
            method: 'wallet',
            ...existingUser
          });
          onClose();
          resetForm();
        } else {
          // New wallet user - collect additional info
          setFormData(prev => ({ ...prev, walletAddress }));
          setStep(2); // Go to role selection
        }
      } else {
        setError('MetaMask not detected. Please install MetaMask to continue.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletRoleSelection = async (role: string) => {
    setFormData(prev => ({ ...prev, role }));
    setIsLoading(true);
    setError('');

    try {
      if (role === 'buyer') {
        setStep(3);
      } else {
        await completeWalletAuth(role);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create wallet account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (formData.city && formData.pincode && formData.name) {
        await completeWalletAuth(formData.role);
      } else {
        setError('Please fill in all required fields');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete wallet registration');
    } finally {
      setIsLoading(false);
    }
  };

  const completeWalletAuth = async (role: string) => {
    const userData = await authService.createWalletUser({
      full_name: formData.name,
      wallet_address: formData.walletAddress,
      role: role as 'buyer' | 'supplier',
      city: role === 'buyer' ? formData.city : undefined,
      pincode: role === 'buyer' ? formData.pincode : undefined
    });

    // If supplier, create merchant profile
    if (role === 'supplier') {
      try {
        await authService.createMerchantProfile(userData.id, {
          verification_level: 'basic'
        });
      } catch (merchantError) {
        console.error('Failed to create merchant profile:', merchantError);
        // Continue with user creation even if merchant profile fails
      }
    }

    onConnect({
      method: 'wallet',
      ...userData
    });

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setAuthMethod('wallet');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      city: '',
      pincode: '',
      name: '',
      walletAddress: ''
    });
    setIsLogin(true);
    setIsLoading(false);
    setError('');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect to EthicChain</h2>
              <p className="text-gray-600">Choose your preferred authentication method</p>
            </div>

            {/* Auth Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setAuthMethod('wallet')}
                className={`p-6 border-2 rounded-xl transition-all duration-200 ${
                  authMethod === 'wallet' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <Wallet className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 mb-2">Crypto Wallet</h3>
                  <p className="text-sm text-gray-600">Connect with MetaMask, WalletConnect, or other Web3 wallets</p>
                </div>
              </button>

              <button
                onClick={() => setAuthMethod('email')}
                className={`p-6 border-2 rounded-xl transition-all duration-200 ${
                  authMethod === 'email' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <Mail className="h-12 w-12 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold text-gray-900 mb-2">Email & Password</h3>
                  <p className="text-sm text-gray-600">Traditional authentication with email and password</p>
                </div>
              </button>
            </div>

            {/* Wallet Connection */}
            {authMethod === 'wallet' && (
              <div className="space-y-4">
                {!formData.walletAddress && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                )}
                <button
                  onClick={handleWalletConnect}
                  disabled={isLoading || (!formData.name && !formData.walletAddress)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-5 w-5" />
                      <span>{formData.walletAddress ? 'Wallet Connected' : 'Connect Wallet'}</span>
                    </>
                  )}
                </button>
                {formData.walletAddress && (
                  <div className="text-sm text-green-600 text-center">
                    Connected: {formData.walletAddress.substring(0, 6)}...{formData.walletAddress.substring(-4)}
                  </div>
                )}
                <p className="text-xs text-gray-500 text-center">
                  By connecting, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}

            {/* Email Form */}
            {authMethod === 'email' && (
              <div className="space-y-4">
                <div className="flex justify-center space-x-4 mb-4">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      isLogin ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      !isLogin ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm your password"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                      </>
                    ) : (
                      <span>{isLogin ? 'Login' : 'Create Account'}</span>
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-500 text-center">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Role</h2>
              <p className="text-gray-600">Choose how you'll be using EthicChain</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => authMethod === 'wallet' ? handleWalletRoleSelection('buyer') : handleRoleSelection('buyer')}
                disabled={isLoading}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-200">
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Buyer/Consumer</h3>
                  <p className="text-sm text-gray-600">
                    Verify ethical sourcing, report scams, and discover trusted merchants
                  </p>
                  <div className="mt-4 space-y-1 text-xs text-gray-500">
                    <p>• Scan URLs for scam detection</p>
                    <p>• File reports on unethical practices</p>
                    <p>• Access verified merchant directory</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => authMethod === 'wallet' ? handleWalletRoleSelection('supplier') : handleRoleSelection('supplier')}
                disabled={isLoading}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-200">
                    <Package className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Supplier/Merchant</h3>
                  <p className="text-sm text-gray-600">
                    Get verified, build trust, and showcase ethical practices
                  </p>
                  <div className="mt-4 space-y-1 text-xs text-gray-500">
                    <p>• Apply for verification badges</p>
                    <p>• Receive NFT certificates</p>
                    <p>• Access merchant dashboard</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Information</h2>
              <p className="text-gray-600">Help us provide location-specific insights and recommendations</p>
            </div>

            <form onSubmit={authMethod === 'wallet' ? handleWalletLocationSubmit : handleLocationSubmit} className="space-y-4">
              {authMethod === 'wallet' && !formData.name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your city"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your PIN code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">6-digit postal code</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Why we need this information:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Show local verified merchants and suppliers</li>
                  <li>• Provide region-specific scam alerts</li>
                  <li>• Recommend ethical alternatives in your area</li>
                  <li>• Enable location-based community features</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Completing Setup...</span>
                  </>
                ) : (
                  <span>Complete Setup</span>
                )}
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">EthicChain</span>
            </div>
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {renderStep()}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;