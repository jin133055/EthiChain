import React, { useState } from 'react';
import { Shield, Menu, X, Wallet, User, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';
import { merchantService, authService } from '../lib/supabase';
import TransactionNFT from './TransactionNFT';
import { useRef } from 'react';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    buyerWallet: '',
    sellerWallet: '',
    productName: '',
    amount: '',
    sellerVerificationLevel: '',
    ethicalScore: ''
  });
  const [showTransactionNFT, setShowTransactionNFT] = useState(false);
  const [showSummarizeModal, setShowSummarizeModal] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic navigation based on user role
  const getNavItems = () => {
    if (!isConnected || !userData) {
      // Default navigation for non-logged in users
      return [
        { id: 'home', label: 'Home' },
        { id: 'scanner', label: 'URL Scanner' },
        { id: 'reports', label: 'Reports' },
        { id: 'merchants', label: 'Merchants' },
        { id: 'verify', label: 'Get Verified' },
        { id: 'dashboard', label: 'Analytics' },
        { id: 'check-product', label: 'Check Product' },
      ];
    }
    
    if (userData.role === 'buyer') {
      return [
        { id: 'home', label: 'Home' },
        { id: 'buyer-dashboard', label: 'My Dashboard' },
        { id: 'scanner', label: 'URL Scanner' },
        { id: 'reports', label: 'Reports' },
        { id: 'merchants', label: 'Verified Merchants' },
        { id: 'dashboard', label: 'Analytics' },
        { id: 'check-product', label: 'Check Product' },
        { id: 'verified-product', label: 'Verified Products' },
      ];
    } else if (userData.role === 'supplier') {
      return [
        { id: 'home', label: 'Home' },
        { id: 'merchant-dashboard', label: 'Merchant Hub' },
        { id: 'verify', label: 'Get Verified' },
        { id: 'merchant-analytics', label: 'My Analytics' },
        { id: 'merchant-profile', label: 'My Profile' },
        { id: 'dashboard', label: 'Platform Analytics' },
        { id: 'check-product', label: 'Check Product' },
      ];
    }
    
    return [];
  };

  const handleConnect = (data: any) => {
    setUserData(data);
    setIsConnected(true);
    
    // If supplier and no merchant profile exists, create one
    if (data.role === 'supplier' && data.id) {
      createMerchantProfileIfNeeded(data);
    }
    
    // Redirect based on role
    if (data.role === 'buyer') {
      onPageChange('buyer-dashboard');
    } else if (data.role === 'supplier') {
      onPageChange('merchant-dashboard');
    }
    console.log('User connected:', data);
  };

  const createMerchantProfileIfNeeded = async (userData: any) => {
    try {
      // Check if merchant profile already exists
      const existingMerchant = await merchantService.getMerchantByUserId(userData.id);
      
      if (!existingMerchant) {
        // Create merchant profile with proper authentication context
        // Wait a bit to ensure the auth session is properly established
        setTimeout(async () => {
          try {
            await authService.createMerchantProfile(userData.id, {
              verification_level: 'basic'
            });
            console.log('Merchant profile created for supplier');
          } catch (error) {
            console.error('Failed to create merchant profile (delayed):', error);
            // If it still fails, the user can create it manually from their dashboard
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to create merchant profile:', error);
      // Don't fail the login process
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUserData(null);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">EthicChain</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {getNavItems().map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            {userData?.role === 'buyer' && (
              <button
                onClick={() => setShowSummarizeModal(true)}
                className="px-3 py-2 text-sm font-medium rounded-md text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 transition-colors duration-200"
              >
                Summarize
              </button>
            )}
            <button
              onClick={() => setShowTransactionModal(true)}
              className="px-3 py-2 text-sm font-medium rounded-md text-purple-700 border border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
            >
              Transactions
            </button>
          </nav>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-md cursor-pointer" title={`Role: ${userData?.role || 'Unknown'}`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700">
                    {userData?.method === 'wallet'
                      ? `${userData.wallet_address?.substring(0, 6)}...${userData.wallet_address?.substring(-4)}`
                      : userData?.email?.substring(0, 15) + (userData?.email?.length > 15 ? '...' : '')
                    }
                  </span>
                  {userData?.role && (
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                      {userData.role}
                    </span>
                  )}
                </div>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                  <User className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleDisconnect}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {getNavItems().map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-200">
            {isConnected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex flex-col">
                    <span className="text-sm text-green-700">
                      {userData?.method === 'wallet'
                        ? `${userData.wallet_address?.substring(0, 10)}...${userData.wallet_address?.substring(-4)}`
                        : userData?.email
                      }
                    </span>
                    {userData?.role && (
                      <span className="text-xs text-gray-500 capitalize">{userData.role}</span>
                    )}
                    {userData?.city && userData?.pincode && (
                      <span className="text-xs text-gray-500">{userData.city}, {userData.pincode}</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={handleDisconnect}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onConnect={handleConnect}
      />

      {showTransactionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-xs relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
              onClick={() => setShowTransactionModal(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-2 text-center">Create Transaction NFT</h2>
            <form
              className="space-y-2"
              onSubmit={e => {
                e.preventDefault();
                setShowTransactionModal(false);
                setShowTransactionNFT(true);
              }}
            >
              <input
                type="text"
                placeholder="Buyer Wallet Address"
                className="w-full border rounded-md px-2 py-1 text-sm"
                value={transactionForm.buyerWallet}
                onChange={e => setTransactionForm({ ...transactionForm, buyerWallet: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Seller Wallet Address"
                className="w-full border rounded-md px-2 py-1 text-sm"
                value={transactionForm.sellerWallet}
                onChange={e => setTransactionForm({ ...transactionForm, sellerWallet: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Product Name"
                className="w-full border rounded-md px-2 py-1 text-sm"
                value={transactionForm.productName}
                onChange={e => setTransactionForm({ ...transactionForm, productName: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-full border rounded-md px-2 py-1 text-sm"
                value={transactionForm.amount}
                onChange={e => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Seller Verification Level"
                className="w-full border rounded-md px-2 py-1 text-sm"
                value={transactionForm.sellerVerificationLevel}
                onChange={e => setTransactionForm({ ...transactionForm, sellerVerificationLevel: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Ethical Score (0-100)"
                className="w-full border rounded-md px-2 py-1 text-sm"
                value={transactionForm.ethicalScore}
                onChange={e => setTransactionForm({ ...transactionForm, ethicalScore: e.target.value })}
                min={0}
                max={100}
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-md font-semibold hover:shadow-lg transition-all duration-300 text-sm"
              >
                Create NFT
              </button>
            </form>
          </div>
        </div>
      )}
      {showTransactionNFT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
              onClick={() => setShowTransactionNFT(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <TransactionNFT
              buyerWallet={transactionForm.buyerWallet}
              sellerWallet={transactionForm.sellerWallet}
              transactionDetails={{
                productName: transactionForm.productName,
                amount: Number(transactionForm.amount),
                sellerVerificationLevel: transactionForm.sellerVerificationLevel,
                ethicalScore: Number(transactionForm.ethicalScore)
              }}
              onNFTCreated={() => setShowTransactionNFT(false)}
            />
          </div>
        </div>
      )}
      {showSummarizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-xs relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
              onClick={() => setShowSummarizeModal(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold mb-2 text-center">Summarize Policy/Terms</h2>
            <form
              className="space-y-2"
              onSubmit={async e => {
                e.preventDefault();
                if (!fileInputRef.current?.files?.[0]) return;
                setIsSummarizing(true);
                setSummary('');
                const file = fileInputRef.current.files[0];
                const text = await file.text();
                try {
                  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer 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'
                    },
                    body: JSON.stringify({
                      model: 'llama3-8b-8192',
                      messages: [
                        { role: 'system', content: 'You are a helpful assistant that summarizes policies and terms and conditions for users.' },
                        { role: 'user', content: `Summarize the following policy/terms and conditions in simple language:\n${text}` }
                      ],
                      max_tokens: 512
                    })
                  });
                  const data = await response.json();
                  setSummary(data.choices?.[0]?.message?.content || 'No summary available.');
                } catch (err) {
                  setSummary('Failed to summarize.');
                }
                setIsSummarizing(false);
              }}
            >
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx,.md,.rtf"
                ref={fileInputRef}
                className="w-full border rounded-md px-2 py-1 text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 rounded-md font-semibold hover:shadow-lg transition-all duration-300 text-sm"
                disabled={isSummarizing}
              >
                {isSummarizing ? 'Summarizing...' : 'Summarize'}
              </button>
            </form>
            {summary && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-800 max-h-40 overflow-y-auto whitespace-pre-line">
                {summary}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;