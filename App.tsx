import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, ArrowRight, Search, User, ShieldAlert, Key } from 'lucide-react';

const App: React.FC = () => {
  const [report, setReport] = useState<FWAReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(Language.CHINESE);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // Check for presence of the key in env and the selection status
      const envKey = process.env.API_KEY;
      const isAIStudio = (window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function';
      
      if (isAIStudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setNeedsKey(!hasKey);
      } else if (!envKey) {
        // If not in AI Studio and no env key, we might need a key but can't open a dialog
        // This handles standard web deployments without hardcoded keys
        setNeedsKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio && typeof (window as any).aistudio.openSelectKey === 'function') {
      await (window as any).aistudio.openSelectKey();
      setNeedsKey(false);
      setError(null);
    } else {
      alert("Please ensure your process.env.API_KEY is configured in your deployment settings.");
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
      console.error("Generation failed:", err);
      const errMsg = err.message || "";
      if (errMsg.includes('400') || errMsg.includes('API key') || errMsg.includes('not found') || errMsg.includes('INVALID_ARGUMENT')) {
        setNeedsKey(true);
        setError("API Key Error: The current key is invalid or not from a paid project. Please re-select.");
      } else {
        setError(errMsg || "An unexpected error occurred during analysis.");
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
            {/* Left Column */}
            <div className="space-y-12 animate-fade-in-up">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-gradient rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                    <Zap className="text-white w-5 h-5" />
                  </div>
                  <span className="font-display text-xl tracking-tight text-foreground">TelcoInsight <span className="text-accent">AI</span></span>
                </div>
                
                <div className="space-y-6">
                  <h1 className="font-display text-6xl lg:text-8xl text-foreground leading-[1.05] tracking-tight">
                    Strategic <span className="gradient-text">Insights</span> for Operators.
                  </h1>
                  <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl font-medium">
                    Analyze global FWA strategy with enterprise-grade spectrum modeling and real-time market grounding.
                  </p>
                </div>
              </div>

              {/* Author Card */}
              <div className="inline-flex items-center gap-5 p-5 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white shadow-xl shadow-accent/5 group hover:shadow-accent/10 transition-all duration-500">
                <div className="w-12 h-12 rounded-2xl bg-accent-gradient p-[1px]">
                  <div className="w-full h-full rounded-[calc(1rem-1px)] bg-white flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm leading-none mb-1">Yeqi Wang</h3>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">A16z Alumni • Platform Architect</p>
                </div>
                <div className="ml-4 w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Right Column: Key Selector or Input */}
            <div className="animate-fade-in-up delay-100 lg:sticky lg:top-24">
               <div className="bg-white p-8 lg:p-14 rounded-[3.5rem] border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                 {needsKey ? (
                   <div className="text-center space-y-8 py-6">
                     <div className="w-20 h-20 bg-accent/5 rounded-3xl flex items-center justify-center mx-auto text-accent mb-6 animate-pulse">
                       <Key className="w-10 h-10" />
                     </div>
                     <div className="space-y-3">
                       <h3 className="font-display text-3xl">API Access Required</h3>
                       <p className="text-muted-foreground text-base leading-relaxed">
                         To use <strong>Gemini 3 Pro</strong>, you must select a valid API key from a paid GCP project. Standard free keys may fail for grounding tasks.
                       </p>
                     </div>
                     <button 
                       onClick={handleSelectKey}
                       className="w-full py-6 bg-accent text-white font-bold rounded-2xl shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                     >
                       <span className="text-lg">Select API Key</span>
                       <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                     </button>
                     <p className="text-[11px] text-muted-foreground font-medium">
                       Visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-accent underline">billing docs</a> to enable a paid project.
                     </p>
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
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12 animate-fade-in-up">
                 <div className="relative">
                   <div className="w-32 h-32 rounded-full border-t-4 border-accent animate-spin" />
                   <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-accent animate-pulse" />
                 </div>
                 <div className="space-y-4">
                   <h3 className="font-display text-5xl text-foreground">Analyzing Market Dynamics</h3>
                   <p className="text-muted-foreground text-xl font-medium italic">Synthesizing detailed strategic roadmaps and financial models...</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-2xl mx-auto text-center space-y-10 p-16 bg-white rounded-[3.5rem] border border-border shadow-2xl animate-fade-in-up">
                <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto text-rose-500 shadow-sm">
                  <ShieldAlert className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-display text-3xl">Process Interrupted</h3>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed">{error}</p>
                </div>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => { setError(null); setLoading(false); }}
                    className="w-full py-6 bg-foreground text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                  >
                    Retry Analysis
                  </button>
                  <button 
                    onClick={handleSelectKey}
                    className="w-full py-6 border border-border bg-white text-muted-foreground font-bold rounded-2xl hover:text-foreground hover:bg-muted transition-all"
                  >
                    Update API Key
                  </button>
                </div>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up">
                <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12 pb-16 border-b-2 border-border/50">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-accent-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/30">
                        <Zap className="text-white w-6 h-6" />
                      </div>
                      <span className="font-mono text-[12px] font-black uppercase tracking-[0.3em] text-accent bg-accent/5 px-5 py-2 rounded-full border border-accent/20">Executive Strategy Brief</span>
                    </div>
                    <h1 className="font-display text-6xl md:text-8xl text-foreground leading-none tracking-tighter">
                      {report.operatorName} <span className="text-muted-foreground/10 font-sans font-thin mx-3">/</span> <span className="text-muted-foreground font-sans font-light">{report.country}</span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="px-12 py-6 bg-accent text-white font-bold rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,82,255,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(0,82,255,0.6)] hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
                    >
                      <MessageSquare className="w-6 h-6" />
                      Consult Expert AI
                    </button>
                    <button 
                      onClick={() => { setReport(null); setError(null); }}
                      className="px-10 py-6 border-2 border-border bg-white text-muted-foreground font-bold rounded-[2rem] hover:text-foreground hover:bg-muted transition-all flex items-center gap-3 shadow-sm"
                    >
                      <Search className="w-6 h-6" />
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

      {/* Chat UI */}
      {report && (
        <div 
          className={`
            fixed inset-y-0 right-0 z-[60] w-full md:w-[620px] transform transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
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
          className="fixed inset-0 bg-foreground/40 backdrop-blur-xl z-[55] transition-opacity duration-1000" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;