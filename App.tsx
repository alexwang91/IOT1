
import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, Search, ShieldAlert, User, Quote, ArrowRight } from 'lucide-react';

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
      setError(err.message || "An unexpected error occurred during strategic analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] text-slate-900 font-sans selection:bg-accent/10 selection:text-accent">
      <main className="flex-1">
        {!report && !loading && !error ? (
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-24 relative min-h-[90vh] flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Column: Strategic Content */}
              <div className="lg:col-span-7 space-y-10">
                <div className="flex items-center gap-3 animate-fade-in-up">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl shadow-slate-200">
                    <Zap className="text-white w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-xl tracking-tight leading-none">TelcoInsight</span>
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise Intelligence Unit</span>
                  </div>
                </div>

                <div className="space-y-6 animate-fade-in-up delay-75">
                  <h1 className="text-5xl lg:text-8xl font-display leading-[0.9] tracking-tighter text-slate-900">
                    Strategic <span className="text-accent italic">Alpha</span> for Carriers.
                  </h1>
                  <p className="text-slate-500 text-lg lg:text-xl max-w-xl font-medium leading-relaxed">
                    Automated market grounding, spectral modeling, and investment roadmaps for the next generation of connectivity.
                  </p>
                </div>
                
                {/* Stats Row */}
                <div className="pt-8 flex gap-10 lg:gap-16 animate-fade-in-up delay-100">
                  <div className="space-y-1">
                    <div className="text-3xl font-display text-slate-900">150+</div>
                    <div className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400">Markets Synced</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-display text-slate-900">98%</div>
                    <div className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400">Signal Accuracy</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Console */}
              <div className="lg:col-span-5 space-y-8 animate-fade-in-up delay-150">
                <div className="bg-slate-900 p-8 lg:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200 relative overflow-hidden ring-1 ring-white/10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl -mr-16 -mt-16" />
                  <div className="relative z-10 space-y-8">
                    <div className="space-y-1">
                      <h4 className="text-white font-display text-2xl tracking-tight">Strategy Console</h4>
                      <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest font-bold">Encrypted Analysis Session</p>
                    </div>
                    <InputSection onGenerate={handleGenerate} isLoading={loading} />
                  </div>
                </div>
              </div>
            </div>

            {/* Author Card - Positioned Bottom Left (Large Screens) */}
            <div className="mt-20 lg:absolute lg:bottom-0 lg:left-12 lg:mb-0 animate-fade-in-up delay-300">
               <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 max-w-sm group hover:border-accent/20 transition-all duration-500">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                     <User className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg tracking-tight">Yeqi Wang</h3>
                      <span className="px-1.5 py-0.5 bg-accent/5 text-accent text-[8px] font-black uppercase tracking-widest rounded border border-accent/10">A16z Alumni</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-tight">Lead Strategic Architect & Founder</p>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto px-6 py-12">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12 animate-fade-in-up">
                 <div className="relative">
                   <div className="w-16 h-16 rounded-full border-t-2 border-accent animate-spin" />
                   <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-accent animate-pulse" />
                 </div>
                 <div className="space-y-3">
                   <h3 className="font-display text-2xl text-slate-900 tracking-tight">Synthesizing Market Signal</h3>
                   <p className="text-slate-400 text-[11px] font-mono uppercase tracking-[0.4em] font-bold">Accessing Global Intelligence Nodes</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto text-center space-y-10 py-32 animate-fade-in-up">
                <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto text-rose-500 border border-rose-100">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-display text-3xl tracking-tight">Strategic Node Failure</h3>
                  <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl text-sm text-slate-600 font-mono leading-relaxed break-words text-left shadow-inner">
                    {error}
                  </div>
                </div>
                <button 
                  onClick={() => { setError(null); setLoading(false); }}
                  className="px-10 py-5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up">
                <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-10 pb-10 border-b border-slate-100">
                  <div className="space-y-3 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <div className="px-2.5 py-1 bg-accent/5 text-accent text-[9px] font-black uppercase tracking-[0.2em] rounded border border-accent/10">Strategic Brief 2025</div>
                      <span className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Executive Preview</span>
                    </div>
                    <h1 className="font-display text-4xl lg:text-6xl text-slate-900 tracking-tighter leading-none">
                      {report.operatorName} <span className="text-slate-200 font-sans font-thin mx-1">/</span> <span className="text-slate-400 font-sans font-light">{report.country}</span>
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="px-7 py-4.5 bg-accent text-white font-bold rounded-xl shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 transition-all flex items-center gap-3 text-xs uppercase tracking-widest"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Consult Expert
                    </button>
                    <button 
                      onClick={() => { setReport(null); setError(null); }}
                      className="px-7 py-4.5 border border-slate-200 bg-white text-slate-500 font-bold rounded-xl hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-3 text-xs uppercase tracking-widest"
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
            fixed inset-y-0 right-0 z-[60] w-full md:w-[500px] transform transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.2,1)]
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
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[55] transition-opacity duration-700" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
