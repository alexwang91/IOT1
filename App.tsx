
import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, LayoutDashboard, Search, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [report, setReport] = useState<FWAReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
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
    <div className="min-h-screen bg-clay flex flex-col font-sans">
      <header className="px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 bg-clay/80 backdrop-blur-md rounded-2xl neumorphic-extruded border border-white/20">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2.5 rounded-xl shadow-lg shadow-accent/30">
              <Zap className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-clay-dark font-display tracking-tight leading-none">TelcoInsight</span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-clay-muted mt-1">Intelligence Core</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            {report && (
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="flex items-center gap-2 px-6 py-2.5 bg-clay text-clay-dark font-bold rounded-xl neumorphic-extruded neumorphic-button-active hover:text-accent transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden md:inline">Consultant</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto px-6 py-8">
            
            {!report && !loading && (
              <InputSection onGenerate={handleGenerate} isLoading={loading} />
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center mt-32 text-center">
                 <div className="p-10 rounded-full neumorphic-inset-deep mb-8">
                   <div className="w-16 h-16 rounded-full border-4 border-clay border-t-accent animate-spin shadow-lg"></div>
                 </div>
                 <h3 className="text-3xl font-extrabold text-clay-dark font-display">Forging Analysis...</h3>
                 <p className="text-clay-muted mt-4 max-w-md font-medium text-lg leading-relaxed">
                   Aggregating global market data, identifying operator pain points, and cross-referencing spectrum allocations.
                 </p>
              </div>
            )}

            {error && (
              <div className="max-w-2xl mx-auto mt-20 p-12 bg-clay rounded-[32px] neumorphic-extruded border border-rose-500/20 text-center animate-fade-in-up">
                <div className="inline-flex p-5 rounded-full bg-rose-500/10 text-rose-500 mb-6 neumorphic-inset">
                  <LayoutDashboard className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-clay-dark mb-4 font-display">Analysis Interrupted</h3>
                <p className="text-clay-muted font-medium mb-10 leading-relaxed text-lg">{error}</p>
                <button 
                  onClick={() => { setError(null); setReport(null); }}
                  className="px-10 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent-light transition-all shadow-lg shadow-accent/20 neumorphic-button-active"
                >
                  Return Home
                </button>
              </div>
            )}

            {report && !loading && (
               <div className="animate-fade-in-up">
                 <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                   <div>
                     <div className="flex items-center gap-2 mb-2">
                       <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full neumorphic-inset">
                         Strategic Insight Report
                       </span>
                     </div>
                     <h1 className="text-5xl font-extrabold text-clay-dark tracking-tighter font-display mb-2">
                       {report.operatorName}
                     </h1>
                     <p className="text-clay-muted text-xl font-medium italic">
                       {report.country} • Market Positioning & FWA Strategy
                     </p>
                   </div>
                   <button 
                     onClick={() => { setReport(null); setError(null); }}
                     className="px-8 py-3 bg-clay text-clay-muted font-bold rounded-xl neumorphic-extruded border border-white/20 hover:text-clay-dark transition-all neumorphic-button-active flex items-center gap-2"
                   >
                     <Search className="w-4 h-4" />
                     New Analysis
                   </button>
                 </div>
                 
                 <ReportView report={report} />
               </div>
            )}
          </div>
        </div>

        {report && (
          <div 
            className={`
              fixed inset-y-0 right-0 z-40 w-full md:w-[500px] transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
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
            className="fixed inset-0 bg-clay-dark/30 backdrop-blur-sm z-30 transition-opacity duration-500" 
            onClick={() => setIsChatOpen(false)}
          />
        )}
      </main>
    </div>
  );
};

export default App;
