
import React from 'react';
import { Agent } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Target, CreditCard, Wallet } from 'lucide-react';

interface Props {
  agents: Agent[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const Analytics: React.FC<Props> = ({ agents }) => {
  const pieData = agents.map(a => ({
    name: a.name,
    value: parseFloat(a.totalEarnings.toFixed(2))
  }));

  const barData = agents.map(a => ({
    name: a.name.split(' ')[0],
    daily: parseFloat(a.dailyEarnings.toFixed(2)),
    total: parseFloat((a.totalEarnings / 10).toFixed(2)) // scaled for visual comparison
  }));

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold">Extraction Analytics</h1>
        <p className="text-slate-500 mt-1">Cross-agent yield attribution and historical scaling data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col shadow-2xl">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Target className="text-pink-500" size={18} />
            Revenue Distribution
          </h3>
          <div className="w-full relative" style={{ minHeight: '350px' }}>
            <ResponsiveContainer width="100%" height={350} minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col shadow-2xl">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <TrendingUp className="text-emerald-500" size={18} />
            Yield Comparison (Daily vs Scaled Total)
          </h3>
          <div className="w-full relative" style={{ minHeight: '350px' }}>
            <ResponsiveContainer width="100%" height={350} minWidth={0} minHeight={0}>
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="daily" fill="#3b82f6" radius={[6, 6, 0, 0]} name="24h Yield" />
                <Bar dataKey="total" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="10x Cumulative Scale" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-12">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <CreditCard className="text-blue-500" size={18} />
            Agent Audit Table
          </h3>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Wallet size={14} />
            ID: 0xNEXUS_CORE_AUTH
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-500 uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">Node Name</th>
                <th className="px-6 py-4 font-bold">Operational Cluster</th>
                <th className="px-6 py-4 font-bold">Efficiency Score</th>
                <th className="px-6 py-4 font-bold text-right">Lifetime ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {agents.map(agent => (
                <tr key={agent.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-200">{agent.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{agent.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${agent.uptime > 98 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-blue-500'}`} style={{ width: `${agent.uptime}%` }}></div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">{agent.uptime}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-500">
                    <div className="flex items-center justify-end gap-1">
                      <ArrowUpRight size={14} className="opacity-50" />
                      +${agent.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ArrowUpRight: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

export default Analytics;
