
import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Wallet, LogOut, User } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';
import { useAuth } from '../hooks/useAuth';
import ExpenseChart from './ExpenseChart';
import InvestmentChart from './InvestmentChart';

const Dashboard = () => {
  const { transactions, investments, summary, loading } = useFinanceData();
  const { user, signOut } = useAuth();

  const StatCard = ({ title, amount, icon: Icon, gradient, isPositive = true }) => (
    <div className="gradient-card rounded-2xl p-6 shadow-xl border border-white/20 animate-fade-in hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : amount < 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {isPositive && amount > 0 ? '+' : ''}{amount < 0 ? '' : ''}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className={`text-2xl font-bold ${isPositive ? 'text-green-700' : amount < 0 ? 'text-red-700' : 'text-gray-800'}`}>
        ${Math.abs(amount).toLocaleString()}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="gradient-card rounded-2xl p-8 shadow-xl border border-white/20 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {user?.user_metadata?.full_name || 'Vivek Chauhan'}
              </h1>
              <p className="text-gray-600">Personal Finance Dashboard</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Income" 
          amount={summary.totalIncome} 
          icon={TrendingUp} 
          gradient="gradient-income"
          isPositive={true}
        />
        <StatCard 
          title="Total Expenses" 
          amount={summary.totalExpenses} 
          icon={TrendingDown} 
          gradient="gradient-expense"
          isPositive={false}
        />
        <StatCard 
          title="Net Balance" 
          amount={summary.netBalance} 
          icon={Wallet} 
          gradient="gradient-investment"
          isPositive={summary.netBalance >= 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="gradient-card rounded-2xl p-6 shadow-xl border border-white/20 animate-fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Expense Categories
          </h3>
          <ExpenseChart transactions={transactions} />
        </div>
        
        <div className="gradient-card rounded-2xl p-6 shadow-xl border border-white/20 animate-fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Investment Portfolio
          </h3>
          <InvestmentChart investments={investments} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
