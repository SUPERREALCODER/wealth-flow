export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export const CATEGORIES = {
  expense: [
    'Housing',
    'Food',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Travel',
    'Other'
  ],
  income: [
    'Salary',
    'Freelance',
    'Investments',
    'Gifts',
    'Other'
  ]
};
