
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Sparkles, RefreshCw, Layers, 
  Trash2, ExternalLink, PenTool, Layout, Image as ImageIcon,
  ShoppingBag, Globe, Zap, History, ChevronRight, X, 
  Eye, FileDown, Printer, MapPin, Tag, DownloadCloud,
  FileText, ArrowRight, BrainCircuit, ShieldCheck
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface Chapter {
  title: string;
  content: string;
}

interface EBook {
  id: string;
  title: string;
  niche: string;
  price: number;
  status: 'Researching' | 'Drafting' | 'Review' | 'Published';
  outline: string[];
  chapters: Chapter[];
  mockup: string | null;
  description: string;
  listings?: {
    gumroad: any;
    etsy: any;
  };
}

const EBookAutomator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'research' | 'author' | 'publish' | 'library'>('research');
  const [niche, setNiche] = useState('Personal Finance for Gen Z');
  const [isBusy, setIsBusy] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [currentBook, setCurrentBook] = useState<Partial<EBook>>({});
  const [books, setBooks] = useState<EBook[]>([]);
  const [progress, setProgress] = useState(0);
  const [viewingBook, setViewingBook] = useState<EBook | null>(null);

  const addLog = (msg: string) => {
    console.log(`[EBookPilot] ${msg}`);
  };

  const performResearch = async () => {
    setIsBusy(true);
    addLog(`Scanning market gaps for ${niche}...`);
    const result = await geminiService.performGapAnalysis(niche);
    setAnalysis(result);
    setIsBusy(false);
  };

  const startAuthoring = async (opportunity: any) => {
    setIsBusy(true);
    setProgress(5);
    setActiveTab('author');
    addLog(`Forging core manuscript structure for: ${opportunity.productName}...`);
    
    // Forge outline and base details
    const details = await geminiService.forgeOmniProduct(niche, 'E-BOOK');
    setCurrentBook({
      id: Math.random().toString(36).substr(2, 9),
      title: details.title || opportunity.productName,
      niche: niche,
      price: details.price || 49,
      outline: details.outline || ['Introduction', 'The Problem', 'Deep Solutions', 'Implementation', 'Final Thoughts'],
      chapters: [],
      status: 'Drafting'
    });
    
    setProgress(20);
    setIsBusy(false);
  };

  const synthesizeChapters = async () => {
    if (!currentBook.outline || !currentBook.title) return;
    setIsBusy(true);
    setProgress(25);
    
    const authoredChapters: Chapter[] = [];
    for (let i = 0; i < currentBook.outline.length; i++) {
      const chapterTitle = currentBook.outline[i];
      addLog(`Synthesizing Chapter ${i + 1}: ${chapterTitle}...`);
      const content = await geminiService.authorChapter(chapterTitle, currentBook.title, niche);
      authoredChapters.push({ title: chapterTitle, content });
      setProgress(25 + ((i + 1) * (50 / currentBook.outline.length)));
    }
    
    setCurrentBook(prev => ({ ...prev, chapters: authoredChapters, status: 'Review' }));
    setIsBusy(false);
    setProgress(100);
  };

  const generateAIAsets = async () => {
    if (!currentBook.title) return;
    setIsBusy(true);
    addLog(`Forging cinematic cover art for ${currentBook.title}...`);
    const mockup = await geminiService.generateMockup(`Professional, high-end e-book cover for "${currentBook.title}" in the niche "${niche}". Minimalist and modern.`);
    
    addLog(`Synthesizing SEO listings for Gumroad and Etsy...`);
    const listings = await geminiService.generateListingMetadata(
      currentBook.title, 
      currentBook.description || "Comprehensive guide authored by Nexus AI.", 
      currentBook.price || 49, 
      niche
    );
    
    setCurrentBook(prev => ({ ...prev, mockup, listings }));
    setIsBusy(false);
  };

  const publishToLibrary = () => {
    if (!currentBook.id) return;
    const finalBook = { ...currentBook, status: 'Published' } as EBook;
    setBooks(prev => [finalBook, ...prev]);
    setCurrentBook({});
    setActiveTab('library');
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-24">
      {/* Reader Modal */}
      {viewingBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setViewingBook(null)} />
          <div className="relative w-full max-w-5xl h-[90vh] bg-white text-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl">
                  <BookOpen className="text-amber-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800">{viewingBook.title}</h2>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Nexus AI Digital Manuscript</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50"><FileDown size={18}/></button>
                <button onClick={() => setViewingBook(null)} className="p-3 bg-red-50/10 hover:bg-red-50 text-red-600 rounded-xl transition-all ml-4"><X size={18} /></button>
              </div>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              <div className="w-72 border-r border-slate-100 p-8 overflow-y-auto bg-slate-50/50">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Contents</h3>
                <div className="space-y-2">
                  {viewingBook.chapters.map((chap, idx) => (
                    <button key={idx} className="w-full text-left p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all group border border-transparent hover:border-slate-100">
                      <p className="text-[9px] text-amber-600 font-mono mb-1">CHAPTER {idx + 1}</p>
                      <p className="text-xs font-bold text-slate-700">{chap.title}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-16 md:p-24 custom-scrollbar scroll-smooth">
                <div className="max-w-2xl mx-auto space-y-16">
                  <div className="text-center space-y-6">
                    <img src={viewingBook.mockup || ''} className="w-64 h-80 mx-auto rounded-xl shadow-2xl border-4 border-white" />
                    <h1 className="text-6xl font-serif text-slate-900 tracking-tight italic">{viewingBook.title}</h1>
                    <div className="h-0.5 w-16 bg-amber-500 mx-auto" />
                    <p className="text-slate-400 font-mono text-sm tracking-[0.2em] uppercase">Authored by Nexus Intelligence</p>
                  </div>
                  {viewingBook.chapters.map((chap, idx) => (
                    <div key={idx} className="space-y-8 pt-16 border-t border-slate-100">
                      <h2 className="text-3xl font-serif font-bold text-slate-800">Chapter {idx + 1}: {chap.title}</h2>
                      <div className="text-lg font-serif text-slate-700 leading-relaxed text-justify first-letter:text-5xl first-letter:font-bold first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left whitespace-pre-wrap">
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
          <div className="p-4 bg-amber-500/10 rounded-3xl border border-amber-500/20 shadow-2xl shadow-amber-500/10">
            <BookOpen className="text-amber-500" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight">EBook <span className="text-amber-500">Pilot</span></h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-1">Autonomous Neural Authorship & Merchant Sync</p>
          </div>
        </div>

        <div className="flex bg-slate-900/50 p-2 rounded-3xl border border-slate-800 backdrop-blur-xl">
          {(['research', 'author', 'publish', 'library'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Research / Market Panel */}
        {activeTab === 'research' && (
          <div className="lg:col-span-12 space-y-8 animate-in zoom-in-95 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                    <BrainCircuit className="text-amber-500" /> Market Gap Injection
                  </h2>
                  <p className="text-slate-500 text-sm">Scan global digital marketplaces for high-yield content opportunities.</p>
                </div>
                <div className="relative w-full md:w-[400px]">
                  <input 
                    type="text" 
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-5 text-sm outline-none focus:border-amber-500/50 transition-all font-bold"
                    placeholder="Enter niche focus..."
                  />
                  <button 
                    onClick={performResearch}
                    disabled={isBusy}
                    className="absolute right-3 top-3 p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl transition-all"
                  >
                    {isBusy ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
                  </button>
                </div>
              </div>

              {analysis && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-800/50">
                  {analysis.opportunities.map((opp: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-8 rounded-[2.5rem] hover:border-amber-500/30 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-100 transition-opacity">
                        <PenTool size={64} className="text-amber-500" />
                      </div>
                      <h4 className="text-xl font-black mb-1">{opp.productName}</h4>
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6">High Potential Extraction Zone</p>
                      
                      <div className="flex items-center gap-10 mb-8">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Est. Margin</p>
                          <p className="text-2xl font-black text-slate-200">{opp.margin}%</p>
                        </div>
                        <div className="h-10 w-px bg-slate-800" />
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Gap Index</p>
                          <p className="text-2xl font-black text-slate-200">High</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => startAuthoring(opp)}
                        className="w-full py-4 bg-slate-900 hover:bg-amber-600 border border-slate-800 hover:border-amber-500 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl"
                      >
                        <Layout size={14} /> Initialize Pilot
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Authorship Panel */}
        {activeTab === 'author' && (
          <div className="lg:col-span-12 space-y-8 animate-in slide-in-from-right-10 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Layers size={16} /> Manuscript Map
                  </h3>
                  <div className="space-y-3">
                    {currentBook.outline?.map((o, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                        <span className="text-amber-500 font-mono text-xs">0{i+1}</span>
                        <span className="text-xs font-bold text-slate-300 truncate">{o}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={synthesizeChapters}
                    disabled={isBusy || currentBook.chapters?.length! > 0}
                    className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-30 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-amber-600/20"
                  >
                    {isBusy ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    Synthesize Content
                  </button>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 h-full shadow-2xl relative overflow-hidden">
                   {isBusy && (
                     <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Neural Synthesizer Active: {progress}%</p>
                     </div>
                   )}
                   
                   <div className="flex justify-between items-center mb-10">
                      <div>
                        <h2 className="text-3xl font-black text-slate-100">{currentBook.title || 'Untitled Pilot'}</h2>
                        <p className="text-amber-500 text-xs font-mono font-black mt-1 uppercase tracking-widest">{niche} Cluster</p>
                      </div>
                      {currentBook.chapters?.length! > 0 && (
                        <button 
                          onClick={() => setActiveTab('publish')}
                          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-600/20"
                        >
                          Proceed to Forge <ArrowRight size={14} />
                        </button>
                      )}
                   </div>

                   <div className="space-y-10 overflow-y-auto max-h-[600px] pr-4 custom-scrollbar">
                     {currentBook.chapters?.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-24">
                          <PenTool size={80} className="text-slate-800 mb-6" />
                          <p className="text-sm font-mono uppercase tracking-widest">Manuscript standby. Trigger synthesis to populate chapters.</p>
                       </div>
                     ) : (
                       currentBook.chapters?.map((chap, idx) => (
                         <div key={idx} className="space-y-4 border-b border-slate-800 pb-10">
                            <h4 className="text-amber-500 font-mono text-xs font-black">CHAPTER {idx + 1}: {chap.title}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{chap.content}</p>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Publishing Panel */}
        {activeTab === 'publish' && (
          <div className="lg:col-span-12 space-y-8 animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl flex flex-col lg:flex-row gap-12">
               <div className="shrink-0 space-y-6">
                 <div className="w-80 h-[480px] bg-slate-950 border-4 border-slate-800 rounded-3xl overflow-hidden relative group shadow-2xl">
                    {currentBook.mockup ? (
                      <img src={currentBook.mockup} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <ImageIcon size={48} className="text-slate-800 mb-4" />
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No Visual Forge Detected</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <button 
                  onClick={generateAIAsets}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"
                 >
                   <ImageIcon size={14} /> Forge Cover & Metadata
                 </button>
               </div>

               <div className="flex-1 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-2xl w-fit">
                        <Globe size={16} className="text-pink-500" />
                        <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Gumroad Hub</span>
                      </div>
                      <div className="space-y-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
                         <div>
                           <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Generated Title</p>
                           <p className="text-sm font-bold text-slate-200">{currentBook.listings?.gumroad?.title || 'Waiting...'}</p>
                         </div>
                         <div>
                           <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Tags</p>
                           <div className="flex flex-wrap gap-2 mt-2">
                             {currentBook.listings?.gumroad?.tags.map((t: string, i: number) => (
                               <span key={i} className="px-2 py-1 bg-slate-900 rounded-lg text-[9px] text-pink-400">#{t}</span>
                             ))}
                           </div>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl w-fit">
                        <ShoppingBag size={16} className="text-orange-500" />
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Etsy Merchant</span>
                      </div>
                      <div className="space-y-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
                         <div>
                           <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Search Optimized Title</p>
                           <p className="text-sm font-bold text-slate-200">{currentBook.listings?.etsy?.title || 'Waiting...'}</p>
                         </div>
                         <div>
                           <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Search Tags</p>
                           <div className="flex flex-wrap gap-2 mt-2">
                             {currentBook.listings?.etsy?.tags.map((t: string, i: number) => (
                               <span key={i} className="px-2 py-1 bg-slate-900 rounded-lg text-[9px] text-orange-400">#{t}</span>
                             ))}
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                        {/* Fix: Added missing ShieldCheck import from lucide-react. */}
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100">Ready for Global Launch</p>
                        <p className="text-xs text-slate-500">Asset finalized across all neural nodes.</p>
                      </div>
                    </div>
                    <button 
                      onClick={publishToLibrary}
                      className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-emerald-600/20"
                    >
                      Publish to Library <ChevronRight size={16} />
                    </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Library Panel */}
        {activeTab === 'library' && (
          <div className="lg:col-span-12 space-y-8 animate-in slide-in-from-bottom-10 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map(book => (
                <div key={book.id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden group shadow-xl hover:border-amber-500/30 transition-all">
                   <div className="h-64 bg-slate-950 relative overflow-hidden">
                      {book.mockup ? (
                        <img src={book.mockup} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-800"><ImageIcon size={48} /></div>
                      )}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">
                        {book.status}
                      </div>
                   </div>
                   <div className="p-6 space-y-4">
                      <h4 className="text-lg font-black text-slate-100 truncate">{book.title}</h4>
                      <div className="flex justify-between items-center">
                         <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{book.niche}</p>
                         <p className="text-lg font-black text-slate-200">${book.price}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-800 flex gap-2">
                        <button 
                          onClick={() => setViewingBook(book)}
                          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                          <Eye size={12} /> Read
                        </button>
                        <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
                          <ExternalLink size={12} />
                        </button>
                        <button 
                          onClick={() => setBooks(prev => prev.filter(b => b.id !== book.id))}
                          className="p-2 bg-slate-800 hover:bg-red-900/30 text-red-500 rounded-xl transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                   </div>
                </div>
              ))}
              
              {books.length === 0 && (
                <div className="col-span-full py-24 text-center space-y-6 bg-slate-900/50 border border-dashed border-slate-800 rounded-[3rem] opacity-30">
                   <BookOpen size={80} className="mx-auto text-slate-800" />
                   <div className="space-y-2">
                     <p className="text-xl font-black uppercase tracking-widest text-slate-700">Digital Archive Empty</p>
                     <p className="text-sm text-slate-800 max-w-xs mx-auto">Trigger the authorship cycle to populate your digital extraction library.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EBookAutomator;
