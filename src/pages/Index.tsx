
import React, { useState } from 'react';
import { BarChart3, DollarSign, TrendingUp, Menu, X } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import TransactionManager from '../components/TransactionManager';
import InvestmentTracker from '../components/InvestmentTracker';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'investments', label: 'Investments', icon: TrendingUp }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionManager />;
      case 'investments':
        return <InvestmentTracker />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen gradient-primary">
      <div className="container mx-auto px-4 py-6">
        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-white text-purple-600 p-3 rounded-xl shadow-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block mb-8`}>
          <nav className="bg-white rounded-2xl p-2 shadow-xl inline-flex space-x-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
