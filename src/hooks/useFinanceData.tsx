
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './useAuth';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  user_id: string;
}

interface Investment {
  id: string;
  symbol: string;
  shares: number;
  purchase_price: number;
  current_price: number;
  purchase_date: string;
  user_id: string;
}

export const useFinanceData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load data from Supabase
  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Load transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Load investments
      const { data: investmentsData, error: investmentsError } = await supabase
        .from('investments')
        .select('*')
        .order('purchase_date', { ascending: false });

      if (investmentsError) throw investmentsError;

      setTransactions(transactionsData || []);
      setInvestments(investmentsData || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load your financial data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Transaction methods
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add transactions.",
        variant: "destructive",
      });
      return;
    }

    try {
      const transactionWithUserId = {
        ...transaction,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionWithUserId])
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Transaction added successfully.",
      });
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction.",
        variant: "destructive",
      });
    }
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update transactions.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .update(updatedTransaction)
        .eq('id', updatedTransaction.id);

      if (error) throw error;

      setTransactions(prev => 
        prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
      );
      toast({
        title: "Success",
        description: "Transaction updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction.",
        variant: "destructive",
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete transactions.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Success",
        description: "Transaction deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction.",
        variant: "destructive",
      });
    }
  };

  // Investment methods
  const addInvestment = async (investment: Omit<Investment, 'id' | 'user_id'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add investments.",
        variant: "destructive",
      });
      return;
    }

    try {
      const investmentWithUserId = {
        ...investment,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('investments')
        .insert([investmentWithUserId])
        .select()
        .single();

      if (error) throw error;

      setInvestments(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Investment added successfully.",
      });
    } catch (error: any) {
      console.error('Error adding investment:', error);
      toast({
        title: "Error",
        description: "Failed to add investment.",
        variant: "destructive",
      });
    }
  };

  const updateInvestment = async (updatedInvestment: Investment) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update investments.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('investments')
        .update(updatedInvestment)
        .eq('id', updatedInvestment.id);

      if (error) throw error;

      setInvestments(prev => 
        prev.map(i => i.id === updatedInvestment.id ? updatedInvestment : i)
      );
      toast({
        title: "Success",
        description: "Investment updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating investment:', error);
      toast({
        title: "Error",
        description: "Failed to update investment.",
        variant: "destructive",
      });
    }
  };

  const deleteInvestment = async (id: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete investments.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInvestments(prev => prev.filter(i => i.id !== id));
      toast({
        title: "Success",
        description: "Investment deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting investment:', error);
      toast({
        title: "Error",
        description: "Failed to delete investment.",
        variant: "destructive",
      });
    }
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
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    refreshData: loadData
  };
};
