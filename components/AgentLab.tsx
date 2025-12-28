
import React, { useState, useEffect } from 'react';
import { 
  Code, Save, Play, ChevronRight, 
  FileCode, Terminal as TerminalIcon,
  RefreshCw, Layers, Zap, Info, CloudSync
} from 'lucide-react';
import { Agent } from '../types';

interface Props {
  agents: Agent[];
  onDeploy: (agentId: string, code: string) => Promise<void>;
  initialCode?: string | null;
  onCodeConsumed?: () => void;
}

const AgentLab: React.FC<Props> = ({ agents, onDeploy, initialCode, onCodeConsumed }) => {
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  // Default templates for agents
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] >> External logic injected from GitHub sync.`]);
      if (onCodeConsumed) onCodeConsumed();
    } else {
      const selectedAgent = agents.find(a => a.id === selectedAgentId);
      if (selectedAgent && !code) {
        setCode(`// Neural Core Logic for ${selectedAgent.name}\n// Optimized for ${selectedAgent.category}\n\nasync function orchestrate() {\n  const data = await Source.fetch();\n  const signal = await Core.process(data);\n  \n  if (signal.confidence > 0.85) {\n    return await Actions.execute(signal);\n  }\n  \n  return Logger.log("Signal suppressed: Low confidence");\n}\n\n// Deployment Params\nexport const config = {\n  threshold: 0.85,\n  mode: "aggressive",\n  attribution: true\n};`);
      }
    }
  }, [selectedAgentId, initialCode]);

  const runDeploy = async () => {
    if (!selectedAgentId) return;
    setIsDeploying(true);
    setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] >> Syncing code to ${selectedAgentId}...`]);
    
    await onDeploy(selectedAgentId, code);
    
    setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] >> Neural update applied.`]);
    setIsDeploying(false);
  };

  return (
    <div className="h-full flex flex-col p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agent Lab</h1>
          <p className="text-slate-500 mt-1">Directly patch neural logic. Changes impact yield and efficiency in real-time.</p>
        </div>
        <div className="flex gap-3">
          <button 
            disabled={isDeploying}
            onClick={runDeploy}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/20"
          >
            {isDeploying ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />} 
            DEPLOY TO CORE
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-72 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 overflow-y-auto">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Layers size={14} /> ACTIVE NODES
          </h3>
          <div className="space-y-2">
            {agents.map(agent => (
              <button 
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`w-full flex flex-col gap-1 p-3 rounded-xl text-left transition-all border ${
                  selectedAgentId === agent.id 
                    ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 ring-1 ring-blue-500/20 shadow-inner shadow-blue-500/5' 
                    : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold truncate">{agent.name}</span>
                  {agent.status === 'running' && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>}
                </div>
                <span className="text-[10px] opacity-60 uppercase tracking-tight">{agent.category}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-600/5 rounded-xl border border-blue-500/10">
            <h4 className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-2">
              <Info size={14} /> TIP
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Use Gemini to audit your code. High code quality scores directly increase the **Yield Forecast** and **System Uptime**.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-t-2xl flex flex-col overflow-hidden shadow-2xl shadow-black/40">
            <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-blue-500" />
                <span className="text-slate-400">logic_v2.patch</span>
              </div>
              <div className="flex items-center gap-4">
                {initialCode && <span className="text-blue-400 flex items-center gap-1 animate-pulse"><CloudSync size={12}/> EXTERNAL CODE SYNCED</span>}
                <span className="text-slate-600">UTF-8</span>
              </div>
            </div>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent p-6 font-mono text-sm outline-none resize-none text-blue-100 placeholder:text-slate-700"
              spellCheck={false}
              placeholder="// Enter agent logic here..."
            />
          </div>
          
          <div className="h-48 bg-black/40 backdrop-blur-md border-x border-b border-slate-800 rounded-b-2xl p-4 font-mono text-[10px] overflow-y-auto custom-scrollbar">
            <h3 className="text-slate-600 mb-2 flex items-center gap-2 font-bold uppercase tracking-widest">
              <TerminalIcon size={12} /> KERNEL_OUT
            </h3>
            <div className="space-y-1">
              {output.length === 0 ? (
                <p className="text-slate-800 italic">>> Core quiet. Standing by.</p>
              ) : (
                output.map((line, i) => (
                  <p key={i} className="text-slate-400 flex gap-2">
                    <span className="text-blue-900">nexus_shell@core:</span> {line}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLab;
