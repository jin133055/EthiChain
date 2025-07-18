import React from 'react';
import { ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const FlashSaleScams: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          How Scammers Exploit Flash Sales – Stay Safe with EthicChain
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Fake deals. Fake websites. Real losses. Here's how scammers thrive during events like Prime Day — and how EthicChain protects you.
        </p>

        {/* Image or Banner */}
        <img
          src="/images/flash-sale-scam.jpg" // Replace with your asset
          alt="Flash Sale Scams"
          className="w-full rounded-lg mb-10"
        />

        {/* Problem Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-red-600 flex items-center mb-2">
            <ShieldAlert className="w-6 h-6 mr-2" />
            Scammers Love Flash Sales
          </h2>
          <p className="text-gray-700 mb-4">
            Events like Prime Day, Diwali Dhamaka, or Black Friday are a goldmine for scammers. They clone real brand sites, run fake ads, and offer irresistible discounts on non-existent products.
          </p>
          <ul className="list-disc ml-6 text-gray-600">
            <li>Lookalike URLs (e.g., amaz0n-deal.in)</li>
            <li>Fake product pages with AI-generated images</li>
            <li>No refund policies or contact details</li>
          </ul>
        </div>

        {/* How EthicChain Helps */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-green-600 flex items-center mb-2">
            <CheckCircle className="w-6 h-6 mr-2" />
            EthicChain to the Rescue
          </h2>
          <p className="text-gray-700 mb-4">
            EthicChain uses blockchain and AI to analyze product listings, verify sellers, and flag suspicious activity — so you don’t fall for too-good-to-be-true offers.
          </p>
          <ul className="list-disc ml-6 text-gray-600">
            <li>AI scam detection using image/text analysis</li>
            <li>Seller and product verification history on-chain</li>
            <li>Community-flagged scam reports</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-xl font-semibold mb-4 text-gray-800">
            Don’t just shop smart — shop safe with EthicChain.
          </p>
          <Link href="/scan">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition">
              Scan a Product or Seller Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleScams;
