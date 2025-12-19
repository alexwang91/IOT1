
import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, Search, ShieldAlert, User, Radio, BarChart3, Globe2, Activity } from 'lucide-react';

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
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-secondary/5 -translate-x-1/2 translate-y-1/4 rotate-45 blur-3xl" />

            <div className="max-w-7xl mx-auto px-8 lg:px-12 w-full relative z-10 py-12 lg:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                
                {/* Left Column: Logo, Headlines, Author & Stats */}
                <div className="lg:col-span-7 space-y-12">
                  <div className="flex items-center gap-4 group cursor-default">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-none transform transition-transform group-hover:rotate-180 duration-700">
                      <Radio className="text-white w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-serif text-2xl tracking-tighter leading-none text-foreground uppercase italic">TelcoInsight AI</span>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-[0.4em] text-foreground/30">Strategic Analytics Platform</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <span className="text-primary font-mono font-bold uppercase tracking-[0.4em] text-[10px]">Strategic_Insight_Protocol_v4</span>
                      <h1 className="text-6xl lg:text-8xl font-serif leading-[0.9] tracking-tighter text-foreground">
                        FWA STRATEGIC <br/>
                        <span className="text-primary italic">ANALYSIS ENGINE.</span>
                      </h1>
                    </div>
                    <p className="text-foreground/60 text-lg lg:text-xl max-w-xl font-medium leading-relaxed tracking-tight">
                      Architecting spectral deployment roadmaps with high-fidelity grounding. We provide the strategic logic required for global FWA excellence and network evolution.
                    </p>
                  </div>

                  {/* Relocated Author & Stats Grid under Welcome Message */}
                  <div className="space-y-6 pt-4 max-w-xl">
                    <div className="bg-white/40 backdrop-blur-xl border border-foreground/5 p-6 flex items-center gap-6 group">
                      <div className="w-14 h-14 bg-foreground/5 flex items-center justify-center rounded-none border border-foreground/5 group-hover:bg-foreground group-hover:text-white transition-all duration-300">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-serif tracking-tight text-foreground leading-none">Yeqi Wang</h3>
                          <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-bold uppercase tracking-widest">Expert</span>
                        </div>
                        <p className="text-[10px] text-foreground/40 font-bold tracking-wide uppercase">A16z Alumni / Strategic Architect</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-6 bg-foreground text-white flex flex-col justify-between h-32 group hover:bg-primary transition-colors duration-500">
                        <div className="flex justify-between items-start">
                          <Globe2 className="w-5 h-5 opacity-30 group-hover:opacity-100 transition-opacity" />
                          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/40">Global Nodes</span>
                        </div>
                        <div className="text-4xl font-serif italic tracking-tighter leading-none">150+</div>
                      </div>
                      <div className="p-6 bg-muted text-foreground flex flex-col justify-between h-32 group border-b-4 border-primary">
                        <div className="flex justify-between items-start">
                          <Activity className="w-5 h-5 opacity-30 group-hover:text-primary transition-opacity" />
                          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-foreground/30">Model Precision</span>
                        </div>
                        <div className="text-4xl font-serif italic tracking-tighter leading-none">98.2%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Analyzer Console */}
                <div className="lg:col-span-5 sticky top-12">
                  <div className="bg-muted p-10 border-l-[12px] border-primary">
                    <div className="space-y-8">
                      <div className="flex items-center justify-between border-b border-foreground/5 pb-6">
                         <h4 className="text-foreground text-3xl font-serif tracking-tighter italic leading-none">Initiate</h4>
                         <div className="flex items-center gap-3">
                           <div className="w-2 h-2 bg-secondary animate-pulse" />
                           <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-foreground/30">Registry_Ready</span>
                         </div>
                      </div>
                      
                      <InputSection onGenerate={handleGenerate} isLoading={loading} />
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
                 <div className="w-24 h-24 bg-foreground text-white flex items-center justify-center rounded-none animate-pulse">
                   <Radio className="w-10 h-10" />
                 </div>
                 <div className="space-y-4">
                   <h3 className="text-5xl font-serif text-foreground tracking-tighter italic">Synthesizing Logic...</h3>
                   <div className="flex items-center justify-center gap-3">
                      <div className="h-0.5 w-12 bg-primary" />
                      <p className="text-foreground font-mono text-[10px] uppercase tracking-[0.5em] font-bold">L4_Access_Protocol</p>
                   </div>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-2xl mx-auto text-center space-y-12 py-32 px-6">
                <div className="w-20 h-20 bg-accent text-white flex items-center justify-center mx-auto rounded-none">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-5xl font-serif tracking-tighter italic">Access Refused.</h3>
                  <div className="p-10 bg-muted text-lg text-foreground font-mono leading-tight break-words text-left border-l-[12px] border-accent uppercase tracking-tight">
                    {error}
                  </div>
                </div>
                <button 
                  onClick={() => { setError(null); setLoading(false); }}
                  className="w-full py-6 bg-foreground text-white text-[12px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-primary transition-all duration-500"
                >
                  Terminate & Reset
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="bg-background">
                {/* Header Section */}
                <div className="bg-foreground text-white py-32 px-8 lg:px-12 mb-20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full bg-primary/5 opacity-50 blur-[120px]" />
                  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-16 relative z-10">
                    <div className="space-y-10">
                      <div className="flex items-center gap-6">
                        <div className="px-4 py-1.5 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.4em]">SYSTEM_OUTPUT_v25.2</div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 italic">High_Density_Profile</span>
                      </div>
                      <h1 className="text-7xl lg:text-9xl font-serif tracking-tighter leading-[0.8] uppercase italic">
                        {report.operatorName} <br/>
                        <span className="text-primary not-italic">{report.country}</span>
                      </h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch gap-6">
                      <button
                        onClick={() => setIsChatOpen(true)}
                        className="px-12 h-20 bg-primary text-white font-bold rounded-none hover:scale-105 transition-all flex items-center justify-center gap-6 text-[12px] uppercase tracking-[0.4em]"
                      >
                        <MessageSquare className="w-6 h-6" />
                        Consult Expert
                      </button>
                      <button 
                        onClick={() => { setReport(null); setError(null); }}
                        className="px-12 h-20 bg-white text-foreground font-bold rounded-none hover:scale-105 transition-all flex items-center justify-center gap-6 text-[12px] uppercase tracking-[0.4em]"
                      >
                        <Search className="w-6 h-6" />
                        Reset Model
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

      {/* Chat UI Overlay */}
      {report && (
        <div 
          className={`
            fixed inset-y-0 right-0 z-[60] w-full md:w-[550px] transform transition-transform duration-700 ease-in-out border-l-[12px] border-primary
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
          className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[55]" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
