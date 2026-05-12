import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion } from 'motion/react';

interface DashboardProps {
  transactions: Transaction[];
}

export default function Dashboard({ transactions }: DashboardProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  // Prepare data for Spending by Category
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.keys(categoryData).map(cat => ({
    name: cat,
    value: categoryData[cat]
  }));

  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Prepare daily data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const barData = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => t.date.startsWith(date));
    return {
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      income: dayTransactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0),
      expense: dayTransactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0),
    };
  });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center sm:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Overview</h2>
          <p className="text-slate-500 mt-1">Real-time update frequency</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Current Balance</p>
          <p className={cn(
            "text-3xl font-bold font-mono tracking-tighter leading-none px-4 py-2 rounded-xl bg-white/5 border border-white/5",
            balance >= 0 ? "text-emerald-400" : "text-rose-400"
          )}>
            {formatCurrency(balance)}
          </p>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Income" 
          value={totalIncome} 
          icon={TrendingUp} 
          color="emerald" 
          delay={0}
        />
        <StatCard 
          label="Total Expenses" 
          value={totalExpenses} 
          icon={TrendingDown} 
          color="rose" 
          delay={0.1}
        />
        <StatCard 
          label="Savings Rate" 
          value={totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0} 
          icon={Wallet} 
          color="indigo" 
          isPercentage
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Activity Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 bg-card-dark p-8 rounded-3xl border border-slate-800/60 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-medium text-white">Financial Trajectory</h3>
              <p className="text-sm text-slate-500">Weekly activity trends</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white/5 text-[10px] text-white rounded-lg border border-white/10 uppercase tracking-widest font-bold">7D</button>
              <button className="px-3 py-1 bg-transparent text-[10px] text-slate-500 rounded-lg uppercase tracking-widest font-bold">1M</button>
              <button className="px-3 py-1 bg-transparent text-[10px] text-slate-500 rounded-lg uppercase tracking-widest font-bold">1Y</button>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis 
                  hide
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ 
                    backgroundColor: '#141417', 
                    borderRadius: '12px', 
                    border: '1px solid #334155', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                    color: '#f8fafc'
                  }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expenses by Category */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 bg-card-dark p-8 rounded-3xl border border-slate-800/60 shadow-sm flex flex-col"
        >
          <div className="mb-8">
            <h3 className="text-xl font-medium text-white">Analytics</h3>
            <p className="text-sm text-slate-500">Expenses by category</p>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#141417', 
                      borderRadius: '12px', 
                      border: '1px solid #334155',
                      color: '#f8fafc' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-500 text-center space-y-2">
                <p>No analytics available.</p>
                <p className="text-xs text-slate-600">Transactions needed to generate insights.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, isPercentage, delay }: any) {
  const colorClasses = {
    emerald: {
      bg: "bg-emerald-500/10 text-emerald-500",
      bar: "bg-emerald-500",
      text: "text-emerald-500"
    },
    rose: {
      bg: "bg-rose-500/10 text-rose-500",
      bar: "bg-rose-500",
      text: "text-rose-500"
    },
    indigo: {
      bg: "bg-indigo-500/10 text-indigo-500",
      bar: "bg-indigo-500",
      text: "text-indigo-500"
    }
  };

  const currentTheme = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card-dark p-6 rounded-3xl border border-slate-800/60 shadow-sm flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-xl", currentTheme.bg)}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn("text-[10px] font-bold uppercase tracking-widest", currentTheme.text)}>
          Live
        </span>
      </div>
      
      <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-semibold text-white font-mono tracking-tight leading-none mb-4">
        {isPercentage ? `${value.toFixed(1)}%` : formatCurrency(value)}
      </h3>

      <div className="flex items-center gap-2">
        <span className={cn("text-[10px] font-bold", currentTheme.bg.split(' ')[1])}>
          {isPercentage ? '+3.2%' : '+12.4%'}
        </span>
        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: isPercentage ? `${value}%` : '65%' }}
            className={cn("h-full rounded-full", currentTheme.bar)}
          />
        </div>
      </div>
    </motion.div>
  );
}
