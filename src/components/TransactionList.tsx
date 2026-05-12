import React from 'react';
import { Transaction, CATEGORIES } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { format } from 'date-fns';
import { Search, Filter, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterType, setFilterType] = React.useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Transactions</h2>
          <p className="text-slate-500 mt-1">Review your recent financial activity.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all w-full md:w-64 text-sm text-white placeholder:text-slate-600"
            />
          </div>
          
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-white/5 border border-slate-800 border-r-8 border-r-transparent rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-sm cursor-pointer text-slate-300"
          >
            <option value="all" className="bg-brand-dark">All</option>
            <option value="income" className="bg-brand-dark">Income</option>
            <option value="expense" className="bg-brand-dark">Expense</option>
          </select>
        </div>
      </header>

      <div className="bg-card-dark rounded-3xl border border-slate-800 shadow-sm overflow-hidden p-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Amount</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              <AnimatePresence mode="popLayout">
                {filteredTransactions.map((t) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={t.id} 
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-5 whitespace-nowrap text-xs text-slate-500 font-mono">
                      {format(new Date(t.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-tight bg-slate-800 text-slate-300">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-white font-medium">
                      {t.description}
                    </td>
                    <td className={cn(
                      "px-6 py-5 whitespace-nowrap text-sm text-right font-bold font-mono",
                      t.type === 'income' ? "text-emerald-400" : "text-white"
                    )}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <button 
                        onClick={() => onDelete(t.id)}
                        className="text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-600 text-sm italic">
                    No transactions recorded for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
