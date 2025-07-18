import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import UrlScanner from './components/UrlScanner';
import ReportsPage from './components/ReportsPage';
import MerchantsPage from './components/MerchantsPage';
import VerificationPage from './components/VerificationPage';
import Dashboard from './components/Dashboard';
import BuyerDashboard from './components/BuyerDashboard';
import MerchantDashboard from './components/MerchantDashboard';
import MerchantAnalytics from './components/MerchantAnalytics';
import MerchantProfile from './components/MerchantProfile';
import CheckProduct from './components/CheckProduct';
import VerifiedProduct from './components/VerifiedProduct';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'scanner':
        return <UrlScanner />;
      case 'reports':
        return <ReportsPage />;
      case 'merchants':
        return <MerchantsPage />;
      case 'verify':
        return <VerificationPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'buyer-dashboard':
        return <BuyerDashboard onPageChange={setCurrentPage} />;
      case 'merchant-dashboard':
        return <MerchantDashboard onPageChange={setCurrentPage} />;
      case 'merchant-analytics':
        return <MerchantAnalytics />;
      case 'merchant-profile':
        return <MerchantProfile />;
      case 'verified-product':
        return <VerifiedProduct />;
      case 'check-product':
        return <CheckProduct />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;