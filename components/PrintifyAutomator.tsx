
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shirt, Plus, RefreshCw, Trash2, Globe, ShoppingBag, 
  Activity, Box, ChevronRight, Cpu, Layers, Network, 
  Search, Sparkles, TrendingUp, Zap, ZapOff, DollarSign,
  Palette, Truck, CheckCircle, Package, Settings2, BarChart3,
  ImageIcon, ExternalLink, CloudSync, Eye, MapPin, 
  ArrowUpRight, X, Info, Gauge, Zap as ZapIcon,
  ShoppingBag as ShoppingBagIcon, MousePointer2
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PODProduct {
  id: string;
  name: string;
  blueprint: string; 
  printProvider: string;
  price: number;
  cogs: number;
  margin: number;
  status: 'Draft' | 'Syncing' | 'Active' | 'Locked';
  sales: number;
  mockup: string | null;
  niche: string;
  syncNodes: { printify: boolean; etsy: boolean; shopify: boolean };
}

const mockMetricData = [
  { name: 'Mon', revenue: 400, cost: 240 },
  { name: 'Tue', revenue: 700, cost: 400 },
  { name: 'Wed', revenue: 600, cost: 350 },
  { name: 'Thu', revenue: 900, cost: 500 },
  { name: 'Fri', revenue: 1200, cost: 700 },
  { name: 'Sat', revenue: 1500, cost: 900 },
  { name: 'Sun', revenue: 1300, cost: 750 },
];

const PrintifyAutomator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'factory' | 'logistics' | 'inventory' | 'metrics'>('factory');
  const [niche, setNiche] = useState('Minimalist Cyberpunk Aesthetic');
  const [isBusy, setIsBusy] = useState(false);
  const [autopilot, setAutopilot] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<PODProduct | null>(null);

  const [products, setProducts] = useState<PODProduct[]>([
    { 
      id: 'p-101', 
      name: 'Neural Genesis Premium Tee', 
      blueprint: 'Unisex Heavy Cotton Tee', 
      printProvider: 'SwiftPOD',
      price: 32.00, 
      cogs: 14.50, 
      margin: 54, 
      status: 'Active', 
      sales: 245, 
      mockup: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400',
      niche: 'Cyber-Minimalism',
      syncNodes: { printify: true, etsy: true, shopify: false }
    },
    { 
      id: 'p-102', 
      name: 'Algorithm Overdrive Hoodie', 
      blueprint: 'Unisex Heavy Blend™ Hoodie', 
      printProvider: 'Monster Digital',
      price: 55.00, 
      cogs: 26.20, 
      margin: 52, 
      status: 'Active', 
      sales: 112, 
      mockup: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400',
      niche: 'Techwear',
      syncNodes: { printify: true, etsy: false, shopify: true }
    }
  ]);

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));

  const runMarketScan = async () => {
    setIsBusy(true);
    addLog(`>> Initializing Printify Blueprint Scan for niche: "${niche}"...`);
    try {
      const result = await geminiService.performGapAnalysis(niche);
      if (result && result.opportunities) {
        setOpportunities(result.opportunities.filter((o: any) => o.type === 'POD'));
        addLog(`>> Printify Matrix: Found ${result.opportunities.length} high-yield blueprints.`);
      }
    } catch (e) {
      addLog(`ERROR: Market scan failed. Neural gateway timeout.`);
    }
    setIsBusy(false);
  };

  const forgePODProduct = async (opp: any) => {
    setIsBusy(true);
    setProgress(0);
    setActiveTab('factory');
    addLog(`>> Booting POD Forge for ${opp.productName}...`);
    
    try {
      setProgress(20);
      const details = await geminiService.forgeOmniProduct(niche, 'POD');
      
      addLog(`>> Synthesizing high-res neural texture for ${opp.blueprint || 'Apparel'}...`);
      setProgress(45);
      const mockup = await geminiService.generateMockup(details.designPrompt || `Minimalist design on a premium apparel mockup for ${niche}.`);
      
      addLog(`>> Negotiating COGS with global providers (Monster Digital, SwiftPOD)...`);
      setProgress(75);
      await new Promise(r => setTimeout(r, 1000));
      
      addLog(`>> Pushing asset to Printify Cloud & Syncing Etsy Merchant API...`);
      setProgress(90);
      await new Promise(r => setTimeout(r, 800));

      const newProd: PODProduct = {
        id: Math.random().toString(36).substr(2, 9),
        name: details.title || opp.productName,
        blueprint: details.printSpecs || 'Premium Cotton Tee',
        printProvider: 'Monster Digital',
        price: details.price || 34.00,
        cogs: details.cogs || 13.50,
        margin: Math.round(((details.price - details.cogs) / details.price) * 100) || 60,
        status: 'Active',
        sales: 0,
        mockup: mockup,
        niche: niche,
        syncNodes: { printify: true, etsy: true, shopify: false }
      };

      setProducts(prev => [newProd, ...prev]);
      setProgress(100);
      addLog(`✅ DEPLOYMENT SUCCESS: "${newProd.name}" is now live and fulfilling orders.`);
    } catch (e) {
      addLog(`ERROR: Forging failed at chapter 4 (Texture Injection).`);
    }
    setIsBusy(false);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-24">
      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
             <div className="md:w-1/2 h-[600px] bg-slate-950 flex items-center justify-center border-r border-slate-800">
               <img src={selectedProduct.mockup || ''} className="max-w-full max-h-full object-contain p-12" />
             </div>
             <div className="md:w-1/2 p-12 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-black text-white leading-tight">{selectedProduct.name}</h2>
                    <p className="text-blue-500 font-mono text-sm font-bold uppercase tracking-widest mt-1">{selectedProduct.blueprint}</p>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all border border-slate-700"><X size={20}/></button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Lifetime Yield</p>
                    <p className="text-2xl font-black text-emerald-500">${(selectedProduct.sales * selectedProduct.price).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total Orders</p>
                    <p className="text-2xl font-black text-white">{selectedProduct.sales}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Globe size={14} /> Global Sync Nodes</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(selectedProduct.syncNodes).map(([node, active]) => (
                      <div key={node} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 ${active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-slate-950 border-slate-800 text-slate-700'}`}>
                        {node === 'printify' ? <Box size={20} /> : node === 'etsy' ? <ShoppingBagIcon size={20} /> : <Globe size={20} />}
                        <span className="text-[10px] font-black uppercase">{node}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 flex items-center gap-2"><Info size={14}/> Fulfillment Strategy</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">This product is automatically routed to {selectedProduct.printProvider}. Current stock levels: 100%. Neural design optimized for direct-to-garment printing.</p>
                </div>

                <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20">
                  <Settings2 size={18} /> Configure Node
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600/10 rounded-3xl border border-blue-500/20 shadow-2xl shadow-blue-500/10 ring-1 ring-blue-500/20">
            <Shirt className="text-blue-500" size={36} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Printify <span className="text-blue-500">Logic Hub</span></h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em] mt-1">Autonomous POD Extraction & Fulfillment Control</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-[2rem] border border-slate-800 backdrop-blur-2xl">
           <button 
             onClick={() => setAutopilot(!autopilot)}
             className={`px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-3 border-2 ${autopilot ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
           >
             {autopilot ? <ZapIcon size={16} className="fill-blue-400" /> : <ZapOff size={16} />}
             {autopilot ? 'AUTOPILOT: ENGAGED' : 'AUTOPILOT: STANDBY'}
           </button>
           <div className="h-8 w-px bg-slate-800 mx-1" />
           <div className="flex gap-1">
            {(['factory', 'logistics', 'inventory', 'metrics'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Production Dashboard Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 p-20 opacity-[0.03] pointer-events-none">
              <Cpu size={300} />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Search size={14} className="text-blue-500" /> Niche Matrix Target
              </label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-5 text-sm outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-slate-700"
                  placeholder="e.g. Neo-Retro Wave"
                />
                <button 
                  onClick={runMarketScan}
                  disabled={isBusy}
                  className="absolute right-3 top-3 p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white rounded-2xl shadow-xl transition-all"
                >
                  {isBusy ? <RefreshCw className="animate-spin" size={20} /> : <TrendingUp size={20} />}
                </button>
              </div>
            </div>

            {isBusy && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Factory Flux</span>
                  <span className="text-blue-500 font-mono">{progress}%</span>
                </div>
                <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                  <div className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_20px_rgba(59,130,246,0.6)] rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Network size={14} className="text-emerald-500" /> Neural Event Stream
              </label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 h-72 overflow-y-auto custom-scrollbar font-mono text-[10px] leading-loose shadow-inner">
                {logs.map((log, i) => (
                  <div key={i} className="mb-2 flex gap-3 animate-in slide-in-from-left-2 duration-300">
                    <span className="text-slate-700 shrink-0 font-bold">»</span>
                    <span className={log.includes('✅') ? 'text-emerald-400 font-bold' : log.includes('ERROR') ? 'text-red-500 font-bold' : 'text-slate-400'}>{log}</span>
                  </div>
                ))}
                {logs.length === 0 && <div className="text-slate-800 italic text-center mt-28 opacity-50">System Ready. Awaiting Input.</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="lg:col-span-8">
          {activeTab === 'factory' && (
            <div className="space-y-8 animate-in zoom-in-95 duration-700">
              {opportunities.length > 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl space-y-10">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-8">
                    <div>
                      <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tight">
                        <Sparkles className="text-blue-500" /> Production Opportunities
                      </h2>
                      <p className="text-slate-500 text-xs mt-1">Identified market gaps within the "{niche}" cluster.</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">Nexus Score: 98%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {opportunities.map((opp, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 p-8 rounded-[3rem] hover:border-blue-500/40 transition-all group relative overflow-hidden shadow-xl hover:shadow-blue-500/5">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.15] transition-all group-hover:scale-125 duration-700">
                          <Shirt size={80} className="text-blue-500" />
                        </div>
                        <h4 className="text-2xl font-black mb-1 group-hover:text-blue-400 transition-colors">{opp.productName}</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Blueprint: {opp.blueprint || 'Apparel Node'}</p>
                        
                        <div className="flex items-center gap-10 mb-8">
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Projected Margin</p>
                            <p className="text-3xl font-black text-emerald-500">{opp.margin}%</p>
                          </div>
                          <div className="h-12 w-px bg-slate-800" />
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Demand Index</p>
                            <div className="flex gap-1 mt-1">
                               {[...Array(5)].map((_, i) => (
                                 <div key={i} className={`w-3 h-3 rounded-sm ${i < 4 ? 'bg-blue-500' : 'bg-slate-800'}`} />
                               ))}
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => forgePODProduct(opp)}
                          disabled={isBusy}
                          className="w-full py-5 bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 text-slate-400 hover:text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl"
                        >
                          <Palette size={16} /> Inject Neural Design
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 border-4 border-dashed border-slate-800 rounded-[4rem] h-[640px] flex flex-col items-center justify-center text-center p-12 opacity-50 shadow-inner">
                  <div className="relative mb-10">
                    <Shirt size={100} className="text-slate-800" />
                    <Sparkles className="absolute -top-4 -right-4 text-blue-500 animate-pulse" size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-700 uppercase tracking-tighter">Production Matrix Standby</h3>
                  <p className="text-slate-800 max-w-sm mt-4 text-sm font-black leading-relaxed">Nexus is awaiting a niche extraction target to initiate the autonomous POD production lifecycle. Input a cluster and scan the Printify Blueprint Library.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-10 duration-700">
               {[
                 { name: 'SwiftPOD (US-East)', status: 'Primary', load: '14%', ping: '12ms', country: 'USA' },
                 { name: 'Monster Digital (US-Central)', status: 'Active', load: '32%', ping: '45ms', country: 'USA' },
                 { name: 'Print Elements (EU-West)', status: 'Active', load: '11%', ping: '110ms', country: 'Europe' },
                 { name: 'District Photo (US-East)', status: 'Standby', load: '2%', ping: '18ms', country: 'USA' }
               ].map((p, i) => (
                 <div key={i} className="bg-slate-900 border border-slate-800 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                   <div className="flex justify-between items-start mb-8 relative z-10">
                     <div className="p-5 bg-blue-500/10 text-blue-500 rounded-[2rem] border border-blue-500/20 shadow-xl ring-1 ring-blue-500/10">
                       <Truck size={32} />
                     </div>
                     <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${p.status === 'Primary' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                       {p.status}
                     </div>
                   </div>
                   <div className="relative z-10">
                     <h3 className="text-2xl font-black text-white">{p.name}</h3>
                     <p className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-2 mt-1"><MapPin size={10} /> {p.country} Cluster</p>
                   </div>
                   <div className="mt-10 grid grid-cols-2 gap-8 relative z-10 border-t border-slate-800 pt-8">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Current Load</p>
                        <p className="text-xl font-black text-blue-400">{p.load}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">API Response</p>
                        <p className="text-xl font-black text-emerald-500">{p.ping}</p>
                     </div>
                   </div>
                   <div className="absolute bottom-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-700">
                     <Globe size={180} />
                   </div>
                 </div>
               ))}
               <div className="md:col-span-2 bg-blue-600/5 border border-dashed border-blue-500/30 rounded-[3.5rem] p-12 text-center shadow-inner">
                  <Package size={64} className="mx-auto text-blue-500/40 mb-6" />
                  <h4 className="text-slate-200 font-black text-xl uppercase tracking-tighter">Intelligent Routing Engaged</h4>
                  <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto leading-relaxed">Orders are autonomously routed based on geographic proximity, stock availability, and production queue load. Real-time handshake with Printify Cloud is maintained 24/7.</p>
               </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-1000">
              <div className="px-10 py-10 border-b border-slate-800 flex items-center justify-between bg-slate-950/40 backdrop-blur-3xl">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-blue-600/10 text-blue-500 rounded-[2rem] border border-blue-500/20 shadow-2xl ring-1 ring-blue-500/10">
                    <Layers size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-white">Extraction Library</h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                       <CheckCircle size={12} className="text-emerald-500" /> Multimodal Store Sync Active
                    </p>
                  </div>
                </div>
                <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] text-[10px] font-black transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20 uppercase tracking-widest ring-1 ring-blue-400/30">
                  <CloudSync size={16} /> Sync Store Matrix
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/20 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                    <tr>
                      <th className="px-10 py-8">Neural Asset Specification</th>
                      <th className="px-10 py-8">Provider</th>
                      <th className="px-10 py-8 text-center">ROI Index</th>
                      <th className="px-10 py-8 text-right">Orders</th>
                      <th className="px-10 py-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/10 transition-all group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div 
                              className="w-20 h-20 rounded-[2rem] bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 relative shadow-2xl group-hover:border-blue-500/50 transition-all cursor-pointer"
                              onClick={() => setSelectedProduct(p)}
                            >
                                {p.mockup ? <img src={p.mockup} className="w-full h-full object-cover" /> : <Box size={32} className="text-slate-800" />}
                                <div className="absolute bottom-1 right-1 w-4 h-4 bg-blue-500 border-4 border-slate-950 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                            </div>
                            <div>
                              <p className="font-black text-white text-xl leading-none">{p.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-2">{p.niche} Cluster • {p.blueprint}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="space-y-1">
                             <p className="text-sm font-bold text-slate-300">{p.printProvider}</p>
                             <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <div className="w-2 h-2 rounded-full bg-slate-700" />
                             </div>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-center">
                           <span className="px-5 py-2 rounded-2xl text-[10px] font-black border border-blue-500/30 text-blue-400 bg-blue-500/5 shadow-sm">{p.margin}%</span>
                        </td>
                        <td className="px-10 py-8 text-right font-black text-white text-2xl tracking-tighter">
                          {p.sales.toLocaleString()}
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => setSelectedProduct(p)} className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all border border-slate-700 shadow-xl"><Eye size={18} /></button>
                            <button className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all border border-slate-700 shadow-xl"><ExternalLink size={18} /></button>
                            <button onClick={() => setProducts(pr => pr.filter(i => i.id !== p.id))} className="p-3.5 bg-slate-800 hover:bg-red-900/30 text-red-500 rounded-2xl transition-all border border-slate-700 shadow-xl"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: 'Cumulative Yield', value: '$12,842.00', delta: '+14.5%', color: 'blue', icon: <DollarSign size={24} /> },
                    { label: 'Orders (24h)', value: '84', delta: '+2', color: 'emerald', icon: <ShoppingBag size={24} /> },
                    { label: 'Factory Efficiency', value: '99.4%', delta: 'Peak', color: 'purple', icon: <Gauge size={24} /> }
                  ].map((s, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                      <div className={`absolute top-0 right-0 p-10 text-${s.color}-500 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-125 duration-700`}>{s.icon}</div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                        {s.label}
                      </p>
                      <p className="text-5xl font-black tracking-tighter text-white leading-none">{s.value}</p>
                      <p className={`text-[10px] font-black mt-6 text-${s.color}-500 uppercase flex items-center gap-2`}>
                        <ArrowUpRight size={14} /> {s.delta} Neural Shift
                      </p>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-10 shadow-2xl">
                    <h3 className="text-xl font-black mb-10 flex items-center gap-4 text-white uppercase tracking-widest">
                      <BarChart3 className="text-blue-500" /> Revenue Extraction Scaling
                    </h3>
                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockMetricData}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', fontSize: '11px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#3b82f6' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-10 shadow-2xl">
                    <h3 className="text-xl font-black mb-10 flex items-center gap-4 text-white uppercase tracking-widest">
                      <TrendingUp className="text-emerald-500" /> Yield per Asset Node
                    </h3>
                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={products.map(p => ({ name: p.name.split(' ')[0], yield: p.sales * p.price }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', fontSize: '11px', fontWeight: 'bold' }}
                          />
                          <Bar dataKey="yield" fill="#10b981" radius={[12, 12, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintifyAutomator;
