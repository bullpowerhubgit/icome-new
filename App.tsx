
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sun, Moon, Bell, Search, User, 
  Zap, Volume2, VolumeX, Key
} from 'lucide-react';
import { TabId, Message, Agent, LogEntry, SystemStats } from './types';
import { NAV_ITEMS, INITIAL_AGENTS } from './constants';
import { geminiService } from './services/geminiService';
import { ttsService } from './services/ttsService';

// Tabs
import Dashboard from './components/Dashboard';
import AgentCenter from './components/AgentCenter';
import AIAssistant from './components/AIAssistant';
import AgentLab from './components/AgentLab';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import MediaStudio from './components/MediaStudio';
import LiveComms from './components/LiveComms';
import GitHubManager from './components/GitHubManager';
import YouTubeAutomator from './components/YouTubeAutomator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem('nexus_voice') === 'true');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [syncedCode, setSyncedCode] = useState<string | null>(null);
  
  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('nexus_agents');
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('nexus_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 12, memory: 45, network: 2.4, uptime: '14d 2h'
  });

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  useEffect(() => {
    localStorage.setItem('nexus_agents', JSON.stringify(agents));
    localStorage.setItem('nexus_logs', JSON.stringify(logs));
    localStorage.setItem('nexus_voice', voiceEnabled.toString());
  }, [agents, logs, voiceEnabled]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 30) + 10,
        memory: 45 + (Math.random() * 2),
        network: parseFloat((Math.random() * 4).toFixed(1))
      }));

      setAgents(prev => prev.map(agent => {
        if (agent.status === 'running') {
          const hourlyBase = agent.dailyEarnings / 24;
          const fluctuation = (Math.random() - 0.5) * (hourlyBase * 0.2);
          const increment = parseFloat((hourlyBase / 360 + fluctuation).toFixed(4));
          return { ...agent, totalEarnings: agent.totalEarnings + increment };
        }
        return agent;
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (agentId: string, message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      agentId,
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleVoiceAlert = async (text: string) => {
    if (!voiceEnabled || isSpeaking) return;
    setIsSpeaking(true);
    await ttsService.announce(text);
    setTimeout(() => setIsSpeaking(false), 4000);
  };

  const toggleAgent = async (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (!agent) return;
    const newStatus = agent.status === 'idle' ? 'running' : 'idle';
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (newStatus === 'running') {
      addLog(id, `Nexus link established.`, 'info');
      if (voiceEnabled) handleVoiceAlert(`Nexus Core: Agent ${agent.name} operational.`);
    }
  };

  const updateAgentLogic = async (agentId: string, code: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    addLog(agentId, "Neural audit in progress...", "info");
    const result = await geminiService.auditAgentCode(code, agent.name);
    if (result) {
      setAgents(prev => prev.map(a => a.id === agentId ? {
        ...a,
        uptime: result.efficiencyScore,
        dailyEarnings: result.yieldForecast,
        description: result.newDescription
      } : a));
      addLog(agentId, `Audit Complete: ${result.efficiencyScore}% Eff.`, "success");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard agents={agents} systemStats={systemStats} logs={logs} />;
      case 'agents': return <AgentCenter agents={agents} onToggle={toggleAgent} logs={logs} />;
      case 'chat': return <AIAssistant messages={messages} setMessages={setMessages} />;
      case 'code': return (
        <AgentLab 
          agents={agents} 
          onDeploy={updateAgentLogic} 
          initialCode={syncedCode} 
          onCodeConsumed={() => setSyncedCode(null)} 
        />
      );
      case 'media': return <MediaStudio />;
      case 'live': return <LiveComms />;
      case 'github': return (
        <GitHubManager 
          onSync={(code) => {
            setSyncedCode(code);
            setActiveTab('code');
          }} 
        />
      );
      case 'youtube': return <YouTubeAutomator />;
      case 'analytics': return <Analytics agents={agents} />;
      case 'settings': return <Settings voiceEnabled={voiceEnabled} setVoiceEnabled={setVoiceEnabled} onExport={() => {}} />;
      default: return <Dashboard agents={agents} systemStats={systemStats} logs={logs} />;
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col border-r ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} transition-all duration-300 z-50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
            <Zap className="text-white fill-white" size={18} />
          </div>
          {sidebarOpen && <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">NEXUS AI</span>}
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === item.id ? `bg-blue-600/10 text-blue-500 font-semibold ring-1 ring-blue-500/20` : `hover:bg-slate-800/50 text-slate-400`}`}
            >
              <span className={activeTab === item.id ? 'text-blue-500' : ''}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-16 flex items-center justify-between px-6 border-b ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'} backdrop-blur-xl z-40`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
              <Menu size={20} />
            </button>
            {!hasApiKey && (
              <button 
                onClick={handleOpenKeySelector}
                className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-500 text-xs font-bold rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-all"
              >
                <Key size={14} /> UNLOCK PAID MODELS
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-2 rounded-lg transition-colors ${voiceEnabled ? 'text-blue-500 bg-blue-500/10' : 'text-slate-400 hover:bg-slate-800'}`}>
              {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center ring-2 ring-slate-800 shadow-lg">
              <User size={18} className="text-white" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
