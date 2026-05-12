import React from 'react';
import { LayoutDashboard, ReceiptText, PieChart, Settings, PlusCircle, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddTransaction: () => void;
}

export default function Layout({ children, activeTab, setActiveTab, onAddTransaction }: LayoutProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
  ];

  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/50 flex flex-col pt-8">
        <div className="px-8 flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center text-brand-dark shadow-lg shadow-emerald-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-white">WealthFlow</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                activeTab === item.id 
                  ? "bg-white/5 text-white border border-white/5" 
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-emerald-500" : "text-slate-500 group-hover:text-slate-400")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 bg-gradient-to-br from-indigo-600/10 to-emerald-500/5 rounded-2xl border border-slate-800/50 mb-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Finance Pro</p>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">Unlock advanced analytics and multi-account sync.</p>
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-all shadow-lg shadow-indigo-600/20">
              Upgrade
            </button>
          </div>
          
          <button 
            onClick={onAddTransaction}
            className="w-full bg-white text-black hover:bg-slate-100 rounded-xl py-3 flex items-center justify-center gap-2 font-bold transition-all shadow-xl shadow-white/5"
          >
            <PlusCircle className="w-5 h-5" />
            Add New
          </button>
        </div>

        <div className="p-4 border-t border-slate-800/50">
           <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-all text-sm font-medium">
             <Settings className="w-5 h-5" />
             Settings
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-page-dark">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
