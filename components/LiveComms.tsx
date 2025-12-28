
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, PhoneOff, Radio, Signal, Wifi, Activity, Sparkles, Volume2 } from 'lucide-react';

const LiveComms: React.FC = () => {
  const [active, setActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const sessionRef = useRef<any>(null);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const startSession = async () => {
    setConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputNodeRef.current = audioContextRef.current.createGain();
    outputNodeRef.current.connect(audioContextRef.current.destination);

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputContext.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = inputContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContext.destination);
            setConnecting(false);
            setActive(true);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscripts(prev => [...prev.slice(-4), `AI: ${text}`]);
            } else if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscripts(prev => [...prev.slice(-4), `You: ${text}`]);
            }

            const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioBase64) {
              const ctx = audioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioBase64), ctx);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputNodeRef.current!);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => endSession(),
          onerror: (e) => { console.error(e); endSession(); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are the Nexus Voice Interface. You are efficient, technical, and helpful. You are interacting via high-speed native audio link.'
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      setConnecting(false);
    }
  };

  const endSession = () => {
    setActive(false);
    sessionRef.current?.close();
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();
  };

  return (
    <div className="p-8 h-full flex flex-col space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Live Comms</h1>
          <p className="text-slate-500 mt-1">Direct low-latency neural link with Nexus Core.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl">
            <Wifi size={16} className={active ? 'text-green-500' : 'text-slate-700'} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Real-time Stream</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-8">
        <div className="w-96 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-tr ${active ? 'from-blue-600 to-indigo-600 animate-pulse' : 'from-slate-800 to-slate-900'} flex items-center justify-center shadow-2xl relative z-10`}>
              {active ? <Radio className="text-white" size={48} /> : <MicOff className="text-slate-700" size={48} />}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{active ? 'Link Established' : connecting ? 'Handshaking...' : 'Ready for Link'}</h3>
              <p className="text-slate-500 text-xs">Voice and data synchronization active.</p>
            </div>

            <button 
              onClick={active ? endSession : startSession}
              disabled={connecting}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${active ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20'}`}
            >
              {active ? <PhoneOff size={20} /> : <Mic size={20} />}
              {active ? 'DISCONNECT' : connecting ? 'ESTABLISHING...' : 'START NEURAL LINK'}
            </button>
            
            {active && (
              <div className="pt-6 flex justify-center gap-1 h-8 items-end">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 bg-blue-500/50 rounded-full animate-bounce" style={{ height: `${Math.random() * 100}%`, animationDuration: `${0.5 + Math.random()}s` }}></div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Activity size={14} /> Link Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Latency</span>
                <span className="text-green-500 font-mono">14ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">MimeType</span>
                <span className="text-blue-500 font-mono">audio/pcm;rate=16000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col shadow-2xl relative">
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Transcription HUD</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-end space-y-6">
            {transcripts.length === 0 ? (
              <div className="flex flex-col items-center text-center space-y-4 text-slate-700">
                <Radio size={48} className="opacity-10" />
                <p className="text-sm font-mono tracking-widest uppercase">Waiting for input...</p>
              </div>
            ) : (
              transcripts.map((t, i) => (
                <div key={i} className={`text-xl font-medium animate-in slide-in-from-bottom-2 duration-500 ${t.startsWith('AI') ? 'text-blue-400' : 'text-slate-400'}`}>
                  {t}
                </div>
              ))
            )}
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="text-blue-500" />
              <div className="flex gap-0.5">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className={`w-1 h-4 rounded-full ${active ? 'bg-blue-600/50' : 'bg-slate-800'}`}></div>
                ))}
              </div>
            </div>
            <Sparkles className={active ? 'text-blue-500 animate-spin-slow' : 'text-slate-800'} size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveComms;
