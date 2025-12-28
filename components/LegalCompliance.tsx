
import React, { useState } from 'react';
import { ShieldCheck, FileText, Download, Edit3, Globe, Lock, Info } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const LegalCompliance: React.FC = () => {
  const [userData] = useState({
    name: 'Nexus AI Operations',
    address: 'Silicon Tower 1, 1010 Vienna, Austria',
    email: 'ops@nexus-ai.com'
  });
  const [doc, setDoc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async (type: 'Privacy' | 'Terms' | 'Imprint') => {
    setLoading(true);
    const content = await geminiService.generateLegalDocument(type, userData);
    setDoc(content);
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black">Legal <span className="text-slate-500">Compliance</span></h1>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">GDPR & International Digital Law Registry</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
           {[
             { id: 'Imprint', label: 'Imprint (Impressum)', icon: <Globe size={18} /> },
             { id: 'Privacy', label: 'Privacy Policy (GDPR)', icon: <Lock size={18} /> },
             { id: 'Terms', label: 'Terms of Service', icon: <FileText size={18} /> }
           ].map(item => (
             <button 
               key={item.id} 
               onClick={() => generate(item.id as any)}
               className="w-full flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-[2rem] hover:border-blue-500/50 transition-all text-left group"
             >
               <div className="flex items-center gap-4">
                  <div className="text-blue-500">{item.icon}</div>
                  <span className="font-bold text-slate-200">{item.label}</span>
               </div>
               <Edit3 className="text-slate-700 group-hover:text-blue-500 transition-colors" size={16} />
             </button>
           ))}

           <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-[2rem] space-y-3">
              <h4 className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2"><Info size={12}/> Vercel Ready</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">Ensure these documents are linked in your site footer before pushing to production. Google and Stripe require active legal links for account approval.</p>
           </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-slate-950 border border-slate-800 rounded-[3rem] p-12 h-full min-h-[600px] relative overflow-hidden shadow-2xl">
             {loading ? (
               <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-10">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Drafting Document...</p>
                 </div>
               </div>
             ) : doc ? (
               <div className="space-y-8">
                  <div className="flex justify-between items-center pb-6 border-b border-slate-800">
                    <h2 className="text-2xl font-black text-slate-100">Document Draft</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-[10px] font-black text-white hover:bg-slate-700 transition-all">
                      <Download size={14} /> EXPORT PDF
                    </button>
                  </div>
                  <div className="text-slate-400 font-serif leading-loose text-lg whitespace-pre-wrap max-w-2xl mx-auto italic">
                    {doc}
                  </div>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <ShieldCheck size={80} className="text-slate-800 mb-6" />
                  <p className="text-sm font-mono uppercase tracking-widest">Select a document to synthesize legal drafts.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalCompliance;
