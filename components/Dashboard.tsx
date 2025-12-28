
import React from 'react';
import { Agent, SystemStats, LogEntry } from '../types';
import { 
  DollarSign, TrendingUp, Cpu, Activity, Zap, 
  Terminal as TerminalIcon, Bot
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  agents: Agent[];
  systemStats: SystemStats;
  logs: LogEntry[];
}

const data = [
  { time: '00:00', revenue: 120 },
  { time: '04:00', revenue: 340 },
  { time: '08:00', revenue: 290 },
  { time: '12:00', revenue: 560 },
  { time: '16:00', revenue: 780 },
  { time: '20:00', revenue: 910 },
  { time: '23:59', revenue: 1240 },
];

const StatCard: React.FC<{ title: string; value: string | number; sub: string; icon: React.ReactNode; color: string }> = ({ title, value, sub, icon, color }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all shadow-lg">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-${color}-500/20 transition-all`}></div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold tracking-tight mb-2">{value}</h3>
        <p className={`text-xs font-semibold flex items-center gap-1 ${sub.startsWith('+') ? 'text-green-500' : 'text-slate-500'}`}>
          {sub}
        </p>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-500 shadow-lg shadow-${color}-500/10 ring-1 ring-${color}-500/20`}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<Props> = ({ agents, systemStats, logs }) => {
  const activeAgents = agents.filter(a => a.status === 'running').length;
  const totalRevenue = agents.reduce((acc, a) => acc + a.totalEarnings, 0).toFixed(2);
  const dailyTotal = agents.reduce((acc, a) => acc + a.dailyEarnings, 0).toFixed(2);

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-slate-500 mt-1">Real-time telemetry and profit extraction status.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2 text-sm shadow-inner">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500"></div>
            <span className="font-mono text-xs">LIVE CORE LINK</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Yield" value={`$${totalRevenue}`} sub="+12.5% vs avg" icon={<DollarSign size={20} />} color="blue" />
        <StatCard title="Active Nodes" value={activeAgents} sub={`${agents.length} provisioned`} icon={<Bot size={20} />} color="purple" />
        <StatCard title="24h Revenue" value={`$${dailyTotal}`} icon={<TrendingUp size={20} />} sub="Automated Extraction" color="green" />
        <StatCard title="Core Load" value={`${systemStats.cpu}%`} sub={`Memory: ${systemStats.memory}%`} icon={<Cpu size={20} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={18} />
              Revenue Projection
            </h3>
            <div className="flex gap-2 text-[10px] font-bold uppercase text-slate-500 tracking-tighter">
              <span className="px-2 py-1 bg-slate-800 rounded ring-1 ring-slate-700">Real-time</span>
            </div>
          </div>
          {/* Using explicit pixel height and aspect ratio to prevent Recharts calculation warnings */}
          <div className="w-full relative" style={{ minHeight: '350px' }}>
            <ResponsiveContainer width="100%" height={350} minWidth={0} minHeight={0}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col shadow-2xl h-[456px]">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TerminalIcon className="text-slate-400" size={18} />
            Kernel Logs
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[10px] custom-scrollbar pr-2">
            {logs.length === 0 ? (
              <p className="text-slate-800 italic">>> Initializing system observer...</p>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex gap-3 animate-in slide-in-from-right-2 duration-300">
                  <span className="text-slate-700 whitespace-nowrap">[{log.timestamp}]</span>
                  <span className={`${
                    log.type === 'success' ? 'text-green-500' :
                    log.type === 'error' ? 'text-red-500 font-bold' :
                    log.type === 'warning' ? 'text-amber-500' :
                    'text-blue-500'
                  } break-words`}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
