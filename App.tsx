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
          <div className="max-w-6xl w-full px-8 py-12 lg:py-24 flex flex-col items-center">
            {/* Minimal Header */}
            <div className="flex items-center gap-2 mb-16 animate-fade-in-up">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Zap className="text-white w-4 h-4" />
              </div>
              <span className="font-display text-lg tracking-tight">TelcoInsight</span>
              <span className="text-slate-300 mx-1">/</span>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">v3.0.0</span>
            </div>

            {/* Central Hero */}
            <div className="text-center space-y-6 mb-20 animate-fade-in-up delay-75">
              <h1 className="text-4xl lg:text-5xl font-display leading-[1.1] tracking-tight text-slate-900 max-w-2xl mx-auto">
                Next-Generation Strategic <br/> <span className="text-accent">Market Intelligence</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-lg mx-auto font-medium">
                Professional-grade FWA analysis using real-time spectral modeling and global grounding.
              </p>
            </div>

            {/* Search Card - Focused and Sharp */}
            <div className="w-full max-w-xl animate-fade-in-up delay-150">
               <div className="bg-white p-10 lg:p-12 rounded-3xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_12px_24px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl -mr-16 -mt-16 pointer-events-none" />
                 <InputSection onGenerate={handleGenerate} isLoading={loading} />
               </div>
               
               {/* Trust Badges */}
               <div className="mt-12 flex flex-wrap justify-center gap-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                  <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-widest text-slate-500">
                    <BarChart3 className="w-4 h-4" /> 5G Spectrum Modeling
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-widest text-slate-500">
                    <Globe2 className="w-4 h-4" /> Global Grounding
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-widest text-slate-500">
                    <User className="w-4 h-4" /> Yeqi Wang Platform
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-6 py-12">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-fade-in-up">
                 <div className="relative">
                   <div className="w-16 h-16 rounded-full border-t-2 border-accent animate-spin" />
                   <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-accent animate-pulse" />
                 </div>
                 <div className="space-y-2">
                   <h3 className="font-display text-2xl">Building Analysis Model</h3>
                   <p className="text-slate-400 text-sm font-medium">Querying global spectrum databases & market reports...</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto text-center space-y-8 py-20 animate-fade-in-up">
                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mx-auto text-rose-500">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-display text-2xl">Analysis Interrupted</h3>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono leading-relaxed overflow-auto max-h-40">
                    {error}
                  </div>
                </div>
                <button 
                  onClick={() => { setError(null); setLoading(false); }}
                  className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Back to Dashboard
                </button>
              </div>
            )}

            {report && !loading && (
              <div className="animate-fade-in-up">
                <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-10 border-b border-slate-100">
                  <div className="space-y-4 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2.5">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Consultancy Output • 5G SA</span>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl text-slate-900 tracking-tight leading-none">
                      {report.operatorName} <span className="text-slate-200 font-sans font-thin mx-1">/</span> <span className="text-slate-400 font-sans font-light">{report.country}</span>
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="px-6 py-4 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Strategic Consultant
                    </button>
                    <button 
                      onClick={() => { setReport(null); setError(null); }}
                      className="px-6 py-4 border border-slate-200 bg-white text-slate-500 font-bold rounded-xl hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 text-sm"
                    >
                      <Search className="w-4 h-4" />
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

      {/* Chat UI Overlay */}
      {report && (
        <div 
          className={`
            fixed inset-y-0 right-0 z-[60] w-full md:w-[500px] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
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
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[55] transition-opacity duration-500" 
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default App;