
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sun, Moon, Bell, Search, User, 
  Zap, Volume2, VolumeX, Key, Lock
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
import ProductAutomator from './components/ProductAutomator';
import EBookAutomator from './components/EBookAutomator';
import PrintifyAutomator from './components/PrintifyAutomator';
import MerchantWallet from './components/MerchantWallet';
import LegalCompliance from './components/LegalCompliance';
import SystemDiagnostics from './components/SystemDiagnostics';
import ArbitrageScanner from './components/ArbitrageScanner';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [darkMode, setDarkMode] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem('nexus_voice') === 'true');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [syncedCode, setSyncedCode] = useState<string | null>(null);
  
  const [isLocked, setIsLocked] = useState(() => localStorage.getItem('nexus_license') !== 'ACTIVE-PRO-NODE-2025');

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

    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenKeySelector = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleUnlock = () => {
    localStorage.setItem('nexus_license', 'ACTIVE-PRO-NODE-2025');
    setIsLocked(false);
  };

  const renderContent = () => {
    if (isLocked) {
      return (
        <div className="h-full flex items-center justify-center p-6 sm:p-8">
           <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 text-center space-y-8 shadow-2xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 text-emerald-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20">
                 <Lock size={32} />
              </div>
              <div>
                 <h2 className="text-xl sm:text-2xl font-black">Nexus OS Locked</h2>
                 <p className="text-slate-500 text-xs sm:text-sm mt-2 font-medium">Enter production license key to unlock architecture.</p>
              </div>
              <input 
                type="password" 
                placeholder="License Key..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button 
                onClick={handleUnlock}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black shadow-xl shadow-emerald-500/20 transition-all uppercase tracking-widest"
              >
                Activate Platform
              </button>
           </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard agents={agents} systemStats={systemStats} logs={logs} />;
      case 'agents': return <AgentCenter agents={agents} onToggle={() => {}} logs={logs} />;
      case 'wallet': return <MerchantWallet />;
      case 'marketplace': return <ProductAutomator />;
      case 'ebook': return <EBookAutomator />;
      case 'printify': return <PrintifyAutomator />;
      case 'youtube': return <YouTubeAutomator />;
      case 'arbitrage': return <ArbitrageScanner />;
      case 'compliance': return <LegalCompliance />;
      case 'diagnostics': return <SystemDiagnostics />;
      case 'chat': return <AIAssistant messages={messages} setMessages={setMessages} />;
      case 'code': return <AgentLab agents={agents} onDeploy={async () => {}} initialCode={syncedCode} onCodeConsumed={() => setSyncedCode(null)} />;
      case 'media': return <MediaStudio />;
      case 'live': return <LiveComms />;
      case 'analytics': return <Analytics agents={agents} />;
      case 'settings': return <Settings voiceEnabled={voiceEnabled} setVoiceEnabled={setVoiceEnabled} onExport={() => {}} />;
      default: return <Dashboard agents={agents} systemStats={systemStats} logs={logs} />;
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <div className={`flex h-screen w-full overflow-hidden ${darkMode ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 font-sans`}>
      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'} flex flex-col border-r ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} transition-all duration-300 z-[70] overflow-hidden`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
            <Zap className="text-white fill-white" size={18} />
          </div>
          {(sidebarOpen || !isMobile) && <span className="font-black text-xl tracking-tighter text-white">NEXUS <span className="text-emerald-500">AI</span></span>}
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === item.id ? `bg-emerald-600/10 text-emerald-500 font-bold ring-1 ring-emerald-500/20 shadow-sm` : `hover:bg-slate-800/50 text-slate-400`}`}
            >
              <span className={activeTab === item.id ? 'text-emerald-500' : ''}>{item.icon}</span>
              {sidebarOpen && <span className="text-xs uppercase tracking-widest truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        <header className={`h-16 flex items-center justify-between px-4 sm:px-6 border-b ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'} backdrop-blur-xl z-40`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {!hasApiKey && !isMobile && (
              <button 
                onClick={handleOpenKeySelector}
                className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-500 text-[10px] font-black rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-all uppercase"
              >
                <Key size={14} /> Link Node
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono text-emerald-500">
               OS v2.5_PRO
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center ring-2 ring-slate-800 shadow-lg">
              <User size={18} className="text-white" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scroll-smooth bg-slate-950 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
