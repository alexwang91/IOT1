import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, ArrowRight, Search } from 'lucide-react';

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
      <main className="flex-1 overflow-x-hidden flex flex-col items-center">
        {!report && !loading && !error ? (
          <div className="max-w-7xl w-full px-6 py-12 lg:py-32 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 lg:gap-24 items-start">
            {/* Left Column: Welcome & Context */}
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
                    Analyze FWA strategy, spectrum analysis, and commercial planning with enterprise-grade market intelligence.
                  </p>
                </div>
              </div>

              {/* Distinct Author Card */}
              <div className="inline-block p-6 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-10 bg-accent-gradient rounded-full" />
                  <div>
                    <h3 className="font-bold text-foreground">Yeqi Wang</h3>
                    <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">A16z Alumni • Strategic Architect</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-accent ml-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              <div className="flex items-center gap-12 pt-4">
                <div className="space-y-1">
                  <div className="text-3xl font-display text-foreground">5G/FWA</div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">Primary Focus</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="space-y-1">
                  <div className="text-3xl font-display text-foreground">GLOBAL</div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">Market Depth</div>
                </div>
              </div>
            </div>

            {/* Right Column: Input Section */}
            <div className="animate-fade-in-up delay-100 lg:sticky lg:top-24">
               <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-border shadow-2xl shadow-accent/5">
                 <InputSection onGenerate={handleGenerate} isLoading={loading} />
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
                   <h3 className="font-display text-3xl text-foreground">Analyzing Market Assets</h3>
                   <p className="text-muted-foreground font-medium italic">Scanning spectrum allocations and competitor news...</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto text-center space-y-8 p-12 bg-white rounded-3xl border border-border shadow-xl animate-fade-in-up">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                  <Zap className="w-8 h-8 rotate-180" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl">Analysis Interrupted</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
                <button 
                  onClick={() => { setError(null); setReport(null); }}
                  className="w-full py-4 bg-foreground text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent-gradient rounded-lg flex items-center justify-center shadow-lg">
                        <Zap className="text-white w-4 h-4" />
                      </div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent bg-accent/5 px-3 py-1 rounded-full">Strategic Insight</span>
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
                      AI Consultant
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
          className="fixed inset-0 bg-foreground/10 backdrop-blur-md z-[55] transition-opacity duration-500" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;