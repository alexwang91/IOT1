
import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, ArrowRight, Search, User, ShieldAlert } from 'lucide-react';

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
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-accent/10 selection:text-accent">
      <main className="flex-1 overflow-x-hidden flex flex-col items-center">
        {!report && !loading && !error ? (
          <div className="max-w-7xl w-full px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-12 lg:gap-16 items-center">
            {/* Left Column: Branding */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent-gradient rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
                    <Zap className="text-white w-4 h-4" />
                  </div>
                  <span className="font-display text-lg tracking-tight text-foreground">TelcoInsight <span className="text-accent">AI</span></span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="font-display text-4xl lg:text-5xl text-foreground leading-[1.15] tracking-tight max-w-lg">
                    Strategic <span className="gradient-text">Insights</span> <br/> for Network Operators.
                  </h1>
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md font-medium">
                    Analyze global FWA strategy with enterprise-grade spectrum modeling and real-time market grounding.
                  </p>
                </div>
              </div>

              {/* Author Card */}
              <div className="inline-flex items-center gap-3 p-3.5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white shadow-xl shadow-accent/5 group hover:shadow-accent/10 transition-all duration-500">
                <div className="w-8 h-8 rounded-lg bg-accent-gradient p-[1px]">
                  <div className="w-full h-full rounded-[calc(0.5rem-1px)] bg-white flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-[11px] leading-none mb-0.5">Yeqi Wang</h3>
                  <p className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest">A16z Alumni • Platform Architect</p>
                </div>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="space-y-1">
                  <div className="text-xl font-display text-foreground">5G / FWA</div>
                  <div className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest font-black">Strategic Focus</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="space-y-1">
                  <div className="text-xl font-display text-foreground">REAL-TIME</div>
                  <div className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest font-black">Search Grounding</div>
                </div>
              </div>
            </div>

            {/* Right Column: Input Section */}
            <div className="animate-fade-in-up delay-100 lg:sticky lg:top-24">
               <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)]">
                 <InputSection onGenerate={handleGenerate} isLoading={loading} />
               </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-6 py-12">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-10 animate-fade-in-up">
                 <div className="relative">
                   <div className="w-24 h-24 rounded-full border-t-4 border-accent animate-spin" />
                   <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent animate-pulse" />
                 </div>
                 <div className="space-y-3">
                   <h3 className="font-display text-3xl lg:text-4xl text-foreground">Synthesizing Market Intelligence</h3>
                   <p className="text-muted-foreground text-lg font-medium italic">Analyzing spectrum assets and financial roadmaps...</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto text-center space-y-8 p-12 bg-white rounded-[2.5rem] border border-border shadow-2xl animate-fade-in-up">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500 shadow-sm">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-display text-2xl">Analysis Interrupted</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{error}</p>
                </div>
                <button 
                  onClick={() => { setError(null); setLoading(false); }}
                  className="w-full py-5 bg-foreground text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up">
                <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-12 border-b-2 border-border/50">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-gradient rounded-xl flex items-center justify-center shadow-xl shadow-accent/20">
                        <Zap className="text-white w-5 h-5" />
                      </div>
                      <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-accent bg-accent/5 px-4 py-1.5 rounded-full border border-accent/10">Strategic Executive Brief</span>
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl text-foreground leading-none tracking-tight">
                      {report.operatorName} <span className="text-muted-foreground/10 font-sans font-thin mx-2">/</span> <span className="text-muted-foreground font-sans font-light">{report.country}</span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="px-8 py-5 bg-accent text-white font-bold rounded-2xl shadow-xl shadow-accent/20 hover:shadow-2xl hover:shadow-accent/40 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Strategic Chat
                    </button>
                    <button 
                      onClick={() => { setReport(null); setError(null); }}
                      className="px-8 py-5 border-2 border-border bg-white text-muted-foreground font-bold rounded-2xl hover:text-foreground hover:bg-muted transition-all flex items-center gap-2"
                    >
                      <Search className="w-5 h-5" />
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
            fixed inset-y-0 right-0 z-[60] w-full md:w-[580px] transform transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
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
          className="fixed inset-0 bg-foreground/30 backdrop-blur-md z-[55] transition-opacity duration-1000" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
