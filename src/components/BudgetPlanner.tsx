import React from 'react';
import { Budget, CATEGORIES } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Plus, Target, AlertCircle, PieChart } from 'lucide-react';

interface BudgetPlannerProps {
  budgets: Budget[];
  onAddBudget: (category: string, limit: number) => void;
}

export default function BudgetPlanner({ budgets, onAddBudget }: BudgetPlannerProps) {
  const [showForm, setShowForm] = React.useState(false);
  const [newLimit, setNewLimit] = React.useState('');
  const [newCategory, setNewCategory] = React.useState(CATEGORIES.expense[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLimit || isNaN(Number(newLimit))) return;
    onAddBudget(newCategory, Number(newLimit));
    setNewLimit('');
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Budgets</h2>
          <p className="text-slate-500 mt-1">Strategic allocation of resources.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-white/5 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Set Allocation'}
        </button>
      </header>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-card-dark p-8 rounded-3xl border border-slate-800 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <select 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-slate-700 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-slate-300"
              >
                {CATEGORIES.expense.map(cat => (
                  <option key={cat} value={cat} className="bg-brand-dark">{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Limit</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                <input 
                  type="number"
                  placeholder="0.00"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-slate-700 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-white font-mono"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all shadow-lg active:scale-95"
            >
              Set Budget
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {budgets.map((budget) => {
          const percent = Math.min((budget.spent / budget.limit) * 100, 100);
          const isOver = budget.spent > budget.limit;

          return (
            <motion.div 
              layout
              key={budget.category}
              className="bg-card-dark p-8 rounded-3xl border border-slate-800 shadow-sm space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    isOver ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                  )}>
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{budget.category}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">Allocation Goal</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Spent</p>
                  <p className={cn("font-bold text-xl font-mono tracking-tighter", isOver ? "text-rose-500" : "text-white")}>
                    {formatCurrency(budget.spent)} 
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">of {formatCurrency(budget.limit)} limit</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                    className={cn(
                      "h-full rounded-full transition-colors",
                      isOver ? "bg-rose-500" : percent > 85 ? "bg-amber-500" : "bg-emerald-500"
                    )}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isOver ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                    )} />
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", percent > 85 ? "text-amber-500" : "text-slate-500")}>
                      {percent.toFixed(0)}% Utilized
                    </span>
                  </div>
                  {isOver && (
                    <span className="flex items-center gap-1.5 text-rose-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-rose-500/10 rounded-md border border-rose-500/20">
                      <AlertCircle className="w-3 h-3" />
                      Critical
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {budgets.length === 0 && !showForm && (
          <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-3xl border border-dashed border-slate-800">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-700">
              <PieChart className="w-8 h-8" />
            </div>
            <h4 className="text-white font-medium mb-1">No Budget Targets</h4>
            <p className="text-slate-500 text-sm mb-6">Start tracking your spending efficiency by setting limits.</p>
            <button 
              onClick={() => setShowForm(true)}
              className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors text-sm uppercase tracking-widest"
            >
              Initialize First Budget
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
