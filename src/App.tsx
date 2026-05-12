/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Transaction, Budget } from './types';
import { storage } from './lib/storage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import BudgetPlanner from './components/BudgetPlanner';
import AddTransactionModal from './components/AddTransactionModal';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [budgets, setBudgets] = React.useState<Budget[]>([]);

  // Load data on mount
  React.useEffect(() => {
    let loadedTransactions = storage.getTransactions();
    let loadedBudgets = storage.getBudgets();
    
    // Seed data if empty
    if (loadedTransactions.length === 0) {
      const seedTransactions: Transaction[] = [
        { id: '1', amount: 5000, type: 'income', category: 'Salary', description: 'Monthly Salary', date: new Date().toISOString() },
        { id: '2', amount: 150, type: 'expense', category: 'Food', description: 'Weekly Groceries', date: new Date().toISOString() },
        { id: '3', amount: 80, type: 'expense', category: 'Entertainment', description: 'Movie Night', date: new Date().toISOString() },
        { id: '4', amount: 1200, type: 'expense', category: 'Housing', description: 'Rent Payment', date: new Date().toISOString() },
        { id: '5', amount: 200, type: 'income', category: 'Freelance', description: 'Logo Design', date: new Date().toISOString() },
      ];
      loadedTransactions = seedTransactions;
      storage.saveTransactions(seedTransactions);
    }

    if (loadedBudgets.length === 0) {
      const seedBudgets: Budget[] = [
        { category: 'Food', limit: 600, spent: 150 },
        { category: 'Housing', limit: 1500, spent: 1200 },
        { category: 'Entertainment', limit: 200, spent: 80 },
      ];
      loadedBudgets = seedBudgets;
      storage.saveBudgets(seedBudgets);
    }

    setTransactions(loadedTransactions);
    setBudgets(loadedBudgets);
  }, []);

  // Sync budgets when transactions change
  React.useEffect(() => {
    if (transactions.length === 0 && budgets.length === 0) return;
    
    const updatedBudgets = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((acc, t) => acc + t.amount, 0);
      return { ...budget, spent };
    });

    if (JSON.stringify(updatedBudgets) !== JSON.stringify(budgets)) {
      setBudgets(updatedBudgets);
      storage.saveBudgets(updatedBudgets);
    }
  }, [transactions]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substring(2, 9),
    };
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    storage.saveTransactions(updatedTransactions);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    storage.saveTransactions(updatedTransactions);
  };

  const handleAddBudget = (category: string, limit: number) => {
    const existingBudgetIndex = budgets.findIndex(b => b.category === category);
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((acc, t) => acc + t.amount, 0);

    let updatedBudgets: Budget[];
    if (existingBudgetIndex >= 0) {
      updatedBudgets = [...budgets];
      updatedBudgets[existingBudgetIndex] = { category, limit, spent };
    } else {
      updatedBudgets = [...budgets, { category, limit, spent }];
    }

    setBudgets(updatedBudgets);
    storage.saveBudgets(updatedBudgets);
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onAddTransaction={() => setIsModalOpen(true)}
    >
      {activeTab === 'dashboard' && <Dashboard transactions={transactions} />}
      {activeTab === 'transactions' && (
        <TransactionList 
          transactions={transactions} 
          onDelete={handleDeleteTransaction} 
        />
      )}
      {activeTab === 'budgets' && (
        <BudgetPlanner 
          budgets={budgets} 
          onAddBudget={handleAddBudget} 
        />
      )}

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTransaction} 
      />
    </Layout>
  );
}
