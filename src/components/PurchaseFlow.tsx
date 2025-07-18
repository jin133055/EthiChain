import React, { useState } from 'react';
import { ShoppingCart, CreditCard, Shield, Award } from 'lucide-react';
import TransactionNFT from './TransactionNFT';

interface PurchaseFlowProps {
  merchant: {
    name: string;
    verificationLevel: string;
    ethicalScore: number;
    walletAddress: string;
  };
  product: {
    name: string;
    price: number;
    description: string;
  };
  buyerWallet: string;
}

const PurchaseFlow: React.FC<PurchaseFlowProps> = ({ merchant, product, buyerWallet }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [nftCreated, setNftCreated] = useState(false);

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentComplete(true);
      setCurrentStep(3);
    }, 2000);
  };

  const handleNFTCreated = (nftData: any) => {
    setNftCreated(true);
    console.log('NFT Certificate created:', nftData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Purchase</h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seller:</span>
                  <span className="font-medium">{merchant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verification:</span>
                  <span className="font-medium capitalize">{merchant.verificationLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ethical Score:</span>
                  <span className="font-medium text-green-600">{merchant.ethicalScore}/100</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center space-x-2 text-blue-700 mb-3">
                <Award className="h-5 w-5" />
                <span className="font-medium">NFT Certificate Included</span>
              </div>
              <p className="text-blue-600 text-sm">
                This purchase will automatically generate a unique NFT certificate on Algorand blockchain, 
                providing permanent proof of your ethical purchase.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>Proceed to Payment</span>
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{product.name}</span>
                  <span>${product.price}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>NFT Certificate</span>
                  <span>Included</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${product.price}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={paymentComplete}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {paymentComplete ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Complete Purchase</span>
                </>
              )}
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Complete!</h2>
              <p className="text-gray-600">Your order has been confirmed and is being processed.</p>
            </div>

            <TransactionNFT
              buyerWallet={buyerWallet}
              sellerWallet={merchant.walletAddress}
              transactionDetails={{
                productName: product.name,
                amount: product.price,
                sellerVerificationLevel: merchant.verificationLevel,
                ethicalScore: merchant.ethicalScore
              }}
              onNFTCreated={handleNFTCreated}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">Review</span>
          <span className="text-xs text-gray-500">Payment</span>
          <span className="text-xs text-gray-500">Complete</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {renderStep()}
      </div>
    </div>
  );
};

export default PurchaseFlow;