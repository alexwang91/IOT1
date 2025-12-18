import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, ArrowRight, LayoutDashboard, Search } from 'lucide-react';

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
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-accent/10 selection:text-accent">
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
        {!report && !loading && !error ? (
          /* Entire Homepage as a single Card */
          <div className="w-full max-w-7xl bg-white border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden flex flex-col lg:flex-row min-h-[85vh] animate-fade-in-up">
            
            {/* Left Column: Context & Action */}
            <div className="flex-1 p-8 md:p-12 lg:p-20 flex flex-col justify-center space-y-12">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
                    <Zap className="text-white w-6 h-6" />
                  </div>
                  <span className="font-display text-2xl tracking-tight text-foreground">TelcoInsight <span className="text-accent">AI</span></span>
                </div>

                <div className="space-y-6">
                  <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] tracking-tight">
                    Strategic <span className="gradient-text">Insights</span> for Modern Operators.
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-medium">
                    Automate your FWA strategy, spectrum analysis, and commercial planning with enterprise-grade market intelligence.
                  </p>
                </div>
              </div>

              {/* Input Section integrated into the left column */}
              <div className="max-w-md">
                <InputSection onGenerate={handleGenerate} isLoading={loading} />
              </div>
            </div>

            {/* Right Column: Glassmorphic Cards & Stats (Visual Interest) */}
            <div className="lg:w-[420px] bg-foreground relative overflow-hidden p-8 md:p-12 flex flex-col justify-between">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-secondary/10 blur-[80px] rounded-full -ml-24 -mb-24" />
              
              <div className="relative z-10 space-y-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Platform Status: Active</span>
                </div>

                {/* Glass Author Card - Transparent Glassmorphism, No Avatar */}
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative group">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-display text-2xl text-white">Yeqi Wang</h3>
                      <p className="text-xs font-mono text-white/40 uppercase tracking-[0.2em] font-bold">Strategic Architect</p>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <div className="inline-flex items-center gap-2 text-accent font-bold text-sm">
                        <span>A16z Alumni</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                    <div className="text-4xl font-display text-white">5G/FWA</div>
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">Core Focus</div>
                  </div>
                  <div className="w-full h-px bg-white/5" />
                  <div className="space-y-1">
                    <div className="text-4xl font-display text-white">GLOBAL</div>
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">Market Coverage</div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-12">
                <p className="text-xs text-white/20 font-mono leading-relaxed">
                  Proprietary intelligence layer utilizing Gemini 3 Pro reasoning and multi-modal grounding.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-6 py-4">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-fade-in-up">
                 <div className="relative">
                   <div className="w-24 h-24 rounded-full border-t-2 border-accent animate-spin" />
                   <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent animate-pulse" />
                 </div>
                 <div className="space-y-2">
                   <h3 className="font-display text-3xl text-foreground">Synthesizing Market Data</h3>
                   <p className="text-muted-foreground font-medium italic">Aggregating global spectrum maps and operator news...</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto text-center space-y-8 p-12 bg-white rounded-[3rem] border border-border shadow-2xl animate-fade-in-up mt-20">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                  <Zap className="w-8 h-8 rotate-180" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl">Analysis Interrupted</h3>
                  <p className="text-muted-foreground font-medium">{error}</p>
                </div>
                <button 
                  onClick={() => { setError(null); setReport(null); }}
                  className="w-full py-4 bg-foreground text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent-gradient rounded-lg flex items-center justify-center shadow-lg">
                        <Zap className="text-white w-4 h-4" />
                      </div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent bg-accent/5 px-3 py-1 rounded-full">Strategic Brief</span>
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl text-foreground leading-none">
                      {report.operatorName} <span className="text-muted-foreground/20 font-sans font-light mx-2">/</span> <span className="text-muted-foreground">{report.country}</span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:shadow-xl hover:shadow-accent/30 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Consultant
                    </button>
                    <button 
                      onClick={() => { setReport(null); setError(null); }}
                      className="px-6 py-3 border border-border bg-white text-muted-foreground font-bold rounded-xl hover:text-foreground hover:bg-muted transition-all flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
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

      {/* Floating Chat UI */}
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
          className="fixed inset-0 bg-foreground/20 backdrop-blur-md z-[55] transition-opacity duration-500" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;