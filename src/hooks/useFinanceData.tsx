
import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_transactions',
  INVESTMENTS: 'finance_investments'
};

export const useFinanceData = () => {
  const [transactions, setTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const savedInvestments = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments));
    }
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  // Save investments to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));
  }, [investments]);

  // Transaction methods
  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Investment methods
  const addInvestment = (investment) => {
    setInvestments(prev => [investment, ...prev]);
  };

  const updateInvestment = (updatedInvestment) => {
    setInvestments(prev => 
      prev.map(i => i.id === updatedInvestment.id ? updatedInvestment : i)
    );
  };

  const deleteInvestment = (id) => {
    setInvestments(prev => prev.filter(i => i.id !== id));
  };

  // Calculate summary
  const summary = {
    totalIncome: transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    get netBalance() {
      return this.totalIncome - this.totalExpenses;
    }
  };

  return {
    transactions,
    investments,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addInvestment,
    updateInvestment,
    deleteInvestment
  };
};
