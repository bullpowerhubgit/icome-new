import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Video, Sparkles, Wand2, Download, RefreshCw, Maximize, FileUp, Play, Trash2, Plus, Film } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const MediaStudio: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'generate' | 'edit' | 'video'>('generate');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<any>(null);
  
  // Image Config
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSize, setImageSize] = useState('1K');
  const [sourceImages, setSourceImages] = useState<{data: string; mimeType: string}[]>([]);
  
  // Video Config
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');
  const [extendMode, setExtendMode] = useState(false);

  // Fix: Explicitly type 'file' as File to avoid 'unknown' type errors.
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        // Fix for Error: Property 'split' does not exist on type 'string | ArrayBuffer'.
        // Extracting result to a local variable for proper type narrowing.
        const resultData = ev.target?.result;
        if (typeof resultData === 'string') {
          setSourceImages(prev => [...prev, {
            data: resultData.split(',')[1],
            mimeType: file.type
          }].slice(0, 3)); // Max 3 for Veo
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (activeMode === 'generate') {
        const url = await geminiService.generateImage(prompt, { aspectRatio, size: imageSize });
        setResult(url || null);
      } else if (activeMode === 'edit') {
        if (sourceImages.length === 0) throw new Error("Upload an image first.");
        const url = await geminiService.editImage(prompt, sourceImages[0].data, sourceImages[0].mimeType);
        setResult(url || null);
      } else if (activeMode === 'video') {
        const res = await geminiService.generateVideo(prompt, videoAspect, {
          images: sourceImages,
          extendVideo: extendMode ? videoData : undefined
        });
        setResult(res.url);
        setVideoData(res.videoData);
      }
    } catch (e: any) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Film className="text-blue-500" />
            Media Studio
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Harness Veo 3.1 and Imagen 3 for cinematic assets and high-fidelity renders.</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl shadow-xl">
          {(['generate', 'edit', 'video'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => { setActiveMode(mode); setResult(null); setSourceImages([]); }}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all uppercase tracking-widest ${activeMode === mode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl border-t border-t-white/5">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                Source Assets {activeMode === 'video' && <span className="text-blue-400 lowercase italic">(max 3 for ref)</span>}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sourceImages.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-700 bg-slate-950">
                    <img src={`data:${img.mimeType};base64,${img.data}`} className="w-full h-full object-cover" />
                    <button onClick={() => setSourceImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"><Trash2 size={14} /></button>
                  </div>
                ))}
                {sourceImages.length < 3 && (
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-800 rounded-xl cursor-pointer hover:border-blue-500 transition-all text-slate-700 hover:text-blue-500">
                    <Plus size={20} />
                    <input type="file" multiple className="hidden" onChange={handleFiles} />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Directive</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={activeMode === 'generate' ? "A photorealistic robotic eye reflecting a galaxy..." : activeMode === 'edit' ? "Remove the subject and replace with a tree..." : "A drone shot of a futuristic metropolis during a neon storm..."}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 h-32 resize-none font-medium placeholder:text-slate-700"
              />
            </div>

            {activeMode === 'generate' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aspect Ratio</label>
                  <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs outline-none font-bold text-slate-300">
                    {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resolution</label>
                  <select value={imageSize} onChange={(e) => setImageSize(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs outline-none font-bold text-slate-300">
                    {['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            )}

            {activeMode === 'video' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Veo Config</label>
                  <div className="flex gap-2">
                    {(['16:9', '9:16'] as const).map(r => (
                      <button key={r} onClick={() => setVideoAspect(r)} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${videoAspect === r ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>{r}</button>
                    ))}
                  </div>
                </div>
                {videoData && (
                  <button 
                    onClick={() => setExtendMode(!extendMode)}
                    className={`w-full py-2 rounded-xl text-[10px] font-bold uppercase border transition-all ${extendMode ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                  >
                    {extendMode ? 'Extension Mode: ON (+7s)' : 'Extension Mode: OFF'}
                  </button>
                )}
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 text-white"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : activeMode === 'video' ? <Video size={20} /> : <Wand2 size={20} />}
              {loading ? 'CALCULATING NEURAL PATHS...' : `GENERATE ${activeMode.toUpperCase()}`}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl h-[640px] flex items-center justify-center overflow-hidden shadow-2xl relative border-t border-t-white/5">
            {!result && !loading && (
              <div className="text-center space-y-4">
                <ImageIcon className="mx-auto text-slate-800" size={80} />
                <div className="space-y-1">
                  <p className="text-slate-600 text-sm font-mono tracking-widest uppercase">Visual Canvas Standby</p>
                  <p className="text-slate-800 text-[10px]">Ready for Veo / Imagen injection.</p>
                </div>
              </div>
            )}
            {loading && (
              <div className="text-center space-y-8 animate-in fade-in zoom-in-95">
                <div className="relative">
                  <div className="w-32 h-32 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <Sparkles className="absolute inset-0 m-auto text-blue-400 animate-pulse" size={40} />
                </div>
                <div className="space-y-2">
                  <p className="text-blue-400 font-bold tracking-widest uppercase text-xs">Accessing Paid Model Cluster</p>
                  <p className="text-slate-600 text-[10px] font-mono max-w-[200px] mx-auto leading-relaxed">Video generation may take several minutes. Nexus protocol is persistent.</p>
                </div>
              </div>
            )}
            {result && (
              <div className="w-full h-full p-6 animate-in zoom-in-95 duration-700 flex flex-col items-center justify-center">
                {activeMode === 'video' ? (
                  <video src={result} controls autoPlay loop className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/5" />
                ) : (
                  <img src={result} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/5" />
                )}
                <div className="absolute bottom-10 right-10 flex gap-2">
                  <a href={result} download={`nexus_${activeMode}_${Date.now()}`} className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xl transition-all"><Download size={20} /></a>
                  <button onClick={() => window.open(result, '_blank')} className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow-xl transition-all"><Maximize size={20} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaStudio;