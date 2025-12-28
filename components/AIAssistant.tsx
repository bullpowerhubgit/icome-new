import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Trash2, Globe, ExternalLink, Paperclip, BrainCircuit, Search, MapPin, Mic, MicOff, Zap, FileVideo, Code as CodeIcon, Database, Cpu } from 'lucide-react';
import { Message } from '../types';
import { geminiService } from '../services/geminiService';

interface Props {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const AIAssistant: React.FC<Props> = ({ messages, setMessages }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<'fast' | 'balanced' | 'thinking'>('balanced');
  const [useSearch, setUseSearch] = useState(true);
  const [useMaps, setUseMaps] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [groundings, setGroundings] = useState<any[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<{ data: string; mimeType: string }[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = async () => {
            // Use a local variable for robust type narrowing.
            const result = reader.result;
            if (typeof result === 'string') {
              const base64 = result.split(',')[1];
              setIsTyping(true);
              const transcript = await geminiService.transcribeAudio(base64, 'audio/webm');
              if (transcript) setInput(prev => (prev ? prev + " " : "") + transcript);
              setIsTyping(false);
            }
          };
          reader.readAsDataURL(audioBlob);
          stream.getTracks().forEach(t => t.stop());
        };
        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
      } catch (err) {
        console.error("Mic access denied", err);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        // Fix for Error: Property 'split' does not exist on type 'string | ArrayBuffer'.
        // Extracting result to a local variable for proper type narrowing.
        const result = event.target?.result;
        if (typeof result === 'string') {
          const base64 = result.split(',')[1];
          setAttachedFiles(prev => [...prev, { data: base64, mimeType: file.type }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0 || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      files: [...attachedFiles]
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedFiles([]);
    setIsTyping(true);
    setGroundings([]);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    try {
      let location = undefined;
      if (useMaps) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      }

      const result = await geminiService.getChatResponse(input, history, {
        mode,
        files: userMsg.files,
        useSearch,
        useMaps,
        location
      });

      // Handle Function Calls (Tools)
      if (result.functionCalls && result.functionCalls.length > 0) {
        for (const fc of result.functionCalls) {
          if (fc.name === 'get_agent_telemetry') {
            const mockData = `[SYSTEM] Tool Call Result for Agent: ${fc.args.agentId}\nMetric ${fc.args.metric}: ${(Math.random() * 100).toFixed(2)}%\nStatus: Operational`;
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: mockData, timestamp: Date.now() }]);
          }
        }
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.text,
        timestamp: Date.now()
      };

      if (result.groundingChunks) setGroundings(result.groundingChunks);
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: "Neural Gateway timeout. Possible data overflow.", timestamp: Date.now() }]);
    }
    setIsTyping(false);
  };

  const renderMessageContent = (content: string) => {
    // Erkennt JSON oder Code-ähnliche Strukturen
    const isJson = content.trim().startsWith('{') || content.trim().startsWith('[');
    if (isJson) {
      return (
        <div className="mt-2 font-mono text-[11px] bg-slate-950 p-4 rounded-xl border border-slate-700/50 overflow-x-auto shadow-inner text-blue-400">
          <div className="flex items-center gap-2 mb-2 text-slate-500 uppercase font-bold tracking-widest text-[9px]">
            <Database size={10} /> Structured Data Audit
          </div>
          <pre>{content}</pre>
        </div>
      );
    }
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  return (
    <div className="h-full flex flex-col p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-100">
              <Sparkles className="text-pink-500" />
              Neural Assistant
            </h1>
            <p className="text-slate-500">Multimodal Audit & Orchestration Node.</p>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest">
            <Cpu size={12} className="animate-pulse" /> Data Mode Active
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {(['fast', 'balanced', 'thinking'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${mode === m ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>{m}</button>
            ))}
          </div>
          <button onClick={() => setUseSearch(!useSearch)} className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold ${useSearch ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}><Search size={16} /> SEARCH</button>
          <button onClick={() => setUseMaps(!useMaps)} className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold ${useMaps ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}><MapPin size={16} /> MAPS</button>
          <button onClick={() => setMessages([])} className="p-2 bg-slate-800/50 hover:bg-red-900/20 rounded-xl text-slate-500 hover:text-red-400 transition-colors border border-slate-700"><Trash2 size={20} /></button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
              <CodeIcon size={80} className="text-blue-500" />
              <p className="text-lg font-mono tracking-tighter uppercase">Send API JSON, code, or directives for analysis.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg"><Bot size={20} className="text-white" /></div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-600/10' : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-none shadow-xl shadow-black/40'}`}>
                {msg.files && msg.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {msg.files.map((f, i) => (
                      <div key={i} className="w-24 h-24 rounded-lg bg-black/20 overflow-hidden border border-white/10 group relative">
                        {f.mimeType.startsWith('image') ? <img src={`data:${f.mimeType};base64,${f.data}`} className="w-full h-full object-cover" /> : f.mimeType.startsWith('video') ? <div className="w-full h-full flex flex-col items-center justify-center text-blue-400"><FileVideo size={32} /><span className="text-[8px] mt-1 font-bold uppercase">Video Node</span></div> : <div className="w-full h-full flex items-center justify-center text-[10px] uppercase font-bold text-white/50">{f.mimeType.split('/')[1]}</div>}
                      </div>
                    ))}
                  </div>
                )}
                {renderMessageContent(msg.content)}
                {msg.role === 'assistant' && groundings.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Logic Grounding References</p>
                    <div className="flex flex-wrap gap-2">
                      {groundings.map((g, i) => (g.web || g.maps) && (
                        <a key={i} href={g.web?.uri || g.maps?.uri} target="_blank" className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-[10px] text-blue-400 hover:bg-slate-800 transition-colors group">
                          <span className="truncate max-w-[120px] font-bold">{g.web?.title || g.maps?.title}</span>
                          <ExternalLink size={10} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/20"><User size={20} className="text-white" /></div>
              )}
            </div>
          ))}
          {isTyping && <div className="animate-pulse flex gap-2 items-center text-slate-500 text-xs italic font-mono"><Zap size={14} className="animate-spin-slow text-blue-500" /> Neural processing unit engaged...</div>}
        </div>

        <div className="p-5 bg-slate-900/80 border-t border-slate-800 backdrop-blur-md">
          <div className="flex flex-wrap gap-2 mb-3">
            {attachedFiles.map((f, i) => (
              <div key={i} className="relative group w-12 h-12 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
                <img src={f.mimeType.startsWith('image') ? `data:${f.mimeType};base64,${f.data}` : ""} className="w-full h-full object-cover bg-slate-800" />
                {f.mimeType.startsWith('video') && <FileVideo className="absolute inset-0 m-auto text-blue-500" size={16} />}
                <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
          <div className="relative flex items-center gap-3">
            <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-all border border-slate-700 shadow-inner" title="Attach Code or Logs"><Paperclip size={20} /></button>
            <button onClick={toggleRecording} className={`p-3 rounded-xl transition-all border shadow-inner ${isRecording ? 'bg-red-500 text-white animate-pulse border-red-400' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`} title="Voice Transcription">
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Paste JSON, API data, or commands here..."
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono placeholder:text-slate-600"
            />
            <button onClick={handleSend} disabled={isTyping} className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 shadow-xl shadow-blue-600/20"><Send size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;