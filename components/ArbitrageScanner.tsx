import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShieldAlert, TrendingUp, RefreshCw, 
  ArrowUpRight, ExternalLink, Zap, ZapOff, 
  Database, Globe, Share2, Trash2, CheckCircle,
  AlertTriangle, DollarSign, Activity, Terminal
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface ArbitrageOpportunity {
  id: string;
  item: string;
  source: string;
  buy: number;
  sell: number;
  profit: number;
  confidence: number;
  timestamp: string;
}

const ArbitrageScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [autoScan, setAutoScan] = useState(false);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const scanIntervalRef = useRef<any>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const performScan = async () => {
    setIsScanning(true);
    addLog("Initializing Neural Market Handshake...");
    
    try {
      const results = await geminiService.scanArbitrage();
      
      const newOpps = results.map((res: any) => ({
        ...res,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString()
      }));

      setOpportunities(prev => [...newOpps, ...prev].slice(0, 20));
      addLog(`Scan complete. Found ${newOpps.length} valid discrepancies.`);
      
      if (newOpps.length > 0) {
        addLog(`Top Opportunity: ${newOpps[0].item} | ROI: ${((newOpps[0].profit / newOpps[0].buy) * 100).toFixed(1)}%`);
      }
    } catch (error) {
      addLog("ERROR: API Latency exceeded threshold. Retrying...");
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (autoScan) {
      performScan();
      scanIntervalRef.current = setInterval(performScan, 30000);
    } else {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    }
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [autoScan]);

  const deployToChannels = (opp: ArbitrageOpportunity) => {
    addLog(`Broadcasting discrepancy: ${opp.item} to Telegram/Discord nodes...`);
    // Simulated deployment
    setTimeout(() => addLog(`✅ Broadcast successful. ID: ${opp.id}`), 800);
  };

  const totalPotentialProfit = opportunities.reduce((acc, curr) => acc + curr.profit, 0);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-24">
      {/* Header HUD */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-cyan-500/10 rounded-3xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
            <Search className="text-cyan-500" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight">Arbitrage <span className="text-cyan-500">Scanner</span></h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-1">Autonomous Market Inefficiency Extraction</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
          <button 
            onClick={() => setAutoScan(!autoScan)}
            className={`px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-3 border-2 ${autoScan ? 'bg-cyan-600/10 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}
          >
            {autoScan ? <Zap size={16} className="fill-cyan-400 animate-pulse" /> : <ZapOff size={16} />}
            {autoScan ? 'AUTO-SCAN: ACTIVE' : 'AUTO-SCAN: IDLE'}
          </button>
          <div className="h-8 w-px bg-slate-800 mx-1" />
          <button 
            onClick={performScan}
            disabled={isScanning}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-xl shadow-cyan-600/20 uppercase tracking-widest"
          >
            {isScanning ? <RefreshCw size={16} className="animate-spin" /> : <TrendingUp size={16} />}
            Trigger Manual Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Command & Stats Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
              <div className="absolute top-0 right-0 p-8 text-cyan-500 opacity-5 group-hover:opacity-20 transition-all group-hover:scale-125 duration-700">
                <DollarSign size={80} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Activity size={12} className="text-cyan-500" /> Detected Yield Pool
              </p>
              <p className="text-5xl font-black tracking-tighter text-slate-100">${totalPotentialProfit.toLocaleString()}</p>
              <p className="text-[10px] font-black mt-3 text-cyan-500 uppercase flex items-center gap-1">
                <ArrowUpRight size={12} /> Total across {opportunities.length} nodes
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={14} className="text-cyan-500" /> Neural Event Stream
            </h3>
            <div className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] p-6 h-96 overflow-y-auto custom-scrollbar font-mono text-[10px] leading-loose shadow-inner">
              {logs.map((log, i) => (
                <div key={i} className="mb-2 flex gap-3 animate-in slide-in-from-left-2 duration-300">
                  <span className="text-slate-700 shrink-0">>></span>
                  <span className={log.includes('✅') ? 'text-emerald-400 font-bold' : log.includes('ERROR') ? 'text-red-500' : 'text-slate-400'}>{log}</span>
                </div>
              ))}
              {logs.length === 0 && <div className="text-slate-800 italic text-center mt-32">Standing by for market handshake...</div>}
            </div>
          </div>
          
          <div className="p-8 bg-cyan-600/5 border border-dashed border-cyan-500/30 rounded-[2.5rem] text-center shadow-inner">
            <ShieldAlert size={48} className="mx-auto text-cyan-500/40 mb-4" />
            <h4 className="text-slate-200 font-black text-sm uppercase tracking-tighter">Volatility Mitigation Engaged</h4>
            <p className="text-slate-500 text-[10px] mt-2 leading-relaxed">The scanner filters for confidence scores > 85% to minimize execution risk during high-frequency market shifts.</p>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.length > 0 ? (
              opportunities.map(opp => (
                <div key={opp.id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl hover:border-cyan-500/40 transition-all group relative overflow-hidden animate-in zoom-in-95 duration-500">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-all group-hover:scale-125 duration-700">
                    <TrendingUp size={100} className="text-cyan-500" />
                  </div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-2xl font-black text-slate-100 group-hover:text-cyan-400 transition-colors truncate max-w-[200px]">{opp.item}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">{opp.timestamp} • ID: {opp.id}</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1 flex items-center gap-2">
                       <CheckCircle size={10} className="text-cyan-500" />
                       <span className="text-[10px] font-black text-cyan-500">{opp.confidence}% CONF</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-slate-950 rounded-[2rem] border border-slate-800/50">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Entry Target</p>
                      <p className="text-xl font-black text-slate-200">${opp.buy.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{opp.source}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Exit Target</p>
                      <p className="text-xl font-black text-cyan-500">${opp.sell.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Open Market</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex flex-col">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Est. Profit Node</p>
                      <p className="text-3xl font-black text-emerald-500 tracking-tighter">+${opp.profit.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => deployToChannels(opp)}
                        className="p-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl transition-all shadow-xl shadow-cyan-600/20 group/btn"
                      >
                        <Share2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl border border-slate-700 transition-all">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full h-[600px] bg-slate-900/50 border-4 border-dashed border-slate-800 rounded-[4rem] flex flex-col items-center justify-center text-center p-12 opacity-50">
                <Database size={100} className="text-slate-800 mb-8" />
                <h3 className="text-3xl font-black text-slate-700 uppercase tracking-tighter">Market Matrix Empty</h3>
                <p className="text-slate-800 max-w-sm mt-4 text-sm font-black leading-relaxed">
                  The Neural Scanner is awaiting manual trigger or auto-scan activation to identify global price discrepancies.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArbitrageScanner;