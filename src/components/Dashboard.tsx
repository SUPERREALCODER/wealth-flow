import React from 'react';
import { Transaction, Budget, CATEGORIES } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { 
  Cpu, 
  Terminal, 
  Send, 
  History, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Database,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  Layers,
  TrendingUp,
  Percent,
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  Tooltip,
  XAxis
} from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onModifyBudget: (category: string, limit: number) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'core';
  text: string;
  timestamp: string;
  isAlert?: boolean;
}

interface TerminalLog {
  timestamp: string;
  type: 'INFO' | 'REASONING' | 'TOOL_CALL' | 'OBSERVATION' | 'ALERT';
  message: string;
}

export default function Dashboard({ transactions, budgets, onAddTransaction, onModifyBudget }: DashboardProps) {
  const [inputText, setInputText] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'welcome',
      sender: 'core',
      text: "**WealthFlow Financial Intelligence Core online.**\n\nTemporal Alignment Anchor: **Year 2026**.\nLocal-first secure sandbox initialized.\n\nType updates or command statements (e.g. *'I spent $120 on server hosting'* or *'Set groceries budget to $400'*) to directly program the secure clientside ledger.",
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }
  ]);
  const [terminalLogs, setTerminalLogs] = React.useState<TerminalLog[]>([
    {
      timestamp: new Date().toISOString(),
      type: 'INFO',
      message: 'SYSTEM_BOOT: WealthFlow Intelligence Node active on secure container interface'
    },
    {
      timestamp: new Date().toISOString(),
      type: 'INFO',
      message: `LEDGER_SYNCHRONIZATION: Local db check. Read ${transactions.length} records, ${budgets.length} ceiling rules.`
    }
  ]);
  const [isThinking, setIsThinking] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const terminalEndRef = React.useRef<HTMLDivElement>(null);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Aggregate stats calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  const initialCheckingSeed = 15420.00;
  const initialCreditSeed = 2500.00;

  // Account balances driven by ledger entries
  const currentChecking = initialCheckingSeed + (totalIncome * 0.70) - (totalExpenses * 0.70);
  const currentCredit = initialCreditSeed + (totalIncome * 0.30) - (totalExpenses * 0.30);

  const calculateSavingsRate = (inc: number, exp: number) => {
    return inc > 0 ? ((inc - exp) / inc) * 100 : 0;
  };

  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);

  const addTerminalLog = (type: TerminalLog['type'], message: string) => {
    setTerminalLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      type,
      message
    }]);
  };

  const handleSend = (textToSend?: string) => {
    const rawInput = textToSend || inputText;
    if (!rawInput.trim()) return;

    // Automatically expand to show ReAct logs and ledger results
    setIsExpanded(true);

    const userMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: rawInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsThinking(true);

    addTerminalLog('INFO', `INGESTION_PAYLOAD: "${rawInput}"`);

    // Simulate Agentic ReAct Process
    setTimeout(() => {
      processAgentQuery(rawInput);
    }, 1000);
  };

  const processAgentQuery = (input: string) => {
    const text = input.toLowerCase();
    
    // Step 1: Perceive and Reason
    addTerminalLog('REASONING', `SEMANTIC_DECOMPOSITION: Parsing natural currency metrics and semantic intent vector.`);

    // Extract potential amount
    const amountMatch = text.match(/\$?(\d+(\.\d{1,2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : null;

    // Detect Type
    let type: 'income' | 'expense' = 'expense';
    if (
      text.includes('income') || 
      text.includes('salary') || 
      text.includes('earn') || 
      text.includes('receive') || 
      text.includes('freelance') || 
      text.includes('dividend') || 
      text.includes('+') ||
      text.includes('paycheck')
    ) {
      type = 'income';
    }

    // Modern taxonomical dictionary
    const categoryMapping: { [key: string]: string } = {
      'housing': 'Housing', 'rent': 'Housing', 'mortgage': 'Housing',
      'groceries': 'Food', 'food': 'Food', 'restaurant': 'Food', 'lunch': 'Food', 'dinner': 'Food', 'eat': 'Food', 'cafe': 'Food',
      'uber': 'Transportation', 'taxi': 'Transportation', 'gas': 'Transportation', 'metro': 'Transportation', 'bus': 'Transportation', 'car': 'Transportation',
      'utilities': 'Utilities', 'power': 'Utilities', 'water': 'Utilities', 'electricity': 'Utilities', 'bill': 'Utilities', 'infrastructure': 'Utilities', 'hosting': 'Utilities', 'server': 'Utilities', 'saas': 'Utilities', 'vps': 'Utilities',
      'entertainment': 'Entertainment', 'movie': 'Entertainment', 'games': 'Entertainment', 'netflix': 'Entertainment', 'concert': 'Entertainment',
      'health': 'Healthcare', 'doctor': 'Healthcare', 'meds': 'Healthcare', 'pharmacy': 'Healthcare',
      'shopping': 'Shopping', 'amazon': 'Shopping', 'clothes': 'Shopping', 'gadget': 'Shopping',
      'travel': 'Travel', 'flight': 'Travel', 'hotel': 'Travel', 'vacation': 'Travel',
      'salary': 'Salary', 'freelance': 'Freelance', 'gig': 'Freelance', 'dividend': 'Investments'
    };

    let matchedCategory = 'Other';
    for (const key in categoryMapping) {
      if (text.includes(key)) {
        matchedCategory = categoryMapping[key];
        break;
      }
    }

    // Check for Set Budget commands
    const isBudgetCommand = text.includes('budget') && (text.includes('set') || text.includes('change') || text.includes('modify') || text.includes('limit') || text.includes('ceiling'));

    if (isBudgetCommand && amount) {
      let budgetCat = 'Other';
      for (const cat of CATEGORIES.expense) {
        if (text.includes(cat.toLowerCase())) {
          budgetCat = cat;
          break;
        }
      }
      if (budgetCat === 'Other' && matchedCategory !== 'Other' && CATEGORIES.expense.includes(matchedCategory)) {
        budgetCat = matchedCategory;
      }

      addTerminalLog('REASONING', `IDENTIFIED_OPERATION: Mutation of ceiling rule. categoryId: "${budgetCat}", target: $${amount}.`);
      addTerminalLog('TOOL_CALL', `update_budget_ceiling(categoryId: "${budgetCat}", limit: ${amount})`);

      // Trigger mutation
      onModifyBudget(budgetCat, amount);

      setTimeout(() => {
        addTerminalLog('OBSERVATION', `Ledger constraint recomputed. "${budgetCat}" ceiling set to $${amount.toFixed(2)}.`);
        
        let subSpent = 0;
        const b = budgets.find(x => x.category === budgetCat);
        if (b) subSpent = b.spent;

        const rateStr = savingsRate.toFixed(1);

        const coreMsg: Message = {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'core',
          text: `**BUDGET MUTATION ENGAGED**\n[update_budget_ceiling] Committed successfully.\n\n- **Target Category**: **${budgetCat}**\n- **New Metric Limit**: **${formatCurrency(amount)}**\n- **Realtime Utilization**: **${((subSpent / amount) * 100).toFixed(1)}%** (${formatCurrency(subSpent)} / ${formatCurrency(amount)})\n- **Savings Goal Cohesion**: Allocation keeps current savings trajectory steady at **${rateStr}%**.`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, coreMsg]);
        setIsThinking(false);
      }, 600);

      return;
    }

    if (amount) {
      let description = input.replace(/\$?(\d+(\.\d{1,2})?)/, '').replace(/spent|received|earned|paid|for|on/g, '').trim();
      description = description.charAt(0).toUpperCase() + description.slice(1);
      if (!description) {
        description = type === 'expense' ? `Expense: ${matchedCategory}` : `Income: ${matchedCategory}`;
      }

      // Mutual accounts assignment
      let accountId = "checking_01";
      let accountName = "Vault-Checking-7740";
      let accountClass = "Liquid Asset";
      
      const liabilitySignals = ["infrastructure", "hosting", "server", "saas", "api", "cloud", "vps"];
      const isLiabilityProfile = liabilitySignals.some(s => text.includes(s));

      if (isLiabilityProfile) {
        accountId = "credit_01";
        accountName = "Operating-Credit-8890";
        accountClass = "Credit Overdraft System";
        addTerminalLog('INFO', `ROUTING: Profile signals corporate operating vector. Mapping to liability ledger.`);
      }

      const txRef = "TX-2026-" + Math.random().toString(36).substring(3, 8).toUpperCase();

      addTerminalLog('REASONING', `IDENTIFIED_OPERATION: Transaction commitment pipeline. Src: "${accountName}", referenceId: "${txRef}".`);
      addTerminalLog('TOOL_CALL', `write_transaction(amount: ${amount}, type: "${type}", description: "${description}", accountId: "${accountId}", referenceId: "${txRef}")`);

      // Trigger mutation
      onAddTransaction({
        amount,
        type,
        category: matchedCategory,
        description,
        date: new Date().toISOString()
      });

      // Calculate upcoming metrics
      const nextInc = totalIncome + (type === 'income' ? amount : 0);
      const nextExp = totalExpenses + (type === 'expense' ? amount : 0);
      const nextRate = calculateSavingsRate(nextInc, nextExp);

      let deltaAccountBalance = 0;
      let alertInfo = "";
      let isAlert = false;

      if (type === 'expense') {
        if (accountId === "checking_01") {
          deltaAccountBalance = currentChecking - amount;
          if (deltaAccountBalance < 0) {
            isAlert = true;
            alertInfo = `\n\n⚠️ **CRITICAL SECURE ALERT**: Liquid balance fell to **${formatCurrency(deltaAccountBalance)}**! Cash reserve exhaust detected. Immediate capital transfer recommended.`;
            addTerminalLog('ALERT', `LIQUIDITY_SHOCK: Vault checking has recorded an overdraft state: ${formatCurrency(deltaAccountBalance)}.`);
          }
        } else {
          deltaAccountBalance = currentCredit - amount;
          if (deltaAccountBalance < 0) {
            alertInfo = `\n\nℹ️ **Advisory Info**: Credit billing vector operating in debit buffer range. Liquidity fallback stable.`;
            addTerminalLog('INFO', `DEBT_UTILIZATION: Credit line buffer active. Dynamic balance representing liability.`);
          }
        }
      } else {
        deltaAccountBalance = accountId === "checking_01" ? currentChecking + amount : currentCredit + amount;
      }

      setTimeout(() => {
        addTerminalLog('OBSERVATION', `Ledger committed successfully via cryptographic signet. UUID Verification: ${txRef}`);
        
        let customWarning = "";
        let budgetTarget = budgets.find(b => b.category === matchedCategory);

        if (type === 'expense' && budgetTarget) {
          const potentialSpent = budgetTarget.spent + amount;
          const utilizationPercent = (potentialSpent / budgetTarget.limit) * 100;
          
          if (utilizationPercent >= 90) {
            isAlert = true;
            addTerminalLog('ALERT', `THRESHOLD_WARNING: Category "${matchedCategory}" operating in CRITICAL capacity: ${utilizationPercent.toFixed(1)}%.`);
            customWarning = `\n\n⚠️ **CRITICAL ALLOCATION BREACH RISK**: "${matchedCategory}" spending ceiling approaching threshold at **${utilizationPercent.toFixed(1)}%**. Committed ${formatCurrency(potentialSpent)} of total ${formatCurrency(budgetTarget.limit)} constraints.`;
          } else if (utilizationPercent >= 75) {
            addTerminalLog('ALERT', `THRESHOLD_APPROACHING: Category "${matchedCategory}" is operating in advisor buffer range at ${utilizationPercent.toFixed(0)}%.`);
            customWarning = `\n\nℹ️ **Allocation Limit Advisory**: "${matchedCategory}" utilization at **${utilizationPercent.toFixed(0)}%**. Safe margin: **${formatCurrency(budgetTarget.limit - potentialSpent)}** remaining.`;
          }
        }

        const consolidatedLogs = `${alertInfo || ''}${customWarning || ''}`;

        const coreMsg: Message = {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'core',
          text: `**LEDGER ACTION SIGNED**\n[write_transaction] Committed to storage array.\n\n- **Target Ledger**: **${accountName}** (${accountId}) [${accountClass}]\n- **Calculated Balance post-execution**: **${formatCurrency(deltaAccountBalance)}**\n- **Savings Rate Vector Impact**: **${savingsRate.toFixed(1)}%** → **${nextRate.toFixed(1)}%** (Delta: **${(nextRate - savingsRate).toFixed(1)}%**)\n- **Vibe Index**: Cleared *"${description}"* of **${formatCurrency(amount)}** under **${matchedCategory}**.${consolidatedLogs}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          isAlert
        };
        setMessages(prev => [...prev, coreMsg]);
        setIsThinking(false);
      }, 700);

    } else {
      addTerminalLog('REASONING', `SEMANTIC_EVALUATION: Statement parsed as descriptive inquiry. Aggregating multi-vector summary.`);
      addTerminalLog('TOOL_CALL', `fetch_ledger_state(timeframe: "7d")`);

      setTimeout(() => {
        addTerminalLog('OBSERVATION', `Ledger scan compiled successfully. Read dynamic balance parameters.`);
        
        const coreMsg: Message = {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'core',
          text: `**WEALTHFLOW DIAGNOSTICS REPORT**\n[fetch_ledger_state] Secured cache retrieved.\n\n- **Overall Net Wealth**: **${formatCurrency(balance)}**\n- **Live Calculated Savings Rate**: **${savingsRate.toFixed(2)}%**\n- **Vault Assets**: \n  - Checking Core: **${formatCurrency(currentChecking)}**\n  - Credit Backup: **${formatCurrency(currentCredit)}**\n- **Ceilings Monitor**: Managing **${budgets.length}** tactical expenditure targets.\n\n*Awaiting further natural ledger instructions or allocation overrides.*`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, coreMsg]);
        setIsThinking(false);
      }, 800);
    }
  };

  const suggestions = [
    "I spent $120 on server infrastructure",
    "Received $1400 freelance income",
    "Set Food budget ceiling to $450",
    "Show active ledger snapshot"
  ];

  // Helper chart data
  const chartData = transactions
    .slice()
    .reverse()
    .reduce((acc: any[], current) => {
      const dateStr = new Date(current.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const lastVal = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      const change = current.type === 'income' ? current.amount : -current.amount;
      acc.push({
        date: dateStr,
        balance: lastVal + change,
        amount: current.amount,
        type: current.type,
        desc: current.description
      });
      return acc;
    }, []);

  if (!isExpanded) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-8rem)] justify-between py-6">
        {/* Top Status Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-md border border-[#10B981]/25">
                Financial Core Active
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 text-xs bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] text-slate-300 px-4 py-2 rounded-xl transition-all font-sans cursor-pointer hover:scale-102 active:scale-98"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            Open Analytics Grid
          </button>
        </div>

        {/* Dynamic Holographic AI Orb Centerpiece replicating the exact visual */}
        <div className="flex-1 flex flex-col items-center justify-center py-10 relative select-none">
          {/* Ambient background rays */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Interactive Glowing Orb Assembly */}
          <div className="relative w-[340px] h-[340px] flex items-center justify-center animate-orb-float">
            {/* Outer crisp bright white glow ring (the major white bezel from image) */}
            <div className="absolute w-[320px] h-[320px] rounded-full border border-white shadow-[0_0_50px_rgba(255,255,255,0.7),_inset_0_0_30px_rgba(255,255,255,0.4)] animate-orb-spin" />
            
            {/* Secondary cyan glow ring animating opposite */}
            <div className="absolute w-[320px] h-[320px] rounded-full border border-cyan-400/25 blur-[1.5px] animate-orb-spin-rev" />

            {/* Micro dashed telemetry ring */}
            <div className="absolute w-[350px] h-[350px] border border-dashed border-white/[0.06] rounded-full animate-orb-spin-rev" />

            {/* Inner fluid liquid-like floating plasma gradient Core */}
            <div className="absolute w-[160px] h-[160px] blur-2xl opacity-90 saturate-[1.6] animate-orb-pulse pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-sky-300 to-indigo-600 animate-blob-morph rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 animate-blob-morph-alt rounded-full mix-blend-overlay opacity-85" />
              <div className="absolute inset-4 bg-white/45 blur-xl rounded-full" />
            </div>

            {/* Central Typography glass capsule matching input image reference */}
            <div className="z-10 px-6 py-2.5 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.85),_0_0_15px_rgba(255,255,255,0.05)] max-w-[280px] text-center transform transition duration-300 hover:scale-105 active:scale-95 cursor-default">
              <p className="font-serif italic text-white tracking-wide text-sm md:text-base leading-relaxed antialiased">
                You just tell it what you want.
              </p>
            </div>
          </div>
        </div>

        {/* Luxury Prompter and Suggestions */}
        <div className="max-w-xl w-full mx-auto space-y-6">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="relative group bg-[#0A0A0C]/80 border border-white/10 focus-within:border-emerald-500/50 rounded-2xl p-1.5 transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.6)] focus-within:shadow-[0_0_35px_rgba(16,185,129,0.12)] flex items-center"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Instruct the financial oracle: 'spent $45 on dinners'..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none placeholder:text-slate-500 font-sans"
            />
            <button 
              type="submit" 
              className="bg-white hover:bg-slate-100 text-[#070709] h-11 px-5 rounded-xl transition-all font-bold cursor-pointer hover:shadow-lg active:scale-95 flex items-center justify-center gap-1.5 text-xs tracking-wider"
            >
              <Send className="w-3.5 h-3.5" />
              SEND
            </button>
          </form>

          {/* Core Prompt suggestions */}
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {suggestions.map((suggestion) => (
              <button 
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="text-[10px] md:text-[11px] font-sans bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] text-slate-400 hover:text-white px-3.5 py-2 -translate-y-0 rounded-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Minimal footer metadata */}
          <div className="text-center pt-4 select-none">
            <span className="text-[9px] font-mono tracking-widest text-slate-600 block uppercase">
              DEEP FINANCE ORACLE SECURE HARDWARE INTENSITY LAYER
            </span>
            <span className="text-[8px] font-mono tracking-wider text-slate-700 mt-1 block">
              LOCAL CLIENT CONSOLE • CONSTRAINED STORAGE ACCRUAL • 2026 ACTIVE
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Upper Sub-header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-md border border-[#10B981]/20">
              Oracle Engine Node Secure
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1.5">Autonomous Agent Cockpit</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Dynamic ReAct reasoning system managing encrypted clientside state.
          </p>
        </div>
        <div className="text-right flex items-center md:items-end gap-4">
          <button 
            onClick={() => setIsExpanded(false)}
            className="flex items-center gap-2 text-xs bg-white/[0.03] border border-white/5 hover:border-slate-800 hover:bg-white/[0.06] text-slate-350 hover:text-white px-4 py-2 rounded-xl transition-all font-medium font-sans cursor-pointer h-10"
          >
            <Cpu className="w-4 h-4 text-sky-400" />
            Minimize to Orb
          </button>

          <div className="bg-white/[0.02] border border-white/[0.05] px-4 py-1.5 rounded-xl text-left min-h-[40px] flex flex-col justify-center">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">Calculated Assets</span>
            <span className={cn(
              "text-sm font-bold font-mono tracking-tight",
              balance >= 0 ? "text-emerald-400" : "text-rose-400"
            )}>
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Deep Agent Intelligence Core (8 Columns) */}
        <div className="xl:col-span-12 xl:grid xl:grid-cols-12 gap-8 space-y-6 xl:space-y-0">
          <div className="xl:col-span-7 space-y-6">
            {/* Chat Console */}
            <div className="bg-[#0C0C0F] border border-slate-850 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
              <div className="p-4 bg-[#09090C] border-b border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Miniature beautiful glowing live orb */}
                  <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 rounded-full border border-white/30 animate-orb-spin" />
                    <div className="absolute w-2.5 h-2.5 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-full blur-[1px] animate-orb-pulse" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E4E4E5]">
                    Quantum Agent Console
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-500/70 border border-emerald-500/10 bg-emerald-500/5 px-2 py-0.5 rounded-md">
                  2026_ACTIVE
                </span>
              </div>

              {/* Chat Flow */}
              <div className="h-[430px] overflow-y-auto p-6 space-y-6 scroll-smooth bg-gradient-to-b from-[#09090C] to-[#050507]">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', duration: 0.4 }}
                      className={cn(
                        "flex flex-col max-w-[85%] rounded-2xl p-4 text-sm font-sans line-clamp-none whitespace-pre-wrap leading-relaxed shadow-lg",
                        msg.sender === 'user' 
                          ? "ml-auto bg-gradient-to-r from-white to-slate-100 text-[#0c0c0e] font-medium rounded-tr-none px-5 py-3.5" 
                          : msg.isAlert 
                            ? "bg-rose-500/[0.04] border border-rose-500/20 text-slate-200 rounded-tl-none font-sans" 
                            : "bg-white/[0.02] border border-white/[0.05] text-slate-300 rounded-tl-none font-sans"
                      )}
                    >
                      <p className="whitespace-pre-line text-sm leading-relaxed">
                        {msg.text.split('**').map((part, index) => 
                          index % 2 === 1 ? <strong key={index} className={cn("font-semibold text-white", msg.sender === 'user' ? 'text-black' : '')}>{part}</strong> : part
                        )}
                      </p>
                      <span className={cn(
                        "text-[9px] mt-2 self-end font-mono",
                        msg.sender === 'user' ? "text-slate-500" : "text-slate-600"
                      )}>
                        {msg.timestamp}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isThinking && (
                  <div className="flex items-center gap-3 bg-white/5 border border-white/[0.06] p-4 rounded-2xl max-w-[210px] shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981] font-mono">
                      Core Reasoning...
                    </span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* In-chat quick prompts */}
              <div className="px-6 py-3 border-t border-white/[0.02] bg-[#0E0E10] flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                {suggestions.map((suggestion) => (
                  <button 
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    className="text-xs bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-slate-450 hover:text-white px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer text-[11px] font-sans hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Smart Send Form */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                className="p-4 border-t border-[#1C1C22] bg-[#0A0A0C] flex gap-3"
              >
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Instruct oracle: e.g. 'I spent $45 on hosting'"
                  className="flex-1 bg-white/[0.02] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-600 font-sans transition-all"
                />
                <button 
                  type="submit" 
                  className="bg-emerald-500 hover:bg-emerald-400 text-brand-dark px-5 rounded-xl transition-all font-bold cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10 active:scale-95 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* System ReAct Console (Amber/Cyan System Logs) */}
            <div className="bg-[#0B0B0D]/90 rounded-3xl border border-slate-850/80 overflow-hidden shadow-xl">
              <div className="p-4 bg-[#070709] border-b border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-400">
                    ReAct Autopilot execution terminal
                  </span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse animate-duration-1000" />
              </div>

              <div className="h-[200px] overflow-y-auto p-5 font-mono text-[11px] leading-relaxed space-y-4 bg-black/40 scroll-smooth">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600">[{log.timestamp.split('T')[1]?.slice(0, 8) || new Date().toLocaleTimeString().slice(0, 8)}]</span>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                        log.type === 'INFO' ? "bg-blue-500/10 text-blue-400 border border-blue-500/10" :
                        log.type === 'REASONING' ? "bg-amber-500/10 text-amber-400 border border-amber-500/10" :
                        log.type === 'TOOL_CALL' ? "bg-purple-500/10 text-purple-400 border border-purple-500/10" :
                        log.type === 'OBSERVATION' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" :
                        "bg-rose-500/15 text-rose-400 border border-rose-500/10 animate-pulse text-xs bg-rose-950/20"
                      )}>
                        {log.type}
                      </span>
                    </div>
                    <p className={cn(
                      "pl-4 border-l border-slate-800 font-mono tracking-tight whitespace-pre-wrap text-slate-400",
                      log.type === 'TOOL_CALL' ? "text-purple-300 font-bold" :
                      log.type === 'OBSERVATION' ? "text-emerald-300" :
                      log.type === 'REASONING' ? "text-amber-200" :
                      log.type === 'ALERT' ? "text-rose-400 font-bold" :
                      "text-slate-400"
                    )}>
                      {log.message}
                    </p>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR GUEST PANELS IN THE EXPANDED GRID VIEW (5 Columns, perfectly aligned layout) */}
          <div className="xl:col-span-5 space-y-7">
            
            {/* Circular Savings Rate Card & Income vs Expenses metrics */}
            <div className="bg-gradient-to-br from-[#0C0C0F] to-[#09090C] border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                  LIVETIME ACCRUAL INDEX
                </span>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white tracking-tight">Savings Ledger Efficiency</h3>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/10 font-mono">
                    RATE = {savingsRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Horizon horizontal progress graph bar */}
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Income Offset</span>
                  <span className="font-semibold text-white">{savingsRate >= 0 ? '+' : ''}{savingsRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/[0.03]">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500 bg-gradient-to-r",
                      savingsRate >= 50 ? "from-emerald-600 to-emerald-400" :
                      savingsRate >= 20 ? "from-indigo-600 to-indigo-400" :
                      savingsRate >= 0 ? "from-amber-600 to-amber-400" : "from-rose-600 to-rose-400"
                    )}
                    style={{ width: `${Math.max(0, Math.min(savingsRate, 100))}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 italic mt-1 leading-relaxed">
                  {savingsRate > 40 ? "Excellent. Current assets operate under strong capital accumulator parameters." :
                   savingsRate > 15 ? "Healthy. High transaction load offset remains stable." :
                   "Exposure flag: Expenses operating high against liquid income vector."}
                </p>
              </div>

              {/* Income and Expense sub-pills */}
              <div className="grid grid-cols-2 gap-4 pt-1 relative z-10">
                <div className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Ledger Inc.</span>
                    <span className="text-xs font-bold text-white font-mono">{formatCurrency(totalIncome)}</span>
                  </div>
                </div>
                <div className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Ledger Exp.</span>
                    <span className="text-xs font-bold text-white font-mono">{formatCurrency(totalExpenses)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Virtual Accounts Ledger Panel */}
            <div className="bg-card-dark border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                  VIRTUALIZED LEDGER SYSTEM
                </span>
                <Activity className="w-4.5 h-4.5 text-slate-650" />
              </div>
              
              <div className="space-y-3.5">
                {/* Vault-Checking-7740 */}
                <div className="group bg-[#0B0B0E] border border-slate-850 hover:border-slate-700/80 p-4 rounded-2xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping animate-duration-1000" />
                      <span className="text-xs font-bold text-white font-mono block">Vault-Checking-7740</span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                      Primary Cash
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-mono text-slate-500">LIQUID CAPITAL CORE</span>
                    <span className="text-lg font-bold font-mono text-[#E4E4E7] tracking-tight">
                      {formatCurrency(currentChecking)}
                    </span>
                  </div>
                </div>

                {/* Operating-Credit-8890 */}
                <div className="group bg-[#0B0B0E] border border-slate-850 hover:border-slate-700/80 p-4 rounded-2xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                      <span className="text-xs font-bold text-white font-mono block">Operating-Credit-8890</span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold">
                      System Backup
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-mono text-slate-500">CREDIT OVERDRAFT ENABLED</span>
                    <span className="text-lg font-bold font-mono text-[#D4D4D8] tracking-tight">
                      {formatCurrency(currentCredit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget ceiling rules monitor */}
            <div className="bg-card-dark border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                  TACTICAL METRIC CEILINGS ({budgets.length})
                </span>
                <span className="text-[9px] text-[#A1A1AA] font-mono uppercase">REALTIME</span>
              </div>

              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                {budgets.map((b) => {
                  const percent = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
                  const percentInt = Math.min(100, Math.floor(percent));
                  const overThreshold = percent >= 90;

                  return (
                    <div key={b.category} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-white font-medium">{b.category}</span>
                        <span className={cn(
                          "font-bold text-right",
                          overThreshold ? "text-rose-400 animate-pulse" : percent >= 75 ? "text-amber-400" : "text-white"
                        )}>
                          {percentInt}% used
                        </span>
                      </div>
                      {/* Linear detailed progress indicator */}
                      <div className="h-1.5 w-full bg-slate-1000 rounded-full overflow-hidden flex">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            overThreshold ? "bg-rose-500" : percent >= 75 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${percentInt}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-550 font-mono">
                        <span>{formatCurrency(b.spent)} active spent</span>
                        <span>limit: {formatCurrency(b.limit)}</span>
                      </div>
                    </div>
                  );
                })}
                {budgets.length === 0 && (
                  <p className="text-xs text-slate-600 font-mono text-center py-4 italic">
                    No active category rules registered. Let core set allocations automatically.
                  </p>
                )}
              </div>
            </div>

            {/* Latest Committed Audit log tracker */}
            <div className="bg-card-dark border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                SECURE LEDGER COMMIT RECORDS
              </span>

              <div className="space-y-3 h-[180px] overflow-y-auto pr-1 no-scrollbar">
                {transactions.slice(0, 4).map((t) => (
                  <div key={t.id} className="flex justify-between items-center p-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] transition-all border border-white/[0.03]">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-[#E4E4E5] font-sans block truncate max-w-[170px]">
                        {t.description}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="inline-block text-[9px] font-mono text-slate-500 uppercase">
                          {t.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span className="text-[9px] font-mono text-slate-500">
                          {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs font-bold font-mono tracking-tight shrink-0",
                      t.type === 'income' ? 'text-emerald-400' : 'text-white'
                    )}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-xs text-slate-600 font-mono text-center py-6 italic">
                    No transaction assets recorded.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
