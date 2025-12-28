
import React from 'react';
import { Agent, LogEntry } from '../types';
import { 
  Play, Pause, Settings2, Trash2, 
  Search, ShieldAlert, Cpu, Activity,
  Database, RefreshCw
} from 'lucide-react';

interface Props {
  agents: Agent[];
  onToggle: (id: string) => void;
  logs: LogEntry[];
}

const AgentCenter: React.FC<Props> = ({ agents, onToggle, logs }) => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agent Center</h1>
          <p className="text-slate-500 mt-1">Deploy and orchestrate autonomous revenue-generating agents.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
            <RefreshCw size={20} className="text-slate-400" />
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
            <Plus size={18} />
            NEW AGENT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map(agent => (
          <div key={agent.id} className={`group bg-slate-900 border ${agent.status === 'running' ? 'border-blue-500/50' : 'border-slate-800'} rounded-2xl p-6 transition-all hover:shadow-2xl hover:shadow-blue-500/5 relative overflow-hidden`}>
            {agent.status === 'running' && (
              <div className="absolute top-0 right-0 p-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-[10px] font-bold tracking-widest uppercase ring-1 ring-blue-500/30">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  RUNNING
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl ${agent.status === 'running' ? 'bg-blue-600' : 'bg-slate-800'} flex items-center justify-center text-white shadow-xl shadow-blue-500/10`}>
                <Cpu size={32} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold truncate">{agent.name}</h3>
                <p className="text-xs text-blue-500 font-semibold mb-2">{agent.category}</p>
                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                  {agent.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-800 mb-6">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Daily Yield</p>
                <p className="font-bold text-green-500">${agent.dailyEarnings.toFixed(2)}</p>
              </div>
              <div className="text-center border-x border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Total ROI</p>
                <p className="font-bold text-slate-100">${agent.totalEarnings.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Efficiency</p>
                <p className="font-bold text-slate-100">{agent.uptime}%</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => onToggle(agent.id)}
                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  agent.status === 'running' 
                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 ring-1 ring-red-500/20' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                }`}
              >
                {agent.status === 'running' ? <><Pause size={18} /> HALT</> : <><Play size={18} /> LAUNCH</>}
              </button>
              <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors ring-1 ring-slate-700">
                <Settings2 size={18} className="text-slate-400" />
              </button>
              <button className="p-3 bg-slate-800 hover:bg-red-900/30 group/trash rounded-xl transition-colors ring-1 ring-slate-700">
                <Trash2 size={18} className="text-slate-400 group-hover/trash:text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Plus: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default AgentCenter;
