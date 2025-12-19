
import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, Search, ShieldAlert, User, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-accent/10 selection:text-accent">
      <main className="flex-1">
        {!report && !loading && !error ? (
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-20 flex flex-col justify-center min-h-[90vh]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Strategic Content */}
              <div className="lg:col-span-7 space-y-8">
                <div className="flex items-center gap-3 animate-fade-in-up">
                  <div className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
                    <Zap className="text-accent w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-lg tracking-tight leading-none text-slate-900">TelcoInsight</span>
                    <span className="text-[8px] font-mono font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Intelligence Unit</span>
                  </div>
                </div>

                <div className="space-y-5 animate-fade-in-up delay-75">
                  <h1 className="text-4xl lg:text-[3.75rem] font-display leading-[1.1] tracking-tight text-slate-900">
                    Precision <span className="text-accent italic font-light">Market</span> <br/> Grounding.
                  </h1>
                  <p className="text-slate-500 text-base lg:text-lg max-w-md font-normal leading-relaxed">
                    Automated spectral modeling and commercial roadmaps for next-generation telecommunications deployments.
                  </p>
                </div>
                
                {/* Stats & Author Row */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 pt-8 animate-fade-in-up delay-100 border-t border-slate-200/60">
                  <div className="flex gap-8">
                    <div className="space-y-0.5">
                      <div className="text-xl font-display text-slate-900 font-light">150+</div>
                      <div className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">Operators</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xl font-display text-slate-900 font-light">98.2%</div>
                      <div className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">Accuracy</div>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-8 bg-slate-200" />

                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 shadow-sm transition-transform group-hover:scale-105">
                       <User className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base tracking-tight text-slate-800 font-normal leading-none">Yeqi Wang</h3>
                        <span className="px-1 py-0.5 bg-accent/5 text-accent text-[7px] font-bold uppercase tracking-widest rounded border border-accent/10">A16z Alum</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-semibold tracking-wide">Strategic Architect</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Console UI - Resized and Cleaned */}
              <div className="lg:col-span-5 animate-fade-in-up delay-150">
                <div className="bg-white p-8 lg:p-10 rounded-[2rem] border border-slate-200 shadow-[0_15px_40px_-12px_rgba(0,0,0,0.04)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-2xl -mr-12 -mt-12 group-hover:bg-accent/10 transition-colors duration-1000" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400">System Ready</span>
                      </div>
                      <h4 className="text-slate-900 font-display text-xl tracking-tight font-normal">Strategic Console</h4>
                    </div>
                    
                    <InputSection onGenerate={handleGenerate} isLoading={loading} />
                    
                    <div className="pt-4 flex items-center justify-center gap-2 text-slate-300">
                      <Sparkles className="w-3 h-3 opacity-20" />
                      <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-300">End-to-end Intelligence</span>
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
                   <h3 className="font-display text-2xl text-slate-900 tracking-tight font-normal">Synthesizing Market Intelligence</h3>
                   <p className="text-slate-400 text-[10px] font-mono uppercase tracking-[0.5em] font-bold">Connecting to Regional Registry</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto text-center space-y-10 py-32 animate-fade-in-up">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500 border border-rose-100 shadow-sm">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-display text-3xl tracking-tight font-normal">Strategic Error</h3>
                  <div className="p-8 bg-white border border-slate-200 rounded-[2rem] text-[13px] text-slate-500 font-mono leading-relaxed break-words text-left shadow-sm">
                    {error}
                  </div>
                </div>
                <button 
                  onClick={() => { setError(null); setLoading(false); }}
                  className="px-10 py-5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up">
                <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-slate-200/60">
                  <div className="space-y-3 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <div className="px-2 py-0.5 bg-accent/5 text-accent text-[8px] font-bold uppercase tracking-[0.2em] rounded border border-accent/10">Strategic Briefing v2025.1</div>
                      <span className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-slate-300">Executive Auth</span>
                    </div>
                    <h1 className="font-display text-3xl lg:text-5xl text-slate-900 tracking-tight leading-none font-normal">
                      {report.operatorName} <span className="text-slate-200 font-sans font-thin mx-1">/</span> <span className="text-slate-400 font-sans font-light">{report.country}</span>
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="px-6 py-4 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/10 hover:shadow-accent/20 hover:-translate-y-0.5 transition-all flex items-center gap-3 text-[9px] uppercase tracking-[0.2em]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Consult Expert
                    </button>
                    <button 
                      onClick={() => { setReport(null); setError(null); }}
                      className="px-6 py-4 border border-slate-200 bg-white text-slate-500 font-bold rounded-xl hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-3 text-[9px] uppercase tracking-[0.2em]"
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
            fixed inset-y-0 right-0 z-[60] w-full md:w-[450px] transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
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
          className="fixed inset-0 bg-slate-900/5 backdrop-blur-[1px] z-[55] transition-opacity duration-700" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
