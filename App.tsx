
import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, Search, User, ShieldAlert, Layers, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [report, setReport] = useState<FWAReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(Language.CHINESE);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleGenerate = async (country: string, operator: string, lang: Language) => {
    setLoading(true);
    setError(null);
    setLanguage(lang);
    
    try {
      const data = await generateFWAReport(country, operator, lang);
      setReport(data);
    } catch (err: any) {
      console.error("Generation failed:", err);
      setError(err.message || "Strategic analysis interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] text-slate-900 font-sans selection:bg-accent/10 selection:text-accent">
      <main className="flex-1 flex flex-col items-center">
        {!report && !loading && !error ? (
          <div className="max-w-4xl w-full px-8 pt-24 pb-12 lg:pt-32 flex flex-col items-center">
            {/* Minimal Header */}
            <div className="flex items-center gap-3 mb-16 animate-fade-in-up">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg shadow-slate-200">
                <Zap className="text-white w-4 h-4" />
              </div>
              <span className="font-display text-lg tracking-tight font-medium">TelcoInsight</span>
              <span className="text-slate-200 mx-1">/</span>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">A16z Alum Platform</span>
            </div>

            {/* Central Hero */}
            <div className="text-center space-y-6 mb-16 animate-fade-in-up delay-75">
              <h1 className="text-3xl lg:text-4xl font-display leading-[1.2] tracking-tight text-slate-900 max-w-lg mx-auto">
                Strategic Intelligence for the <span className="text-accent italic">Future of Connectivity</span>
              </h1>
              <p className="text-slate-400 text-base max-w-sm mx-auto font-medium leading-relaxed">
                Empowering operators with precise spectral modeling, competitive grounding, and investment roadmaps.
              </p>
            </div>

            {/* Focused Search UI */}
            <div className="w-full max-w-sm animate-fade-in-up delay-150">
               <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-2xl -mr-12 -mt-12 group-hover:bg-accent/10 transition-colors" />
                 <InputSection onGenerate={handleGenerate} isLoading={loading} />
               </div>
               
               {/* Minimalist Footnote */}
               <div className="mt-12 flex items-center justify-center gap-6 opacity-30 grayscale transition-all hover:grayscale-0 hover:opacity-50 duration-700">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-widest">
                    <Layers className="w-3.5 h-3.5" /> Modeling
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-6 py-12">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12 animate-fade-in-up">
                 <div className="relative">
                   <div className="w-14 h-14 rounded-full border-t-2 border-accent animate-spin" />
                   <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-accent animate-pulse" />
                 </div>
                 <div className="space-y-3">
                   <h3 className="font-display text-xl text-slate-700">Synthesizing Market Data</h3>
                   <p className="text-slate-400 text-xs font-mono uppercase tracking-[0.3em]">Querying Spectral Registries</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-md mx-auto text-center space-y-10 py-32 animate-fade-in-up">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-display text-xl">Operational Disruption</h3>
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono leading-relaxed break-words text-left">
                    {error}
                  </div>
                </div>
                <button 
                  onClick={() => { setError(null); setLoading(false); }}
                  className="px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                  Return to Console
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up">
                <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-100">
                  <div className="space-y-3 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Consultancy Edition • 2025</span>
                    </div>
                    <h1 className="font-display text-3xl md:text-5xl text-slate-900 tracking-tight leading-none">
                      {report.operatorName} <span className="text-slate-200 font-sans font-thin mx-1">/</span> <span className="text-slate-400 font-sans font-light">{report.country}</span>
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="px-6 py-4 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 text-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Strategic Chat
                    </button>
                    <button 
                      onClick={() => { setReport(null); setError(null); }}
                      className="px-6 py-4 border border-slate-200 bg-white text-slate-500 font-bold rounded-xl hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 text-xs"
                    >
                      <Search className="w-4 h-4" />
                      New Task
                    </button>
                  </div>
                </div>
                <ReportView report={report} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Chat UI Overlay */}
      {report && (
        <div 
          className={`
            fixed inset-y-0 right-0 z-[60] w-full md:w-[480px] transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <ChatInterface 
            report={report} 
            language={language} 
            onClose={() => setIsChatOpen(false)} 
          />
        </div>
      )}
      
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[55] transition-opacity duration-700" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
