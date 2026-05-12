import { Transaction, Budget } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'wealthflow_transactions',
  BUDGETS: 'wealthflow_budgets',
};

export const storage = {
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },
  
  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getBudgets: (): Budget[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return data ? JSON.parse(data) : [];
  },

  saveBudgets: (budgets: Budget[]) => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }
};
