import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, Search, User, ShieldAlert, BarChart3, Globe2 } from 'lucide-react';

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
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] text-slate-900 font-sans selection:bg-accent/10 selection:text-accent">
      <main className="flex-1 flex flex-col items-center">
        {!report && !loading && !error ? (
          <div className="max-w-4xl w-full px-8 py-20 lg:py-40 flex flex-col items-center">
            {/* Minimal Header */}
            <div className="flex items-center gap-3 mb-12 animate-fade-in-up">
              <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
                <Zap className="text-white w-3.5 h-3.5" />
              </div>
              <span className="font-display text-base tracking-tight font-medium">TelcoInsight</span>
              <span className="text-slate-200 mx-1">/</span>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Enterprise Edition</span>
            </div>

            {/* Central Hero */}
            <div className="text-center space-y-6 mb-16 animate-fade-in-up delay-75">
              <h1 className="text-3xl lg:text-4xl font-display leading-[1.2] tracking-tight text-slate-900 max-w-xl mx-auto">
                Global Strategic Intelligence <br/> for <span className="text-accent italic">Network Operators</span>
              </h1>
              <p className="text-slate-400 text-base max-w-md mx-auto font-medium leading-relaxed">
                Precision analysis for FWA opportunity mapping, spectrum strategy, and commercial investment roadmaps.
              </p>
            </div>

            {/* Search Card - Sharp and Balanced */}
            <div className="w-full max-w-md animate-fade-in-up delay-150">
               <div className="bg-white p-8 lg:p-10 rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.01),0_8px_16px_-4px_rgba(0,0,0,0.02)] relative">
                 <InputSection onGenerate={handleGenerate} isLoading={loading} />
               </div>
               
               {/* Minimalist Trust Badges */}
               <div className="mt-12 flex items-center justify-center gap-10 opacity-30 grayscale">
                  <BarChart3 className="w-5 h-5" />
                  <Globe2 className="w-5 h-5" />
                  <User className="w-5 h-5" />
               </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-6 py-12">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-fade-in-up">
                 <div className="relative">
                   <div className="w-12 h-12 rounded-full border-t-2 border-accent animate-spin" />
                   <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-pulse" />
                 </div>
                 <div className="space-y-2">
                   <h3 className="font-display text-xl text-slate-700">Synthesizing Strategy</h3>
                   <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Live Grounding Active</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-md mx-auto text-center space-y-8 py-20 animate-fade-in-up">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center mx-auto text-rose-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-display text-xl">Operational Error</h3>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono leading-relaxed break-words">
                    {error}
                  </div>
                </div>
                <button 
                  onClick={() => { setError(null); setLoading(false); }}
                  className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all active:scale-95"
                >
                  Return to Console
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up">
                <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-100">
                  <div className="space-y-3 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-accent" />
                      <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Consultancy Output • 2025</span>
                    </div>
                    <h1 className="font-display text-3xl md:text-5xl text-slate-900 tracking-tight leading-none">
                      {report.operatorName} <span className="text-slate-200 font-sans font-thin mx-1">/</span> <span className="text-slate-400 font-sans font-light">{report.country}</span>
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="px-5 py-3.5 bg-accent text-white font-bold rounded-lg shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 text-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat with AI Expert
                    </button>
                    <button 
                      onClick={() => { setReport(null); setError(null); }}
                      className="px-5 py-3.5 border border-slate-200 bg-white text-slate-500 font-bold rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 text-xs"
                    >
                      <Search className="w-3.5 h-3.5" />
                      New Analysis
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
            fixed inset-y-0 right-0 z-[60] w-full md:w-[460px] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
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
          className="fixed inset-0 bg-slate-900/5 backdrop-blur-[1px] z-[55] transition-opacity duration-500" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;