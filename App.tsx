
import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, Search, ShieldAlert, User, Globe2, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAFAFB] text-slate-900 font-sans selection:bg-accent/10 selection:text-accent">
      <main className="flex-1">
        {!report && !loading && !error ? (
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-32 flex flex-col justify-center min-h-[95vh]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
              
              {/* Left Column: Strategic Content */}
              <div className="lg:col-span-7 space-y-12">
                <div className="flex items-center gap-4 animate-fade-in-up">
                  <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                    <Zap className="text-accent w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-xl tracking-tight leading-none text-slate-800">TelcoInsight</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 uppercase tracking-widest mt-1">Intelligence Unit</span>
                  </div>
                </div>

                <div className="space-y-8 animate-fade-in-up delay-75">
                  <h1 className="text-5xl lg:text-[5.5rem] font-display leading-[0.95] tracking-tight text-slate-900">
                    Precision <span className="text-accent italic font-normal">Strategy</span> for Carriers.
                  </h1>
                  <p className="text-slate-500 text-lg lg:text-xl max-w-xl font-normal leading-relaxed">
                    Automated market grounding and spectral modeling engineered for the next generation of global connectivity.
                  </p>
                </div>
                
                {/* Stats & Author Row Combined */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-12 pt-8 animate-fade-in-up delay-100 border-t border-slate-100">
                  {/* Performance Stats */}
                  <div className="flex gap-12">
                    <div className="space-y-1">
                      <div className="text-3xl font-display text-slate-800 font-normal">150+</div>
                      <div className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-widest">Global Markets</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-display text-slate-800 font-normal">98%</div>
                      <div className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-widest">Precision</div>
                    </div>
                  </div>

                  {/* Divider (Desktop Only) */}
                  <div className="hidden md:block w-px h-12 bg-slate-100" />

                  {/* Author Card */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 overflow-hidden ring-4 ring-white shadow-sm transition-transform group-hover:scale-105">
                       <User className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg tracking-tight text-slate-700 font-normal">Yeqi Wang</h3>
                        <span className="px-1.5 py-0.5 bg-accent/5 text-accent text-[8px] font-bold uppercase tracking-widest rounded-md border border-accent/10">A16z Alumni</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium tracking-wide">Principal Strategic Architect</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Refined Light Console */}
              <div className="lg:col-span-5 animate-fade-in-up delay-150">
                <div className="bg-white p-10 lg:p-14 rounded-[3rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 blur-3xl -mr-20 -mt-20 group-hover:bg-accent/10 transition-colors duration-700" />
                  
                  <div className="relative z-10 space-y-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-300">Analysis System Live</span>
                      </div>
                      <h4 className="text-slate-900 font-display text-3xl tracking-tight font-normal">Strategy Console</h4>
                    </div>
                    
                    <InputSection onGenerate={handleGenerate} isLoading={loading} />
                    
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-slate-300">
                      <div className="flex items-center gap-2">
                         <Globe2 className="w-3.5 h-3.5 opacity-50" />
                         <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Spectral Node: UK-01</span>
                      </div>
                      <Sparkles className="w-3.5 h-3.5 opacity-30" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto px-6 py-12">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12 animate-fade-in-up">
                 <div className="relative">
                   <div className="w-16 h-16 rounded-full border-t border-accent/20 border-t-accent animate-spin" />
                   <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-accent animate-pulse" />
                 </div>
                 <div className="space-y-3">
                   <h3 className="font-display text-2xl text-slate-900 tracking-tight font-normal">Synthesizing Intelligence</h3>
                   <p className="text-slate-300 text-[10px] font-mono uppercase tracking-[0.5em] font-bold">Connecting to Spectral Registry</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto text-center space-y-10 py-32 animate-fade-in-up">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 border border-rose-100">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-display text-3xl tracking-tight font-normal">Access Interrupted</h3>
                  <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2rem] text-sm text-slate-500 font-mono leading-relaxed break-words text-left">
                    {error}
                  </div>
                </div>
                <button 
                  onClick={() => { setError(null); setLoading(false); }}
                  className="px-10 py-5 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up">
                <div className="mb-16 flex flex-col lg:flex-row lg:items-center justify-between gap-10 pb-12 border-b border-slate-100">
                  <div className="space-y-4 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <div className="px-3 py-1 bg-accent/5 text-accent text-[9px] font-bold uppercase tracking-[0.2em] rounded-lg border border-accent/10">Market Analysis 2025</div>
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-slate-300">Operational Level: Executive</span>
                    </div>
                    <h1 className="font-display text-4xl lg:text-7xl text-slate-900 tracking-tighter leading-none">
                      {report.operatorName} <span className="text-slate-200 font-sans font-thin">/</span> <span className="text-slate-400 font-sans font-light">{report.country}</span>
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="px-8 py-5 bg-accent text-white font-bold rounded-2xl shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 transition-all flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Consult Expert
                    </button>
                    <button 
                      onClick={() => { setReport(null); setError(null); }}
                      className="px-8 py-5 border border-slate-200 bg-white text-slate-500 font-bold rounded-2xl hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]"
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
            fixed inset-y-0 right-0 z-[60] w-full md:w-[500px] transform transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
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
          className="fixed inset-0 bg-slate-900/5 backdrop-blur-sm z-[55] transition-opacity duration-1000" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
