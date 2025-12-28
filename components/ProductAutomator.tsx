
import React, { useState, useEffect, useRef } from 'react';
import { 
  Store, Hammer, Package, Share2, TrendingUp, RefreshCw, 
  Plus, Trash2, ExternalLink, CheckCircle, AlertCircle, 
  Zap, ArrowRight, ShoppingCart, Globe, ShieldCheck, 
  Sparkles, BarChart, ShoppingBag, ZapOff, Eye, FileText, 
  Search, Image as ImageIcon, DollarSign, Activity, Shirt, Box,
  Layers, ChevronRight, Cpu, Network, BookOpen, DownloadCloud, 
  Upload, CloudSync, ArrowUpRight, X, ChevronLeft, Save, 
  FileDown, Printer, History, Bell, Map, Tag
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface Chapter {
  title: string;
  content: string;
}

interface ListingMetadata {
  title: string;
  description: string;
  tags: string[];
}

interface Product {
  id: string;
  name: string;
  type: 'DIGITAL' | 'POD' | 'E-BOOK';
  niche: string;
  price: number;
  cogs: number;
  status: 'Draft' | 'Active' | 'Producing' | 'Sold Out';
  sync: { etsy: boolean; gumroad: boolean; printify: boolean };
  revenue: number;
  mockup?: string | null;
  outline?: string[];
  chapters?: Chapter[];
  chapterPreview?: string;
  description?: string;
  listings?: {
    gumroad?: ListingMetadata;
    etsy?: ListingMetadata;
  };
}

interface SalesEvent {
  id: string;
  productName: string;
  amount: number;
  platform: 'Etsy' | 'Gumroad';
  time: string;
}

const ProductAutomator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'production' | 'inventory' | 'listings' | 'ledger'>('strategy');
  const [niche, setNiche] = useState('Passive Income for Creatives');
  const [isBusy, setIsBusy] = useState(false);
  const [autopilot, setAutopilot] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [forgeLogs, setForgeLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [salesEvents, setSalesEvents] = useState<SalesEvent[]>([]);

  const [products, setProducts] = useState<Product[]>([
    { 
      id: '1', 
      name: 'Neural Authoring Pro', 
      type: 'E-BOOK', 
      niche: 'AI', 
      price: 97, 
      cogs: 0, 
      status: 'Active', 
      sync: { etsy: true, gumroad: true, printify: false }, 
      revenue: 2425, 
      outline: ['Intro', 'AI Basics', 'Neural Networks', 'Agent Orchestration', 'Conclusion'], 
      chapterPreview: 'The era of silicon consciousness is not approaching; it has arrived...',
      chapters: [
        { title: 'Intro', content: 'The era of silicon consciousness is not approaching; it has arrived. This book explores the convergence of human intent and neural processing.' },
        { title: 'AI Basics', content: 'Artificial Intelligence is at its core a statistical mirror. We feed it our history, and it predicts our future.' }
      ],
      listings: {
        gumroad: { title: 'Neural Authoring Pro: The AI-First Playbook', description: 'Unlock the power of autonomous writing agents with our high-fidelity guide.', tags: ['AI', 'Writing', 'SaaS', 'E-book'] },
        etsy: { title: 'AI Writing Guide - Digital Download - Creative AI Ebook', description: 'A beautiful digital guide for creatives looking to master AI tools.', tags: ['Digital Art', 'AI Tools', 'Creative Guide', 'Ebook'] }
      }
    },
    { id: '2', name: 'Premium Heavyweight Tee', type: 'POD', niche: 'Tech', price: 45, cogs: 18.20, status: 'Active', sync: { etsy: true, gumroad: false, printify: true }, revenue: 890 },
  ]);

  const addLog = (msg: string) => setForgeLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));

  useEffect(() => {
    if (autopilot) {
      const interval = setInterval(() => {
        const product = products[Math.floor(Math.random() * products.length)];
        const platform = Math.random() > 0.5 ? 'Etsy' : 'Gumroad';
        const newSale: SalesEvent = {
          id: Math.random().toString(36).substr(2, 9),
          productName: product.name,
          amount: product.price,
          platform,
          time: 'JUST NOW'
        };
        setSalesEvents(prev => [newSale, ...prev].slice(0, 5));
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, revenue: p.revenue + p.price } : p));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autopilot, products]);

  const runAnalysis = async () => {
    setIsBusy(true);
    addLog(`>> Initializing Omni-Channel Neural Market Scan for "${niche}"...`);
    const result = await geminiService.performGapAnalysis(niche);
    setAnalysis(result);
    addLog(`>> Analysis complete. Recommended extraction zones identified.`);
    setIsBusy(false);
  };

  const forgeProduct = async (opp: any) => {
    setIsBusy(true);
    setProgress(0);
    setActiveTab('production');
    addLog(`>> Initializing Production Factory for: ${opp.productName}...`);
    
    setProgress(5);
    const details = await geminiService.forgeOmniProduct(niche, opp.type);
    
    let synthesizedChapters: Chapter[] = [];
    let merchantListings = null;

    if (opp.type === 'E-BOOK') {
      addLog(`>> Generating full outline structure...`);
      setProgress(15);
      await new Promise(r => setTimeout(r, 600));
      
      const outline = details.outline || ['Introduction', 'Core Concepts', 'Deep Dive', 'Case Studies', 'Conclusion'];

      for (let i = 0; i < outline.length; i++) {
        const chapterTitle = outline[i];
        addLog(`>> Authoring Chapter ${i+1}: ${chapterTitle}...`);
        const chapterContent = await geminiService.authorChapter(chapterTitle, details.title || opp.productName, niche);
        synthesizedChapters.push({ title: chapterTitle, content: chapterContent });
        setProgress(15 + ((i + 1) * (40 / outline.length)));
      }
      
      addLog(`>> Synthesizing SEO Listing Metadata (Gumroad & Etsy APIs)...`);
      merchantListings = await geminiService.generateListingMetadata(details.title || opp.productName, details.description || "", details.price || 49, niche);
      setProgress(75);
    }

    addLog(`>> Forging Cinematic 3D Mockup (Gemini-3 Pro Image)...`);
    const mockup = await geminiService.generateMockup(details.designPrompt || `Premium book cover for ${opp.productName} in minimal style.`);
    setProgress(85);
    
    addLog(`>> Automated Listing: Provisioning Gumroad Listing + Syncing to Etsy...`);
    await new Promise(r => setTimeout(r, 1200));

    const newProd: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: details.title || opp.productName,
      type: opp.type,
      niche: niche,
      price: details.price || 49,
      cogs: details.cogs || 0,
      status: 'Active',
      sync: { 
        etsy: true, 
        gumroad: opp.type !== 'POD', 
        printify: opp.type === 'POD' 
      },
      revenue: 0,
      mockup: mockup,
      outline: details.outline,
      chapters: synthesizedChapters,
      chapterPreview: details.chapterPreview,
      description: details.description,
      listings: merchantListings
    };

    setProducts(prev => [newProd, ...prev]);
    setProgress(100);
    addLog(`✅ DEPLOYMENT SUCCESS: "${newProd.name}" is LIVE on all enabled platforms.`);
    setIsBusy(false);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-20 relative">
      {/* Manuscript Viewer Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setViewingProduct(null)} />
          <div className="relative w-full max-w-6xl h-full bg-slate-900 border border-slate-800 rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col">
             <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                   <BookOpen className="text-emerald-500" size={24} />
                 </div>
                 <div>
                   <h2 className="text-xl font-black">{viewingProduct.name}</h2>
                   <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{viewingProduct.niche} Extraction Cluster</p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-all border border-slate-700"><FileDown size={18}/></button>
                 <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-all border border-slate-700"><Printer size={18}/></button>
                 <button onClick={() => setViewingProduct(null)} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all ml-4 border border-red-500/20"><X size={18} /></button>
               </div>
             </div>
             
             <div className="flex-1 flex overflow-hidden">
                <div className="w-80 border-r border-slate-800 p-8 overflow-y-auto custom-scrollbar bg-slate-950/40 space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Map size={12} className="text-blue-500" /> Navigation
                    </h3>
                    <div className="space-y-2">
                      {viewingProduct.chapters?.map((chap, idx) => (
                        <button key={idx} className="w-full text-left p-4 rounded-2xl hover:bg-slate-800/50 transition-all group border border-transparent hover:border-slate-700">
                          <p className="text-[9px] text-slate-600 font-mono mb-1 uppercase">Chapter {idx + 1}</p>
                          <p className="text-xs font-bold text-slate-300 group-hover:text-white truncate">{chap.title}</p>
                        </button>
                      ))}
                      {!viewingProduct.chapters?.length && <p className="text-xs italic text-slate-700">No chapters found.</p>}
                    </div>
                  </div>

                  {viewingProduct.listings && (
                    <div className="space-y-4 pt-8 border-t border-slate-800">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Tag size={12} className="text-emerald-500" /> SEO Listings
                      </h3>
                      <div className="space-y-3">
                        {viewingProduct.listings.gumroad && (
                          <div className="p-4 bg-pink-500/5 border border-pink-500/20 rounded-2xl">
                             <p className="text-[8px] font-black text-pink-500 uppercase mb-2">Gumroad Node</p>
                             <p className="text-[10px] font-bold text-slate-300 line-clamp-2">{viewingProduct.listings.gumroad.title}</p>
                          </div>
                        )}
                        {viewingProduct.listings.etsy && (
                          <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
                             <p className="text-[8px] font-black text-orange-500 uppercase mb-2">Etsy Node</p>
                             <p className="text-[10px] font-bold text-slate-300 line-clamp-2">{viewingProduct.listings.etsy.title}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto p-12 md:p-20 custom-scrollbar bg-slate-50">
                   <div className="max-w-3xl mx-auto space-y-12 py-12">
                      <div className="text-center space-y-6 mb-24">
                        <div className="relative inline-block group">
                          <img src={viewingProduct.mockup || ''} className="w-80 h-80 mx-auto rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.15)] border-[12px] border-white transition-transform group-hover:scale-105 duration-500" />
                          <div className="absolute inset-0 rounded-3xl border border-black/5" />
                        </div>
                        <div className="space-y-4">
                          <h1 className="text-6xl font-serif text-slate-900 tracking-tight leading-tight">{viewingProduct.name}</h1>
                          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full" />
                          <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Authored by Nexus Omni-Merchant</p>
                        </div>
                      </div>

                      {viewingProduct.chapters?.map((chap, idx) => (
                        <div key={idx} className="space-y-10 border-t border-slate-200 pt-20 pb-10">
                          <div className="flex flex-col gap-4">
                            <span className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-widest">Neural Chapter 0{idx + 1}</span>
                            <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">{chap.title}</h2>
                          </div>
                          <div className="text-xl font-serif text-slate-700 leading-relaxed text-justify first-letter:text-6xl first-letter:font-bold first-letter:text-emerald-600 first-letter:mr-4 first-letter:float-left first-letter:leading-none whitespace-pre-wrap">
                            {chap.content}
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Header HUD */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
            <Store className="text-emerald-500" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight">Omni-Merchant <span className="text-emerald-500 text-3xl font-mono">v4.7</span></h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-1">Autonomous E-Book Synthesis & Multi-Channel Sync</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-3xl border border-slate-800 backdrop-blur-xl">
           <button 
             onClick={() => setAutopilot(!autopilot)}
             className={`px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-3 border-2 ${autopilot ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
           >
             {autopilot ? <Zap size={16} className="fill-emerald-400 animate-pulse" /> : <ZapOff size={16} />}
             {autopilot ? 'AUTOPILOT: OPERATIONAL' : 'AUTOPILOT: STANDBY'}
           </button>
           <div className="h-8 w-px bg-slate-800 mx-2" />
           <div className="flex gap-1">
            {(['strategy', 'production', 'inventory', 'listings', 'ledger'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Market Command */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden border-t-white/5">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Search size={14} className="text-emerald-500" /> Market Gap Injection
              </label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-5 text-sm outline-none focus:border-emerald-500/50 transition-all font-bold placeholder:text-slate-700"
                  placeholder="Inject niche target..."
                />
                <button 
                  onClick={runAnalysis}
                  disabled={isBusy}
                  className="absolute right-3 top-3 p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white rounded-2xl shadow-xl transition-all"
                >
                  {isBusy ? <RefreshCw className="animate-spin" size={20} /> : <TrendingUp size={20} />}
                </button>
              </div>
            </div>

            {isBusy && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Factory Saturation</span>
                  <span className="text-emerald-500 font-mono">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div className="h-full bg-emerald-500 transition-all duration-700 shadow-[0_0_15px_rgba(16,185,129,0.5)] rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Network size={14} className="text-blue-500" /> Production Log
              </label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] p-6 h-64 overflow-y-auto custom-scrollbar font-mono text-[10px] leading-loose">
                {forgeLogs.map((log, i) => (
                  <div key={i} className="mb-2 flex gap-3 animate-in slide-in-from-left-2 duration-300">
                    <span className="text-slate-700 shrink-0">>></span>
                    <span className={log.includes('✅') ? 'text-emerald-400 font-bold' : log.includes('ERROR') ? 'text-red-500' : 'text-slate-400'}>{log}</span>
                  </div>
                ))}
                {forgeLogs.length === 0 && <div className="text-slate-800 italic text-center mt-20">Awaiting market parameters...</div>}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <History size={14} className="text-pink-500" /> Live Sales Activity
              </label>
              <div className="space-y-3">
                {salesEvents.map(event => (
                  <div key={event.id} className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800/50 animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${event.platform === 'Etsy' ? 'text-orange-500 bg-orange-500/10' : 'text-pink-500 bg-pink-500/10'}`}>
                        <ShoppingBag size={12} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-200 truncate max-w-[120px]">{event.productName}</p>
                        <p className="text-[8px] text-slate-500 font-bold">{event.platform}</p>
                      </div>
                    </div>
                    <p className="text-xs font-black text-emerald-500">+${event.amount}</p>
                  </div>
                ))}
                {salesEvents.length === 0 && <p className="text-[10px] text-slate-700 italic text-center py-4">Awaiting first conversion...</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'strategy' && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              {analysis ? (
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                      <Sparkles className="text-emerald-500" /> Gap Analysis Output
                    </h2>
                    <div className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/20 uppercase tracking-[0.2em]">
                      Precision Intelligence
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {analysis.opportunities.map((opp: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
                          {opp.type === 'E-BOOK' ? <BookOpen size={48} className="text-emerald-500" /> : <Package size={48} className="text-blue-500" />}
                        </div>
                        <h4 className="text-xl font-black mb-1">{opp.productName}</h4>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6">{opp.type} Opportunity</p>
                        
                        <div className="flex items-center gap-10 mb-8">
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Yield Potential</p>
                            <p className="text-2xl font-black text-slate-200">{opp.margin}%</p>
                          </div>
                          <div className="h-10 w-px bg-slate-800" />
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Competition</p>
                            <p className="text-2xl font-black text-slate-200">{opp.competition}/100</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => forgeProduct(opp)}
                          disabled={isBusy}
                          className="w-full py-4 bg-slate-900 hover:bg-emerald-600 border border-slate-800 hover:border-emerald-500 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl"
                        >
                          <Hammer size={14} /> Forge & List Asset
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 border-4 border-dashed border-slate-800 rounded-[3rem] h-[500px] flex flex-col items-center justify-center text-center p-12 opacity-50">
                  <BarChart size={80} className="text-slate-800 mb-6" />
                  <h3 className="text-2xl font-black text-slate-700 uppercase tracking-tighter">Market Matrix Ready</h3>
                  <p className="text-slate-800 max-w-xs mt-2 text-sm font-bold">Provide a niche focus to scan multi-channel marketplaces for high-yield product gaps.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'production' && (
            <div className="space-y-6 animate-in slide-in-from-right-10 duration-700">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 {[
                   { name: 'E-Authoring', icon: <BookOpen />, status: isBusy ? 'Synthesizing' : 'Standby', color: 'emerald' },
                   { name: 'Gumroad API', icon: <Globe />, status: 'Connected', color: 'pink' },
                   { name: 'Etsy Merchant', icon: <ShoppingBag />, status: 'Connected', color: 'orange' },
                   { name: 'Storage CDN', icon: <DownloadCloud />, status: 'Optimized', color: 'blue' }
                 ].map((p, i) => (
                   <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl">
                     <div className="flex justify-between items-start mb-4">
                       <div className={`p-3 bg-${p.color}-500/10 text-${p.color}-500 rounded-2xl border border-${p.color}-500/20`}>
                         {p.icon}
                       </div>
                       <div className={`px-2 py-0.5 ${p.status === 'Synthesizing' ? 'bg-emerald-500/20 text-emerald-500 animate-pulse' : 'bg-slate-800 text-slate-500'} rounded-full text-[8px] font-black tracking-widest uppercase`}>
                         {p.status}
                       </div>
                     </div>
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.name}</h3>
                   </div>
                 ))}
               </div>

               {products[0] && (
                 <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                       <Cpu size={120} />
                    </div>
                    <div className="flex justify-between items-center mb-10">
                       <h3 className="text-xl font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                         <CloudSync size={20} className="text-emerald-500" /> Active Output Node
                       </h3>
                       <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black text-emerald-500 flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                           <Upload size={14} /> LIVE MERCHANT SYNC
                         </span>
                       </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                       <div className="relative shrink-0 group cursor-pointer" onClick={() => setViewingProduct(products[0])}>
                         {products[0].mockup ? (
                           <img src={products[0].mockup} className="w-64 h-64 rounded-[2.5rem] object-cover border-4 border-slate-800 shadow-2xl transition-transform group-hover:scale-105 duration-500" />
                         ) : (
                           <div className="w-64 h-64 rounded-[2.5rem] bg-slate-950 border-4 border-slate-800 flex items-center justify-center">
                             <RefreshCw className="animate-spin text-slate-800" size={48} />
                           </div>
                         )}
                         <div className="absolute -bottom-4 -right-4 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl ring-4 ring-slate-900">
                           {products[0].type === 'E-BOOK' ? <BookOpen size={24} /> : <FileText size={24} />}
                         </div>
                       </div>
                       
                       <div className="space-y-6 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-4xl font-black tracking-tighter text-slate-100">{products[0].name}</h4>
                              <p className="text-emerald-500 text-xs font-mono font-black mt-1 uppercase tracking-[0.2em]">{products[0].niche} Extraction • {products[0].type}</p>
                            </div>
                            <button 
                              onClick={() => setViewingProduct(products[0])}
                              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-700 transition-all flex items-center gap-2"
                            >
                              <Eye size={14} /> Full Manuscript
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap gap-4">
                            <div className="px-5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl">
                               <p className="text-[8px] font-black text-slate-600 uppercase mb-0.5">Asset Price</p>
                               <p className="text-xl font-black text-emerald-500">${products[0].price}</p>
                            </div>
                            <div className="px-5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl">
                               <p className="text-[8px] font-black text-slate-600 uppercase mb-0.5">Net Efficiency</p>
                               <p className="text-xl font-black text-blue-400">99.8%</p>
                            </div>
                          </div>

                          {products[0].outline && (
                            <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800/50 backdrop-blur-sm">
                               <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                                 <FileText size={14} className="text-blue-500" /> Synthesis Manifest:
                               </p>
                               <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                 {products[0].outline.map((o, i) => (
                                   <div key={i} className="text-[11px] text-slate-400 flex items-center gap-3 group">
                                     <span className="text-blue-900 font-mono text-[8px]">0{i+1}</span>
                                     <span className="truncate group-hover:text-slate-200 transition-colors">{o}</span>
                                   </div>
                                 ))}
                               </div>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-700">
               {products.filter(p => p.listings).map(p => (
                 <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl space-y-8">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-6">
                       <div className="flex items-center gap-4">
                          <img src={p.mockup || ''} className="w-16 h-16 rounded-xl object-cover" />
                          <div>
                            <h3 className="text-xl font-black">{p.name}</h3>
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Global SEO Metadata Clusters</p>
                          </div>
                       </div>
                       <button onClick={() => setViewingProduct(p)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-all border border-slate-700"><ExternalLink size={18} /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-6">
                          <div className="flex items-center gap-3 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-2xl w-fit">
                             <Globe size={16} className="text-pink-500" />
                             <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Gumroad Node</span>
                          </div>
                          <div className="space-y-4">
                             <div>
                               <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Optimized Title</p>
                               <p className="text-sm font-bold text-slate-200">{p.listings?.gumroad?.title}</p>
                             </div>
                             <div>
                               <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Sales Description</p>
                               <p className="text-xs text-slate-400 leading-relaxed">{p.listings?.gumroad?.description}</p>
                             </div>
                             <div className="flex flex-wrap gap-2">
                               {p.listings?.gumroad?.tags.map((t, i) => (
                                 <span key={i} className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] text-pink-500">#{t}</span>
                               ))}
                             </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <div className="flex items-center gap-3 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl w-fit">
                             <ShoppingBag size={16} className="text-orange-500" />
                             <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Etsy Node</span>
                          </div>
                          <div className="space-y-4">
                             <div>
                               <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Merchant Title</p>
                               <p className="text-sm font-bold text-slate-200">{p.listings?.etsy?.title}</p>
                             </div>
                             <div>
                               <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Creative Description</p>
                               <p className="text-xs text-slate-400 leading-relaxed">{p.listings?.etsy?.description}</p>
                             </div>
                             <div className="flex flex-wrap gap-2">
                               {p.listings?.etsy?.tags.map((t, i) => (
                                 <span key={i} className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] text-orange-500">#{t}</span>
                               ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-700">
              <div className="px-10 py-8 border-b border-slate-800 flex items-center justify-between bg-slate-800/20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">Digital Asset Matrix</h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">Live Fulfillment Sync</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black transition-all flex items-center gap-2 shadow-xl shadow-emerald-600/20 uppercase tracking-widest">
                  <RefreshCw size={14} /> Re-Sync Stores
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/40 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-10 py-6">Asset Specification</th>
                      <th className="px-10 py-6 text-center">Sync Nodes</th>
                      <th className="px-10 py-6 text-center">Node Type</th>
                      <th className="px-10 py-6 text-right">Yield</th>
                      <th className="px-10 py-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/20 transition-all group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <div 
                              className="w-16 h-16 rounded-[1.25rem] bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 relative shadow-inner cursor-pointer"
                              onClick={() => p.type === 'E-BOOK' && setViewingProduct(p)}
                            >
                                {p.mockup ? <img src={p.mockup} className="w-full h-full object-cover" /> : <Box size={24} className="text-slate-800" />}
                                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${p.type === 'E-BOOK' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'} border-4 border-slate-950 rounded-full`} />
                            </div>
                            <div>
                              <p className="font-black text-slate-100 text-lg leading-tight">{p.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter mt-1">{p.niche} Cluster</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <div className="flex justify-center gap-2">
                            <div className={`p-2.5 rounded-xl border transition-all ${p.sync.gumroad ? 'bg-pink-500/10 border-pink-500/30 text-pink-500 shadow-sm shadow-pink-500/10' : 'bg-slate-950 border-slate-800 text-slate-800'}`} title="Gumroad"><Globe size={16} /></div>
                            <div className={`p-2.5 rounded-xl border transition-all ${p.sync.etsy ? 'bg-orange-500/10 border-orange-500/30 text-orange-500 shadow-sm shadow-orange-500/10' : 'bg-slate-950 border-slate-800 text-slate-800'}`} title="Etsy"><ShoppingBag size={16} /></div>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                           <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black border ${p.type === 'E-BOOK' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5 shadow-sm shadow-emerald-500/5' : 'border-blue-500/30 text-blue-400 bg-blue-500/5 shadow-sm shadow-blue-500/5'}`}>{p.type}</span>
                        </td>
                        <td className="px-10 py-6 text-right font-black text-emerald-500 text-xl tracking-tighter">
                          ${p.revenue.toLocaleString()}
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => p.type === 'E-BOOK' && setViewingProduct(p)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-all"><Eye size={18} /></button>
                            <button onClick={() => setProducts(pr => pr.filter(i => i.id !== p.id))} className="p-3 bg-slate-800 hover:bg-red-900/30 text-red-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-10 duration-700">
              {[
                { label: 'Merchant Net (24h)', value: `$${products.reduce((a,b)=>a+b.revenue,0).toLocaleString()}`, delta: '+22.4%', color: 'emerald', icon: <DollarSign size={20} /> },
                { label: 'Active Extractions', value: products.length, delta: '+1 Live', color: 'blue', icon: <Plus size={20} /> },
                { label: 'Mean ROI Threshold', value: '99.4%', delta: 'Peak', color: 'purple', icon: <Activity size={20} /> }
              ].map((s, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl group hover:border-slate-700 transition-all relative overflow-hidden">
                  <div className={`absolute top-0 right-0 p-6 text-${s.color}-500/20 opacity-50`}>{s.icon}</div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    {s.label}
                  </p>
                  <p className="text-4xl font-black tracking-tighter text-slate-100">{s.value}</p>
                  <p className={`text-[10px] font-black mt-3 text-${s.color}-500 uppercase flex items-center gap-1`}>
                    <ArrowUpRight size={12} /> {s.delta} Performance
                  </p>
                </div>
              ))}
              <div className="col-span-full bg-slate-900 border border-slate-800 rounded-[3rem] p-16 flex flex-col items-center justify-center text-center border-dashed opacity-40">
                 <Box size={64} className="text-slate-800 mb-6" />
                 <h2 className="text-2xl font-black font-mono tracking-tighter text-slate-700 uppercase">Yield Hub Standby</h2>
                 <p className="text-slate-800 text-sm mt-2 max-w-sm font-bold">Connect verified Gumroad and Etsy merchant keys to enable autonomous payouts and high-fidelity scaling.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductAutomator;
