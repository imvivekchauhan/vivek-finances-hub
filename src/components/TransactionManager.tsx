
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';

const TransactionManager = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, loading } = useFinanceData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'expense' as 'expense' | 'income',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    expense: ['Food', 'Rent', 'Transport', 'Entertainment', 'Personal Care', 'Healthcare', 'Shopping', 'Utilities'],
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Other']
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (editingId) {
      await updateTransaction({ ...transactionData, id: editingId, user_id: '' });
      setEditingId(null);
    } else {
      await addTransaction(transactionData);
    }

    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsFormOpen(false);
  };

  const handleEdit = (transaction: any) => {
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
      date: transaction.date
    });
    setEditingId(transaction.id);
    setIsFormOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

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
        <h2 className="text-2xl font-bold text-white">Transactions</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-50 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Transaction Form */}
      {isFormOpen && (
        <div className="gradient-card rounded-2xl p-6 shadow-xl border border-white/20 animate-slide-up">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Transaction' : 'Add New Transaction'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'expense' | 'income', category: '' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories[formData.type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Transaction description"
                required
              />
            </div>
            
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Transaction
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingId(null);
                  setFormData({
                    type: 'expense',
                    amount: '',
                    category: '',
                    description: '',
                    date: new Date().toISOString().split('T')[0]
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

      {/* Transactions List */}
      <div className="gradient-card rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <DollarSign className={`w-5 h-5 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.category} • {formatDate(transaction.date)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => handleEdit(transaction)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet. Add your first transaction to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionManager;
