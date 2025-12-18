import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, ArrowRight, Github } from 'lucide-react';

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
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Navigation */}
      <nav className="px-6 py-6 border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-accent-gradient rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="font-display text-xl tracking-tight text-foreground">TelcoInsight <span className="text-accent">AI</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            {report && (
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-full hover:shadow-lg hover:shadow-accent/30 transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>AI Consultant</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-x-hidden">
        {!report && !loading && !error ? (
          <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-24 items-center">
            {/* Left Column: Welcome */}
            <div className="space-y-10 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/5 border border-accent/10 rounded-full">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Market Intelligence Engine</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="font-display text-6xl lg:text-7xl text-foreground leading-[1.05] tracking-tight">
                  Strategic <span className="gradient-text">Insights</span> for Modern Operators.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Automate your FWA strategy, spectrum analysis, and commercial planning with enterprise-grade market intelligence.
                </p>
              </div>

              {/* Author Card */}
              <div className="pt-6">
                <div className="inline-flex items-center gap-4 p-5 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Yeqi`} alt="Author" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Yeqi Wang</h3>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">A16z Alumni</p>
                  </div>
                  <div className="ml-4 w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:bg-accent group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 pt-8">
                 <div className="space-y-1">
                   <div className="text-2xl font-display text-foreground">5G/FWA</div>
                   <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest font-bold">Core Focus</div>
                 </div>
                 <div className="w-px h-10 bg-border" />
                 <div className="space-y-1">
                   <div className="text-2xl font-display text-foreground">Global</div>
                   <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest font-bold">Market Coverage</div>
                 </div>
              </div>
            </div>

            {/* Right Column: Input */}
            <div className="animate-fade-in-up delay-100">
               <InputSection onGenerate={handleGenerate} isLoading={loading} />
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-6 py-12">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in-up">
                 <div className="relative">
                   <div className="w-24 h-24 rounded-full border-t-2 border-accent animate-spin" />
                   <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent animate-pulse" />
                 </div>
                 <div className="space-y-2">
                   <h3 className="font-display text-3xl text-foreground">Synthesizing Market Data</h3>
                   <p className="text-muted-foreground font-medium">Fetching real-time spectrum allocations and news...</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto text-center space-y-8 p-12 bg-white rounded-3xl border border-border shadow-xl animate-fade-in-up">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
                  <Zap className="w-8 h-8 rotate-180" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl">Analysis Interrupted</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
                <button 
                  onClick={() => { setError(null); setReport(null); }}
                  className="w-full py-4 bg-foreground text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/5 rounded-full mb-4">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-accent">Report Published</span>
                    </div>
                    <h1 className="font-display text-6xl text-foreground mb-4">
                      {report.operatorName} <span className="text-muted-foreground/30 font-sans font-light">/</span> {report.country}
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium italic">FWA Strategic Positioning & Spectrum Roadmap</p>
                  </div>
                  <button 
                    onClick={() => { setReport(null); setError(null); }}
                    className="px-6 py-3 border border-border bg-white text-foreground font-bold rounded-xl hover:bg-muted transition-all"
                  >
                    New Analysis
                  </button>
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
            fixed inset-y-0 right-0 z-[60] w-full md:w-[450px] transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
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
          className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-[55] transition-opacity" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;