import React from 'react';
import { X, Plus } from 'lucide-react';
import { CATEGORIES, TransactionType, Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function AddTransactionModal({ isOpen, onClose, onAdd }: AddTransactionModalProps) {
  const [type, setType] = React.useState<TransactionType>('expense');
  const [amount, setAmount] = React.useState('');
  const [category, setCategory] = React.useState(CATEGORIES.expense[0]);
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    onAdd({
      amount: Number(amount),
      type,
      category,
      description,
      date
    });

    // Reset fields
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card-dark rounded-3xl border border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-800/60 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Create Transaction</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Manual Entry Mode</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Type Toggle */}
              <div className="flex bg-brand-dark p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setType('expense');
                    setCategory(CATEGORIES.expense[0]);
                  }}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                    type === 'expense' ? 'bg-white text-black' : 'text-slate-500'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('income');
                    setCategory(CATEGORIES.income[0]);
                  }}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                    type === 'income' ? 'bg-emerald-500 text-black' : 'text-slate-500'
                  }`}
                >
                  Income
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Value (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xl">$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-4 bg-brand-dark/50 border border-slate-800 rounded-2xl focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-2xl font-mono text-white placeholder:text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Classification</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-brand-dark/50 border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm text-slate-300"
                    >
                      {CATEGORIES[type].map(cat => (
                        <option key={cat} value={cat} className="bg-brand-dark">{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Timestamp</label>
                    <input 
                      type="date" 
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 bg-brand-dark/50 border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-xs text-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Reference / Note</label>
                  <input 
                    type="text" 
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Amazon Purchase"
                    className="w-full px-4 py-3 bg-brand-dark/50 border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm text-white placeholder:text-slate-700"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className={cn(
                  "w-full rounded-2xl py-5 font-bold uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95",
                  type === 'expense' ? "bg-white text-black" : "bg-emerald-500 text-black shadow-emerald-500/20"
                )}
              >
                <Plus className="w-5 h-5" />
                Commit {type}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
