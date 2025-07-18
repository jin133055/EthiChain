
import React from 'react';
import { Shield, Search, Users, Award, Globe } from 'lucide-react';
import TypewriterText from './TypewriterText';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const features = [
    {
      icon: Shield,
      title: 'Immutable Scam Reports',
      description: 'Report unethical stores and practices with blockchain-backed evidence storage that cannot be altered or deleted.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Search,
      title: 'AI-Powered Detection',
      description: 'Advanced AI analyzes URLs, reviews, and content to identify scams, fake products, and unethical practices.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Users,
      title: 'Decentralized Trust Scoring',
      description: 'Community-driven reputation system where verified users vote on merchant legitimacy and trustworthiness.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Award,
      title: 'NFT Certificates',
      description: 'Verified merchants receive tamper-proof NFT certificates proving their ethical sourcing and business practices.',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center text-white" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/dropshipping1.png')`}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40">
          <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
  <TypewriterText
    text="Protect Your Supply Chain with EthicChain"
    speed={50}
    className="text-white"
  />
</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Blockchain-powered transparency and AI-driven detection to ensure ethical sourcing and prevent consumer fraud
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onPageChange('scanner')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Scan URL Now</span>
              </button>
              <button
                onClick={() => onPageChange('verify')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Shield className="h-5 w-5" />
                <span>Get Verified</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Revolutionary Features for Ethical Commerce
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combining blockchain technology with artificial intelligence to create the world's most comprehensive ethical sourcing platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${feature.color} flex-shrink-0`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How EthicChain Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to verify ethical sourcing and protect consumers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Scan & Report</h3>
              <p className="text-gray-600">
                Use our AI-powered scanner to analyze URLs, detect scams, and report unethical practices with blockchain-backed evidence.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Community Verification</h3>
              <p className="text-gray-600">
                Verified users vote on merchant legitimacy, building a decentralized trust score that reflects true community consensus.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Certified</h3>
              <p className="text-gray-600">
                Ethical merchants receive NFT certificates proving their commitment to fair trade and sustainable practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Globe className="h-16 w-16 mx-auto mb-6 text-green-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Ethical Commerce Revolution
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Be part of a global movement towards transparency, fairness, and ethical business practices. Together, we can build a more trustworthy digital marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onPageChange('reports')}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200"
            >
              Start Reporting
            </button>
            <button
              onClick={() => onPageChange('merchants')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200"
            >
              Browse Verified Merchants
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;