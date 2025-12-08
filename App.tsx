import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateFWAReport } from './services/geminiService';
import { FWAReport, Language } from './types';
import { MessageSquare, LayoutDashboard } from 'lucide-react';

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
      // Display the actual error message
      setError(err.message || "Failed to generate report. Please try again later or check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-800">TelcoInsight AI</span>
          </div>
          
          {report && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-colors shadow-lg shadow-blue-900/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:inline">Ask AI Consultant</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {!report && !loading && (
              <InputSection onGenerate={handleGenerate} isLoading={loading} />
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center mt-20 text-center">
                 <div className="relative w-24 h-24">
                   <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                   <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                 </div>
                 <h3 className="mt-8 text-xl font-bold text-slate-800">Analyzing Market Data...</h3>
                 <p className="text-slate-500 mt-2 max-w-md">
                   Our AI is currently performing a deep search on spectrum allocations, identifying competitive pain points, and modeling ROI scenarios for your requested operator.
                 </p>
                 <div className="mt-6 space-y-2 text-sm text-slate-400">
                   <p>✓ Accessing Global Spectrum Database</p>
                   <p>✓ Analyzing 5G/4G Coverage Maps</p>
                   <p>✓ Calculating Commercial Viability</p>
                 </div>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center shadow-sm">
                <div className="flex justify-center mb-4">
                    <span className="bg-red-100 p-3 rounded-full">⚠️</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Analysis Failed</h3>
                <p className="mb-6">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="px-6 py-2 bg-white border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {report && (
               <div className="animate-fade-in-up">
                 <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div>
                     <h1 className="text-3xl font-bold text-slate-900">{report.operatorName}</h1>
                     <p className="text-slate-500 text-lg">{report.country} - Fixed Wireless Access Strategy Report</p>
                   </div>
                   <div className="flex gap-2">
                     <button 
                       onClick={() => setReport(null)}
                       className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all"
                     >
                       New Analysis
                     </button>
                   </div>
                 </div>
                 
                 <ReportView report={report} />
               </div>
            )}
          </div>
        </div>

        {/* Chat Drawer */}
        {report && (
          <div 
            className={`
              fixed inset-y-0 right-0 z-40 w-full md:w-[450px] transform transition-transform duration-300 ease-in-out
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
        
        {/* Overlay for mobile chat */}
        {isChatOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden" 
            onClick={() => setIsChatOpen(false)}
          />
        )}
      </main>
    </div>
  );
};

export default App;