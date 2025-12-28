
import React from 'react';
import { 
  Shield, Key, Bell, Globe, 
  Database, Github, Eye, Cpu, CreditCard,
  Volume2, Sparkles, Download, RefreshCw
} from 'lucide-react';

interface Props {
  voiceEnabled: boolean;
  setVoiceEnabled: (v: boolean) => void;
  onExport: () => void;
}

const Settings: React.FC<Props> = ({ voiceEnabled, setVoiceEnabled, onExport }) => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Nexus Config</h1>
        <p className="text-slate-500 mt-1">Configure neural gateways and backup local agent architectures.</p>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="text-blue-500" size={20} />
              <h3 className="font-bold text-lg">Local Backup & Recovery</h3>
            </div>
          </div>
          <div className="p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <p className="font-semibold mb-2">Export Cluster Snapshot</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Download a full JSON snapshot of your current agent fleet, their neural patches, and performance history.
              </p>
            </div>
            <button 
              onClick={onExport}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-sm font-bold flex items-center gap-3 transition-all ring-1 ring-slate-700 shadow-xl"
            >
              <Download size={18} /> DOWNLOAD SNAPSHOT
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="text-blue-500" size={20} />
              <h3 className="font-bold text-lg">Neural Audio HUD</h3>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 text-blue-500 rounded-md text-[10px] font-bold uppercase ring-1 ring-blue-500/20">
              <Sparkles size={10} /> Active HUD
            </div>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold mb-1">Status Announcements</p>
                <p className="text-xs text-slate-500">The Nexus Core speaks when agents reach milestones or disconnect.</p>
              </div>
              <button 
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-14 h-7 rounded-full relative transition-all duration-500 shadow-inner ${voiceEnabled ? 'bg-blue-600 ring-4 ring-blue-600/10' : 'bg-slate-800 ring-1 ring-slate-700'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-md ${voiceEnabled ? 'left-8' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-emerald-500" size={20} />
              <h3 className="font-bold text-lg">Security Protocol</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">RSA-4096 Encryption</span>
                <span className="text-emerald-500 font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Neural Patch Audit</span>
                <span className="text-emerald-500 font-bold">ENFORCED</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="text-amber-500" size={20} />
              <h3 className="font-bold text-lg">Neural Model</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Orchestrator</p>
                <div className="px-3 py-2 bg-slate-800 rounded-xl text-xs font-mono border border-slate-700">Gemini 3.0 Flash Preview</div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Architect</p>
                <div className="px-3 py-2 bg-slate-800 rounded-xl text-xs font-mono border border-slate-700">Gemini 3.0 Pro Preview</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
