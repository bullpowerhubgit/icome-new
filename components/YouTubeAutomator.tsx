
import React, { useState, useEffect } from 'react';
import { 
  Youtube, Play, Sparkles, FileText, Video, 
  BarChart3, Clock, Send, Plus, RefreshCw, 
  Trash2, ExternalLink, TrendingUp, Info,
  CheckCircle, Globe, Share2, MousePointer2,
  Calendar, ListFilter, AlertCircle, Rocket,
  ShieldAlert
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const mockPerformanceData = [
  { day: 'Mon', views: 400, revenue: 2.1 },
  { day: 'Tue', views: 900, revenue: 5.4 },
  { day: 'Wed', views: 1200, revenue: 7.2 },
  { day: 'Thu', views: 800, revenue: 4.8 },
  { day: 'Fri', views: 2400, revenue: 14.4 },
  { day: 'Sat', views: 3200, revenue: 19.2 },
  { day: 'Sun', views: 2800, revenue: 16.8 },
];

interface QueueItem {
  id: string;
  title: string;
  topic: string;
  status: 'Ready' | 'Drafting' | 'Rendering' | 'Published';
  scheduledFor: string;
}

const YouTubeAutomator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [script, setScript] = useState('');
  const [metadata, setMetadata] = useState<{ title: string; description: string; tags: string }>({
    title: '',
    description: '',
    tags: ''
  });
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [isProducingVideo, setIsProducingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'analytics' | 'queue'>('create');
  const [publishingStep, setPublishingStep] = useState<number>(0); // 0: idle, 1: generating, 2: ready

  const [queue, setQueue] = useState<QueueItem[]>([
    { id: '1', title: 'Quantum Computing Explained', topic: 'Quantum Physics', status: 'Ready', scheduledFor: 'Today, 18:00' },
    { id: '2', title: 'Daily Nexus Tech Roundup', topic: 'Tech News', status: 'Drafting', scheduledFor: 'Tomorrow, 09:00' },
  ]);

  const generateFullContent = async () => {
    if (!topic.trim()) return;
    setPublishingStep(1);
    setIsGeneratingScript(true);
    try {
      // 1. Generate Script
      const scriptRes = await geminiService.getChatResponse(
        `Generate a viral YouTube script for a 5-minute video about "${topic}". Include a high-energy hook, 3 main narrative arcs, a strong call to action, and visual scene descriptions.`,
        []
      );
      setScript(scriptRes.text);

      // 2. Generate Metadata
      setIsGeneratingMetadata(true);
      const metaRes = await geminiService.getChatResponse(
        `For a YouTube video about "${topic}" with this script: "${scriptRes.text.substring(0, 500)}...", generate a click-worthy SEO Title, a detailed 3-paragraph Description, and 15 optimized Tags. Return as plain text clearly labeled.`,
        []
      );
      
      const titleMatch = metaRes.text.match(/Title:?\s*(.*)/i);
      const descMatch = metaRes.text.match(/Description:?\s*([\s\S]*?)(?=Tags:|$)/i);
      const tagsMatch = metaRes.text.match(/Tags:?\s*(.*)/i);

      setMetadata({
        title: titleMatch ? titleMatch[1].trim() : `${topic} Mastery`,
        description: descMatch ? descMatch[1].trim() : `Deep dive into ${topic}. Like and Subscribe!`,
        tags: tagsMatch ? tagsMatch[1].trim() : `${topic}, education, nexus ai`
      });

      setPublishingStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingScript(false);
      setIsGeneratingMetadata(false);
    }
  };

  const produceVideo = async () => {
    if (!script.trim()) return;
    setIsProducingVideo(true);
    try {
      const hookMatch = script.match(/Hook:?\s*(.*?)(?=\n|$)/i);
      const prompt = hookMatch ? hookMatch[1] : `Cinematic high-quality video about ${topic}`;
      const res = await geminiService.generateVideo(prompt, '16:9');
      setVideoUrl(res.url);
    } catch (e) {
      console.error(e);
    }
    setIsProducingVideo(false);
  };

  const schedulePost = () => {
    if (!metadata.title) return;
    const newItem: QueueItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: metadata.title,
      topic: topic,
      status: 'Ready',
      scheduledFor: 'Scheduled'
    };
    setQueue(prev => [newItem, ...prev]);
    setActiveTab('queue');
    // Reset current
    setTopic('');
    setScript('');
    setMetadata({ title: '', description: '', tags: '' });
    setVideoUrl(null);
    setPublishingStep(0);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Youtube className="text-red-500" />
            YouTube Content Pilot
          </h1>
          <p className="text-slate-500 mt-1 font-medium">End-to-end autonomous channel orchestration powered by Gemini and Veo.</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl shadow-xl">
          {(['create', 'analytics', 'queue'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Production Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl border-t border-t-white/5 relative overflow-hidden">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={12} className="text-amber-500" /> Content Seed
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter niche or video topic..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-red-500/50 font-medium placeholder:text-slate-700"
                  />
                  <button 
                    onClick={generateFullContent}
                    disabled={isGeneratingScript || !topic.trim()}
                    className="absolute right-2 top-2 p-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl shadow-lg transition-all"
                  >
                    {isGeneratingScript ? <RefreshCw className="animate-spin" size={18} /> : <Rocket size={18} />}
                  </button>
                </div>
              </div>

              {publishingStep >= 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Script Generation</label>
                    <textarea 
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs outline-none focus:ring-2 focus:ring-red-500/50 h-40 resize-none font-medium text-slate-300 custom-scrollbar"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SEO Metadata (Title)</label>
                    <input 
                      type="text"
                      value={metadata.title}
                      onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-red-500/50 font-bold text-red-400"
                      placeholder="Generating title..."
                    />
                  </div>
                </div>
              )}

              {publishingStep === 2 && (
                <div className="space-y-4 pt-2 border-t border-slate-800 animate-in zoom-in-95">
                  <button 
                    onClick={produceVideo}
                    disabled={isProducingVideo}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-600/20 text-white"
                  >
                    {isProducingVideo ? <RefreshCw className="animate-spin" size={20} /> : <Video size={20} />}
                    {isProducingVideo ? 'RENDERING PIXELS...' : 'GENERATE CINEMATIC VEO'}
                  </button>

                  <button 
                    onClick={schedulePost}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all text-slate-300"
                  >
                    <Calendar size={16} /> ADD TO PUBLISHING QUEUE
                  </button>
                </div>
              )}

              <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                <h4 className="text-[10px] font-bold text-slate-500 mb-2 flex items-center gap-2 uppercase tracking-tighter">
                  {/* Fixed error: ShieldAlert was missing from lucide-react imports */}
                  <ShieldAlert size={12} className="text-amber-500" /> Channel Policy Compliance
                </h4>
                <p className="text-[9px] text-slate-600 font-medium">All generated content is audited for YouTube Fair Use and Advertiser-Friendly guidelines automatically.</p>
              </div>
            </div>
          </div>

          {/* Visual Preview / Studio Panel */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl h-[560px] flex flex-col overflow-hidden shadow-2xl relative border-t border-t-white/5">
              <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                  <Play size={14} className="text-red-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Preview Player</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[10px] font-mono text-red-500">LIVE PRODUCTION</span>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center relative bg-black/40">
                {!videoUrl && !isProducingVideo && (
                  <div className="text-center space-y-4">
                    <Video className="mx-auto text-slate-800" size={80} />
                    <div className="space-y-1">
                      <p className="text-slate-600 text-sm font-mono tracking-widest uppercase">Canvas Standby</p>
                      <p className="text-slate-800 text-[10px]">Define topic to initialize production.</p>
                    </div>
                  </div>
                )}
                {isProducingVideo && (
                  <div className="text-center space-y-8 animate-in fade-in zoom-in-95">
                    <div className="relative">
                      <div className="w-32 h-32 border-4 border-red-500/10 border-t-red-500 rounded-full animate-spin mx-auto"></div>
                      <Sparkles className="absolute inset-0 m-auto text-red-400 animate-pulse" size={40} />
                    </div>
                    <p className="text-red-400 font-bold tracking-widest uppercase text-xs">Accessing Neural Cluster</p>
                  </div>
                )}
                {videoUrl && (
                  <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-full shadow-2xl" />
                )}
              </div>

              <div className="p-6 bg-slate-900/80 border-t border-slate-800 grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Optimized Description</label>
                  <div className="text-[11px] text-slate-400 font-medium h-24 overflow-y-auto custom-scrollbar leading-relaxed">
                    {metadata.description || "Description will be crafted based on your script and target audience..."}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SEO Tags</label>
                  <div className="flex flex-wrap gap-1">
                    {metadata.tags ? metadata.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-800 rounded-md text-[9px] text-slate-400 border border-slate-700">#{tag.trim()}</span>
                    )) : <span className="text-[10px] text-slate-700 italic">Tags will appear here...</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {[
               { label: 'Neural Projected Views', value: '3.1M', change: '+22%', color: 'text-red-500' },
               { label: 'Estimated RPM Yield', value: '$12.40', change: '+8%', color: 'text-emerald-500' },
               { label: 'Average Watch Time', value: '4:12', change: '+1:10', color: 'text-blue-500' },
               { label: 'Neural CTR Boost', value: '14.2%', change: '+5%', color: 'text-pink-500' }
             ].map((stat, i) => (
               <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg group hover:border-slate-700 transition-all">
                  <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-green-500 font-bold mt-1 tracking-tight">{stat.change} Neural Optimization</p>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <TrendingUp className="text-red-500" /> Viral Scaling Projection
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockPerformanceData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <BarChart3 className="text-emerald-500" /> Revenue Accrual (Projected)
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex items-center justify-between shadow-2xl">
             <div className="flex items-center gap-4">
                <div className="p-4 bg-slate-800 rounded-2xl">
                   <Clock className="text-red-500" size={32} />
                </div>
                <div>
                   <h2 className="text-2xl font-bold">Autonomous Queue</h2>
                   <p className="text-slate-500 text-sm">Managing scheduled syncs across {queue.length} active slots.</p>
                </div>
             </div>
             <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/20">
                SYNC ALL SLOTS
             </button>
          </div>
          
          <div className="space-y-4">
             {queue.map(item => (
               <div key={item.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex justify-between items-center group hover:border-slate-700 transition-all shadow-lg border-l-4 border-l-red-500">
                  <div className="flex items-center gap-6">
                    <div className={`p-2 rounded-lg ${item.status === 'Ready' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {item.status === 'Ready' ? <CheckCircle size={20} /> : <RefreshCw size={20} className="animate-spin" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 text-lg">{item.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{item.scheduledFor}</span>
                        <span className="text-[10px] text-slate-600">•</span>
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{item.topic}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400" title="Edit Metadata"><FileText size={18} /></button>
                    <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400" title="Manual Publish"><Globe size={18} /></button>
                    <button 
                      onClick={() => setQueue(q => q.filter(i => i.id !== item.id))}
                      className="p-3 bg-slate-800 hover:bg-red-900/30 text-red-400 rounded-xl" 
                      title="Remove Slot"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
               </div>
             ))}

             {queue.length === 0 && (
               <div className="py-20 text-center space-y-4 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl opacity-40">
                  <ListFilter className="mx-auto text-slate-800" size={64} />
                  <p className="text-sm font-mono tracking-widest uppercase">Queue empty. Start producing content.</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeAutomator;
