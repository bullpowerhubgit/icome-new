
import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, DollarSign, PieChart, ShieldCheck } from 'lucide-react';
import { Transaction } from '../types';

const MerchantWallet: React.FC = () => {
  const [balance, setBalance] = useState(14580.25);
  const [history] = useState<Transaction[]>([
    { id: 'tx-001', source: 'Gumroad Payout', amount: 840.00, status: 'cleared', timestamp: '2h ago' },
    { id: 'tx-002', source: 'Etsy Sales', amount: 125.50, status: 'cleared', timestamp: '5h ago' },
    { id: 'tx-003', source: 'Printify Dividend', amount: 45.10, status: 'cleared', timestamp: 'Yesterday' }
  ]);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Nexus <span className="text-emerald-500">Wallet</span></h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Live Revenue & Payout Orchestration</p>
        </div>
        <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20 uppercase tracking-widest">
          <ArrowDownRight size={14} /> Request Payout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <PieChart size={180} />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Withdrawable Nexus Balance</p>
              <h2 className="text-6xl font-black text-white tracking-tighter">${balance.toLocaleString()}</h2>
            </div>
            <div className="mt-10 flex gap-4">
               <div className="px-5 py-3 bg-slate-950 border border-slate-800 rounded-2xl">
                 <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Stripe Node</p>
                 <p className="text-sm font-bold text-emerald-500">Connected</p>
               </div>
               <div className="px-5 py-3 bg-slate-950 border border-slate-800 rounded-2xl">
                 <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Tax Provision (15%)</p>
                 <p className="text-sm font-bold text-slate-300">${(balance * 0.15).toFixed(2)}</p>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="px-10 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Transaction Stream</h3>
              <ShieldCheck className="text-emerald-500" size={16} />
            </div>
            <div className="divide-y divide-slate-800">
              {history.map(tx => (
                <div key={tx.id} className="px-10 py-6 flex justify-between items-center hover:bg-slate-800/20 transition-all group">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                       <ArrowUpRight size={18} />
                     </div>
                     <div>
                       <p className="font-bold text-slate-200">{tx.source}</p>
                       <p className="text-[10px] text-slate-500 font-mono">{tx.timestamp} • ID: {tx.id}</p>
                     </div>
                   </div>
                   <p className="text-xl font-black text-emerald-500">+${tx.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Linked Payout Nodes</h4>
              <div className="space-y-4">
                 {[
                   { name: 'Wise Business', status: 'Primary', color: 'blue' },
                   { name: 'PayPal Merchant', status: 'Backup', color: 'indigo' },
                   { name: 'Crypto (USDT/ERC20)', status: 'Active', color: 'emerald' }
                 ].map((node, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full bg-${node.color}-500 shadow-[0_0_8px_rgba(var(--${node.color}-rgb),0.5)]`} />
                        <span className="text-xs font-bold text-slate-300">{node.name}</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-500 uppercase">{node.status}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-emerald-600/5 border border-dashed border-emerald-500/30 rounded-[2rem] p-8 text-center">
              <DollarSign className="mx-auto text-emerald-500/50 mb-4" size={40} />
              <h4 className="text-slate-300 font-bold text-sm">Automated Tax Filing</h4>
              <p className="text-slate-500 text-[10px] mt-2">Nexus automatically prepares quarterly tax exports for digital goods and physical POD sales.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantWallet;
