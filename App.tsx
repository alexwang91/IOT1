import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, ArrowRight, Search, Globe, User, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [report, setReport] = useState<FWAReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(Language.CHINESE);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);

  useEffect(() => {
    // Check if the environment requires key selection
    const checkKey = async () => {
      if ((window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setNeedsKey(!hasKey);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio && typeof (window as any).aistudio.openSelectKey === 'function') {
      await (window as any).aistudio.openSelectKey();
      setNeedsKey(false);
    }
  };

  const handleGenerate = async (country: string, operator: string, lang: Language) => {
    setLoading(true);
    setError(null);
    setLanguage(lang);
    
    try {
      const data = await generateFWAReport(country, operator, lang);
      setReport(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
      if (err.message?.includes('Authentication failed') || err.message?.includes('API key')) {
        setNeedsKey(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-accent/10 selection:text-accent">
      <main className="flex-1 overflow-x-hidden flex flex-col items-center">
        {!report && !loading && !error ? (
          <div className="max-w-7xl w-full px-6 py-12 lg:py-32 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 lg:gap-24 items-center">
            {/* Left Column: Welcome & Branding */}
            <div className="space-y-12 animate-fade-in-up">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-gradient rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                    <Zap className="text-white w-5 h-5" />
                  </div>
                  <span className="font-display text-xl tracking-tight text-foreground">TelcoInsight <span className="text-accent">AI</span></span>
                </div>
                
                <div className="space-y-6">
                  <h1 className="font-display text-6xl lg:text-7xl text-foreground leading-[1.05] tracking-tight">
                    Strategic <span className="gradient-text">Insights</span> for Operators.
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-xl font-medium">
                    Unlock deep-tier FWA strategy, spectrum valuation, and commercial roadmaps with real-time market grounding.
                  </p>
                </div>
              </div>

              {/* Glass Author Card */}
              <div className="inline-flex items-center gap-5 p-5 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white shadow-xl shadow-accent/5 group hover:shadow-accent/10 transition-all duration-500">
                <div className="w-12 h-12 rounded-2xl bg-accent-gradient p-[1px]">
                  <div className="w-full h-full rounded-[calc(1rem-1px)] bg-white flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm leading-none mb-1">Yeqi Wang</h3>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">A16z Alumni • Platform Architect</p>
                </div>
                <div className="ml-4 w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all cursor-default">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center gap-12 pt-4">
                <div className="space-y-1">
                  <div className="text-3xl font-display text-foreground">5G/FWA</div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">Strategic Focus</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="space-y-1">
                  <div className="text-3xl font-display text-foreground">REAL-TIME</div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">Search Grounding</div>
                </div>
              </div>
            </div>

            {/* Right Column: Input Section */}
            <div className="animate-fade-in-up delay-100 lg:sticky lg:top-24">
               <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
                 {needsKey ? (
                   <div className="text-center space-y-6 py-4">
                     <div className="w-16 h-16 bg-accent/5 rounded-2xl flex items-center justify-center mx-auto text-accent mb-4">
                       <ShieldAlert className="w-8 h-8" />
                     </div>
                     <div className="space-y-2">
                       <h3 className="font-display text-2xl">API Access Required</h3>
                       <p className="text-muted-foreground text-sm leading-relaxed">
                         To generate strategic insights using Gemini 3 Pro, please select a valid API key from a paid GCP project.
                       </p>
                     </div>
                     <button 
                       onClick={handleSelectKey}
                       className="w-full py-5 bg-accent text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-accent/30 transition-all flex items-center justify-center gap-2 group"
                     >
                       Select API Key
                       <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </button>
                     <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
                       Billing Documentation
                     </a>
                   </div>
                 ) : (
                   <InputSection onGenerate={handleGenerate} isLoading={loading} />
                 )}
               </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-6 py-12">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in-up">
                 <div className="relative">
                   <div className="w-24 h-24 rounded-full border-t-2 border-accent animate-spin" />
                   <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent animate-pulse" />
                 </div>
                 <div className="space-y-2">
                   <h3 className="font-display text-4xl text-foreground">Synthesizing Market Intelligence</h3>
                   <p className="text-muted-foreground text-lg font-medium italic">Analyzing competitor spectrum holdings and financial news...</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto text-center space-y-8 p-14 bg-white rounded-[3rem] border border-border shadow-2xl animate-fade-in-up">
                <div className="w-20 h-20 bg-rose-50 rounded-[1.5rem] flex items-center justify-center mx-auto text-rose-500 shadow-sm">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-display text-3xl">System Error</h3>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed">{error}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 pt-4">
                  <button 
                    onClick={() => { setError(null); setLoading(false); }}
                    className="w-full py-5 bg-foreground text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98]"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => { setReport(null); setError(null); setLoading(false); setNeedsKey(true); }}
                    className="w-full py-5 border border-border bg-white text-muted-foreground font-bold rounded-2xl hover:text-foreground hover:bg-muted transition-all"
                  >
                    Change API Key
                  </button>
                </div>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up">
                <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12 pb-12 border-b border-border">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-gradient rounded-xl flex items-center justify-center shadow-xl shadow-accent/20">
                        <Zap className="text-white w-5 h-5" />
                      </div>
                      <span className="font-mono text-[11px] font-black uppercase tracking-[0.3em] text-accent bg-accent/5 px-4 py-1.5 rounded-full border border-accent/10">Strategic Executive Brief</span>
                    </div>
                    <h1 className="font-display text-6xl md:text-8xl text-foreground leading-none tracking-tight">
                      {report.operatorName} <span className="text-muted-foreground/10 font-sans font-light mx-2">/</span> <span className="text-muted-foreground">{report.country}</span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="px-10 py-5 bg-accent text-white font-bold rounded-[1.5rem] shadow-xl shadow-accent/20 hover:shadow-2xl hover:shadow-accent/40 transition-all active:scale-95 flex items-center gap-3"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Consult Expert AI
                    </button>
                    <button 
                      onClick={() => { setReport(null); setError(null); }}
                      className="px-10 py-5 border border-border bg-white text-muted-foreground font-bold rounded-[1.5rem] hover:text-foreground hover:bg-muted transition-all flex items-center gap-3 shadow-sm"
                    >
                      <Search className="w-5 h-5" />
                      Reset
                    </button>
                  </div>
                </div>
                <ReportView report={report} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Chat UI */}
      {report && (
        <div 
          className={`
            fixed inset-y-0 right-0 z-[60] w-full md:w-[580px] transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
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
          className="fixed inset-0 bg-foreground/30 backdrop-blur-md z-[55] transition-opacity duration-500" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;