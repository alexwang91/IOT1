import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, Search, User, ShieldAlert, Layout } from 'lucide-react';

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
      // Detailed error message to help identify env issues
      setError(err.message || "An unexpected error occurred. Please verify your environment configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-accent/10 selection:text-accent">
      <main className="flex-1 flex flex-col items-center">
        {!report && !loading && !error ? (
          <div className="max-w-6xl w-full px-6 py-16 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Refined Branding */}
            <div className="space-y-10 animate-fade-in-up">
              <div className="space-y-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                    <Zap className="text-white w-5 h-5" />
                  </div>
                  <span className="font-display text-lg tracking-tight text-foreground">TelcoInsight <span className="text-accent opacity-80">AI</span></span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="font-display text-4xl lg:text-5xl text-foreground leading-[1.2] tracking-tight">
                    Premium <span className="gradient-text">Insights</span> for <br/>Global Connectivity.
                  </h1>
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md font-medium">
                    Professional-grade FWA analysis platform leveraging real-time spectral intelligence and market data.
                  </p>
                </div>
              </div>

              {/* Author & Status Chips */}
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-3 p-3 pl-3 pr-5 rounded-2xl bg-white border border-slate-200 shadow-sm w-fit">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-[11px] leading-none mb-0.5">Yeqi Wang</h3>
                    <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Strategy Architect</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.1em] text-slate-500">Live Grounding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(0,82,255,0.5)]" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.1em] text-slate-500">Gemini 3 Pro</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Input Section */}
            <div className="animate-fade-in-up delay-100">
               <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl -mr-16 -mt-16" />
                 <InputSection onGenerate={handleGenerate} isLoading={loading} />
               </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-6 py-12">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-10 animate-fade-in-up">
                 <div className="relative">
                   <div className="w-20 h-20 rounded-full border-t-2 border-accent animate-spin" />
                   <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 text-accent animate-pulse" />
                 </div>
                 <div className="space-y-3">
                   <h3 className="font-display text-3xl text-foreground">Building Strategy Model</h3>
                   <p className="text-muted-foreground text-base font-medium italic">Synchronizing with global spectrum registries...</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto text-center space-y-10 p-16 bg-white rounded-[3rem] border border-rose-100 shadow-2xl animate-fade-in-up">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-display text-2xl text-slate-900">Analysis Error</h3>
                  <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 text-sm text-rose-800 font-medium leading-relaxed">
                    {error}
                  </div>
                  <p className="text-slate-500 text-sm">Please ensure the <strong>API_KEY</strong> environment variable is correctly set in your host dashboard.</p>
                </div>
                <button 
                  onClick={() => { setError(null); setLoading(false); }}
                  className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up">
                <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-10 border-b border-slate-200">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <Layout className="w-5 h-5 text-accent" />
                      <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-accent/70">Strategic Brief • Real-Time</span>
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl text-foreground leading-none tracking-tight">
                      {report.operatorName} <span className="text-slate-200 font-sans font-light mx-2">/</span> <span className="text-slate-400 font-sans font-light">{report.country}</span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="px-8 py-5 bg-accent text-white font-bold rounded-2xl shadow-xl shadow-accent/20 hover:shadow-2xl hover:shadow-accent/40 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2.5"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Strategic Consultation
                    </button>
                    <button 
                      onClick={() => { setReport(null); setError(null); }}
                      className="px-8 py-5 border border-slate-200 bg-white text-slate-500 font-bold rounded-2xl hover:text-foreground hover:bg-slate-50 transition-all flex items-center gap-2.5"
                    >
                      <Search className="w-5 h-5" />
                      New Search
                    </button>
                  </div>
                </div>
                <ReportView report={report} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Chat UI */}
      {report && (
        <div 
          className={`
            fixed inset-y-0 right-0 z-[60] w-full md:w-[600px] transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
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
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[55] transition-opacity duration-700" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;