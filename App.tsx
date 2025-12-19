
import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Zap, Search, ShieldAlert, User, Sparkles, Layout } from 'lucide-react';

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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <main className="flex-1">
        {!report && !loading && !error ? (
          <div className="relative overflow-hidden min-h-screen flex flex-col justify-center">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[20vw] h-[20vw] bg-accent/5 -translate-x-1/2 translate-y-1/4 rotate-45" />

            <div className="max-w-7xl mx-auto px-8 lg:px-12 w-full relative z-10 py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                
                {/* Left Column: Strategic Content */}
                <div className="lg:col-span-7 space-y-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-md">
                      <Zap className="text-white w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-2xl tracking-tight leading-none text-foreground uppercase italic">TelcoInsight</span>
                      <span className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.3em] mt-1">Strategic AI Module</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h1 className="text-6xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight text-foreground">
                      PRECISION <br/>
                      <span className="text-primary">FWA LOGIC.</span>
                    </h1>
                    <p className="text-foreground/70 text-xl lg:text-2xl max-w-xl font-medium leading-tight">
                      Grounded spectral modeling and deployment roadmaps for global telecommunications leaders.
                    </p>
                  </div>
                  
                  {/* Stats & Profile Block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t-8 border-foreground">
                    <div className="flex gap-12">
                      <div className="space-y-1">
                        <div className="text-4xl font-extrabold text-foreground tracking-tighter">150+</div>
                        <div className="text-[10px] font-mono font-black text-foreground/40 uppercase tracking-widest">Global Nodes</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-4xl font-extrabold text-primary tracking-tighter">98.2%</div>
                        <div className="text-[10px] font-mono font-black text-foreground/40 uppercase tracking-widest">Model Precision</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-muted flex items-center justify-center text-foreground/20 rounded-md">
                         <User className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-extrabold tracking-tight text-foreground leading-none">Yeqi Wang</h3>
                          <span className="px-1.5 py-0.5 bg-accent text-white text-[9px] font-black uppercase tracking-widest rounded">Architect</span>
                        </div>
                        <p className="text-[11px] text-foreground/40 font-bold tracking-wide uppercase">Lead Strategic Alumni</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Console UI */}
                <div className="lg:col-span-5">
                  <div className="bg-muted p-12 rounded-lg border-b-[12px] border-primary">
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-secondary" />
                          <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-foreground/30">System Link Active</span>
                        </div>
                        <h4 className="text-foreground text-3xl font-extrabold tracking-tight">Deployment Console</h4>
                      </div>
                      
                      <InputSection onGenerate={handleGenerate} isLoading={loading} />
                      
                      <div className="pt-8 border-t-2 border-border flex items-center justify-center gap-3">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-foreground/20 italic">Encrypted Analysis Stream</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-12">
                 <div className="w-24 h-24 bg-primary text-white flex items-center justify-center rounded-lg animate-pulse">
                   <Search className="w-10 h-10" />
                 </div>
                 <div className="space-y-4">
                   <h3 className="text-5xl font-extrabold text-foreground tracking-tighter">Synthesizing Market Logic...</h3>
                   <div className="flex items-center justify-center gap-2">
                      <div className="h-1 w-12 bg-primary" />
                      <p className="text-foreground font-mono text-[11px] uppercase tracking-[0.5em] font-black">Connecting Registry</p>
                   </div>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-2xl mx-auto text-center space-y-12 py-32 px-6">
                <div className="w-20 h-20 bg-accent text-white flex items-center justify-center mx-auto rounded-md">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-5xl font-extrabold tracking-tighter">Access Refused.</h3>
                  <div className="p-10 bg-muted text-lg text-foreground font-mono leading-tight break-words text-left border-l-[12px] border-accent">
                    {error}
                  </div>
                </div>
                <button 
                  onClick={() => { setError(null); setLoading(false); }}
                  className="w-full py-6 bg-foreground text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-md hover:bg-primary transition-all hover:scale-105"
                >
                  Return to Base
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="bg-background">
                {/* Header Section with Bold Block */}
                <div className="bg-foreground text-white py-24 px-8 lg:px-12 mb-20">
                  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded">STRAT_BRIEF v25.1</div>
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">L4 Executive Auth</span>
                      </div>
                      <h1 className="text-7xl lg:text-[7.5rem] font-extrabold tracking-tighter leading-[0.85]">
                        {report.operatorName.toUpperCase()} <br/>
                        <span className="text-primary">{report.country.toUpperCase()}</span>
                      </h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch gap-4">
                      <button
                        onClick={() => setIsChatOpen(true)}
                        className="px-10 h-16 bg-primary text-white font-black rounded-md hover:scale-105 transition-all flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.3em]"
                      >
                        <MessageSquare className="w-5 h-5" />
                        Consult Expert
                      </button>
                      <button 
                        onClick={() => { setReport(null); setError(null); }}
                        className="px-10 h-16 bg-white text-foreground font-black rounded-md hover:scale-105 transition-all flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.3em]"
                      >
                        <Search className="w-5 h-5" />
                        New Analysis
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="max-w-7xl mx-auto px-8 lg:px-12 pb-32">
                  <ReportView report={report} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Chat UI Overlay - Flat Slide-out */}
      {report && (
        <div 
          className={`
            fixed inset-y-0 right-0 z-[60] w-full md:w-[500px] transform transition-transform duration-500 ease-in-out border-l-[8px] border-primary
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
          className="fixed inset-0 bg-foreground/20 z-[55]" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
