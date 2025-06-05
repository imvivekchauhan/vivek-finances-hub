import React, { useState } from 'react';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';

const InvestmentTracker = () => {
  const { investments, addInvestment, updateInvestment, deleteInvestment, loading } = useFinanceData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    symbol: '',
    shares: '',
    purchase_price: '',
    current_price: '',
    purchase_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const investmentData = {
      ...formData,
      shares: parseFloat(formData.shares),
      purchase_price: parseFloat(formData.purchase_price),
      current_price: parseFloat(formData.current_price),
    };

    if (editingId) {
      await updateInvestment({ ...investmentData, id: editingId, user_id: '' });
      setEditingId(null);
    } else {
      await addInvestment(investmentData);
    }

    setFormData({
      symbol: '',
      shares: '',
      purchase_price: '',
      current_price: '',
      purchase_date: new Date().toISOString().split('T')[0]
    });
    setIsFormOpen(false);
  };

  const handleEdit = (investment: any) => {
    setFormData({
      symbol: investment.symbol,
      shares: investment.shares.toString(),
      purchase_price: investment.purchase_price.toString(),
      current_price: investment.current_price.toString(),
      purchase_date: investment.purchase_date
    });
    setEditingId(investment.id);
    setIsFormOpen(true);
  };

  const calculateGainLoss = (investment: any) => {
    const totalPurchase = investment.shares * investment.purchase_price;
    const currentValue = investment.shares * investment.current_price;
    return currentValue - totalPurchase;
  };

  const calculateGainLossPercentage = (investment: any) => {
    const gainLoss = calculateGainLoss(investment);
    const totalPurchase = investment.shares * investment.purchase_price;
    return (gainLoss / totalPurchase) * 100;
  };

  const totalInvestmentValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.current_price), 0);
  const totalInvestmentCost = investments.reduce((sum, inv) => sum + (inv.shares * inv.purchase_price), 0);
  const totalGainLoss = totalInvestmentValue - totalInvestmentCost;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Investment Portfolio</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-50 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Investment</span>
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="gradient-card rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Investment Value</h3>
          <p className="text-2xl font-bold text-gray-800">${totalInvestmentValue.toLocaleString()}</p>
        </div>
        <div className="gradient-card rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Cost</h3>
          <p className="text-2xl font-bold text-gray-800">${totalInvestmentCost.toLocaleString()}</p>
        </div>
        <div className="gradient-card rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Gain/Loss</h3>
          <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Investment Form */}
      {isFormOpen && (
        <div className="gradient-card rounded-2xl p-6 shadow-xl border border-white/20 animate-slide-up">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Investment' : 'Add New Investment'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Symbol</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., AAPL"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shares</label>
              <input
                type="number"
                step="0.01"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.current_price}
                onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
              <input
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Investment
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingId(null);
                  setFormData({
                    symbol: '',
                    shares: '',
                    purchase_price: '',
                    current_price: '',
                    purchase_date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Investments List */}
      <div className="gradient-card rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Investments</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {investments.map(investment => {
            const gainLoss = calculateGainLoss(investment);
            const gainLossPercentage = calculateGainLossPercentage(investment);
            const currentValue = investment.shares * investment.current_price;
            
            return (
              <div key={investment.id} className="p-4 bg-white rounded-xl shadow-sm border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{investment.symbol}</h4>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(investment)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteInvestment(investment.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Shares</p>
                    <p className="font-semibold">{investment.shares}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Value</p>
                    <p className="font-semibold">${currentValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Gain/Loss</p>
                    <p className={`font-semibold flex items-center ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {gainLoss >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {gainLoss >= 0 ? '+' : ''}${gainLoss.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Percentage</p>
                    <p className={`font-semibold ${gainLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {investments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No investments yet. Add your first investment to track your portfolio!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentTracker;
