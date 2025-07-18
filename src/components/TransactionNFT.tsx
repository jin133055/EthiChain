import React, { useState } from 'react';
import { Award, Download, ExternalLink, CheckCircle, Clock, Shield } from 'lucide-react';
import { createTransactionCertificate } from '../lib/algorand';

interface TransactionNFTProps {
  buyerWallet: string;
  sellerWallet: string;
  transactionDetails: {
    productName: string;
    amount: number;
    sellerVerificationLevel: string;
    ethicalScore: number;
  };
  onNFTCreated?: (nftData: any) => void;
}

const TransactionNFT: React.FC<TransactionNFTProps> = ({
  buyerWallet,
  sellerWallet,
  transactionDetails,
  onNFTCreated
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [nftData, setNftData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateNFT = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const result = await createTransactionCertificate(
        buyerWallet,
        sellerWallet,
        transactionDetails
      );

      if (result.success) {
        setNftData(result);
        onNFTCreated?.(result);
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create transaction NFT');
    } finally {
      setIsCreating(false);
    }
  };

  if (nftData) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mb-4">
            <Award className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Transaction Certificate Created!</h3>
          <p className="text-purple-600 font-medium">Your purchase has been immortalized on Algorand blockchain</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-600">NFT Asset ID</span>
              <p className="font-mono text-lg font-bold text-gray-900">#{nftData.nftId}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Transaction ID</span>
              <p className="font-mono text-sm text-gray-700 break-all">{nftData.transactionId}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Product:</span>
              <span className="font-medium">{transactionDetails.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${transactionDetails.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ethical Score:</span>
              <span className="font-medium text-green-600">{transactionDetails.ethicalScore}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seller Verification:</span>
              <span className="font-medium capitalize">{transactionDetails.sellerVerificationLevel}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.open(nftData.certificateUrl, '_blank')}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <ExternalLink className="h-5 w-5" />
            <span>View Certificate</span>
          </button>
          <button
            onClick={() => {
              const data = JSON.stringify(nftData, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `ethicchain-certificate-${nftData.nftId}.json`;
              a.click();
            }}
            className="flex-1 border-2 border-purple-300 text-purple-700 py-3 px-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download</span>
          </button>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Certificate Benefits:</span>
          </div>
          <ul className="mt-2 text-sm text-green-600 space-y-1">
            <li>• Permanent proof of ethical purchase</li>
            <li>• Transferable ownership record</li>
            <li>• Verifiable on Algorand blockchain</li>
            <li>• Can be used for warranty claims</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-200 max-w-xs mx-auto">
      <div className="text-center mb-3">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl mb-2">
          <Award className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Create Transaction Certificate</h3>
        <p className="text-xs text-gray-600">Generate a unique NFT certificate for this ethical purchase</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Transaction Details</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Product:</span>
            <span className="font-medium">{transactionDetails.productName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">${transactionDetails.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Seller Verification:</span>
            <span className="font-medium capitalize">{transactionDetails.sellerVerificationLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ethical Score:</span>
            <span className="font-medium text-green-600">{transactionDetails.ethicalScore}/100</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-3 mb-3">
        <div className="flex items-center space-x-1 text-blue-700 mb-1 text-xs">
          <Shield className="h-4 w-4" />
          <span className="font-medium">Algorand NFT Certificate</span>
        </div>
        <ul className="text-xs text-blue-600 space-y-0.5">
          <li>• Immutable proof of ethical purchase</li>
          <li>• Low-cost minting (~$0.0002)</li>
          <li>• Carbon-negative blockchain</li>
          <li>• Instant finality (3.3 seconds)</li>
        </ul>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={handleCreateNFT}
        disabled={isCreating}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-md font-bold text-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isCreating ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Creating NFT...</span>
          </>
        ) : (
          <>
            <Award className="h-4 w-4" />
            <span>Create NFT Certificate</span>
          </>
        )}
      </button>

      <p className="text-[10px] text-gray-400 text-center mt-2">
        By creating this certificate, you agree to mint an NFT on the Algorand blockchain. Transaction fees apply (~0.001 ALGO).
      </p>
    </div>
  );
};

export default TransactionNFT;