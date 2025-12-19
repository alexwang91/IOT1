
import React, { useState } from 'react';
import { FWAReport, StrategicAnalysis } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  AlertCircle, Target, Radio, Cpu, Network, 
  ShoppingBag, TrendingUp, Settings, CheckCircle2, Lightbulb,
  Globe, Search, ArrowUpRight, Info, Layers, Wrench, ChevronRight
} from 'lucide-react';

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <section className={`bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-14 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] ${className}`}>
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, id }: { icon: any, title: string, id?: string }) => (
  <div className="flex items-center gap-6 mb-12 border-b border-slate-50 pb-8" id={id}>
    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-accent shrink-0">
      <Icon className="w-7 h-7" />
    </div>
    <div className="space-y-1">
      <h2 className="font-display text-3xl lg:text-4xl tracking-tight text-slate-900 leading-none">{title}</h2>
      <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-slate-300">Live Analysis Grounded</span>
    </div>
  </div>
);

const StatWithTooltip = ({ label, value, subtext, tooltip, highlight = false }: { label: string, value: string, subtext: string, tooltip: string, highlight?: boolean }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className={`p-6 border rounded-3xl space-y-3 relative group transition-all duration-500 ${
        highlight 
          ? 'bg-slate-900 border-slate-800 text-white shadow-2xl' 
          : 'bg-white border-slate-100 text-slate-900 hover:shadow-lg hover:border-accent/10'
      }`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center justify-between">
        <div className={`text-[8px] font-mono font-black uppercase tracking-[0.2em] ${highlight ? 'text-white/40' : 'text-slate-400'}`}>
          {label}
        </div>
        <Info className={`w-3 h-3 transition-opacity ${show ? 'opacity-100' : 'opacity-20'} ${highlight ? 'text-white/40' : 'text-accent'}`} />
      </div>
      <div className="text-4xl font-display leading-none tracking-tight">{value}</div>
      <p className={`text-[10px] font-bold tracking-wide ${highlight ? 'text-white/50' : 'text-slate-400'}`}>{subtext}</p>
      
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-5 bg-slate-900 text-white text-[10px] rounded-xl shadow-2xl border border-white/10 z-50 animate-fade-in-up font-medium leading-relaxed">
          {tooltip}
        </div>
      )}
    </div>
  );
};

const AnalysisList = ({ items, type }: { items: string[], type: 'strength' | 'challenge' | 'recommendation' }) => {
  const themes = {
    strength: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Strengths', bg: 'bg-emerald-50/20' },
    challenge: { icon: AlertCircle, color: 'text-rose-500', label: 'Challenges', bg: 'bg-rose-50/20' },
    recommendation: { icon: Lightbulb, color: 'text-accent', label: 'Consultant Directive', bg: 'bg-accent/[0.03]' },
  }[type];

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3 flex-1">
      <div className="flex items-center gap-1.5 mb-1.5">
        <themes.icon className={`w-3 h-3 ${themes.color}`} />
        <span className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{themes.label}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className={`p-4 rounded-xl border border-slate-100/30 ${themes.bg} group/item hover:bg-white hover:border-slate-200 transition-all duration-300`}>
             <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
              {item}
             </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalysisBlock: React.FC<{ data: StrategicAnalysis }> = ({ data }) => {
  if (!data) return null;
  return (
    <div className="space-y-8 pb-12 last:pb-0 border-b border-slate-50 last:border-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-display text-2xl text-slate-900 tracking-tight leading-tight">{data.title}</h3>
          <div className="text-[14px] text-slate-500 leading-relaxed font-medium pl-5 border-l-2 border-slate-100">
            {data.insight}
          </div>
        </div>
        
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalysisList items={data.strengths} type="strength" />
          <AnalysisList items={data.challenges} type="challenge" />
          <div className="md:col-span-2">
            <AnalysisList items={data.recommendations} type="recommendation" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportView: React.FC<{ report: FWAReport }> = ({ report }) => {
  return (
    <div className="space-y-16 max-w-7xl mx-auto">
      
      {/* Summary Matrix */}
      <SectionWrapper>
        <SectionHeader icon={Target} title="Market Dynamics Brief" />
        <div className="space-y-16">
          {report.painPoints?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
          {report.strategicPositioning?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
        </div>
      </SectionWrapper>

      {/* Commercial Matrix */}
      <SectionWrapper>
        <SectionHeader icon={ShoppingBag} title="Commercial Synthesis" />
        <div className="space-y-16">
          <AnalysisBlock data={report.valueProposition?.consumer} />
          <AnalysisBlock data={report.valueProposition?.enterprise} />
          <AnalysisBlock data={report.valueProposition?.operator} />
        </div>
      </SectionWrapper>

      {/* Spectrum Matrix */}
      <SectionWrapper>
        <SectionHeader icon={Radio} title="Spectrum Mapping" />
        <div className="space-y-12">
          <div className="max-w-2xl">
             <p className="text-xl text-slate-900 font-display tracking-tight leading-relaxed">{report.spectrumAnalysis?.overview}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
             <div className="lg:col-span-8 bg-slate-50 border border-slate-100 rounded-3xl p-8 shadow-inner">
                <SpectrumChart data={report.spectrumAnalysis?.bands || []} />
             </div>
             <div className="lg:col-span-4 space-y-6">
                <h4 className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Registry Detail</h4>
                <div className="space-y-2">
                  {report.spectrumAnalysis?.bands?.map((b, i) => (
                    <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-sm group hover:border-accent/20 transition-all">
                      <div className="space-y-0.5">
                        <div className="font-display text-sm text-slate-900">{b.band}</div>
                        <div className="text-[8px] font-mono text-slate-400 font-bold uppercase tracking-widest">{b.technology}</div>
                      </div>
                      <div className="text-[8px] font-black uppercase text-accent bg-accent/5 px-2 py-0.5 rounded border border-accent/10">{b.status}</div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          <AnalysisBlock data={report.spectrumAnalysis?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* Financial Matrix */}
      <section className="bg-slate-900 rounded-[3rem] p-10 lg:p-20 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/10 blur-[100px] -mr-48 -mt-48" />
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7 space-y-10">
               <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white shadow-2xl">
                 <TrendingUp className="w-8 h-8" />
               </div>
               <div className="space-y-6">
                 <h2 className="font-display text-4xl lg:text-6xl tracking-tighter leading-none">ROI Synthesis</h2>
                 <p className="text-lg text-white/70 leading-relaxed font-medium border-l-2 border-accent/50 pl-8 max-w-xl">
                   {report.roiAnalysis?.summary}
                 </p>
               </div>
               <div className="flex flex-wrap gap-2.5">
                  {report.roiAnalysis?.assumptions?.map((a, i) => (
                    <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono uppercase tracking-widest font-black text-white/40">
                      {a}
                    </span>
                  ))}
               </div>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-6 justify-center">
               <StatWithTooltip 
                 label="Model Yield" value="28.4%" highlight subtext="Projected IRR"
                 tooltip="Optimized yield projections based on automated tower reuse."
               />
               <StatWithTooltip 
                 label="Strategic Alignment" value="Optimal" subtext="Portfolio Match"
                 tooltip="The level of synergy between current assets and market demand."
               />
            </div>
         </div>
      </section>

      {/* Intelligence Source Grounding */}
      {report.groundingChunks && (
        <div className="px-6 pt-12 pb-20">
          <div className="flex items-center gap-4 mb-10">
             <div className="h-px bg-slate-100 flex-1" />
             <h4 className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">Grounding Source Attribution</h4>
             <div className="h-px bg-slate-100 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {report.groundingChunks.filter(c => c.web).map((source, idx) => (
              <a 
                key={idx} href={source.web.uri} target="_blank" 
                className="group flex flex-col gap-3 p-6 bg-white border border-slate-100 rounded-2xl hover:border-accent/30 transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-accent text-slate-300 group-hover:text-white flex items-center justify-center transition-all duration-300">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold text-slate-900 leading-tight line-clamp-2">{source.web.title}</div>
                  <div className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest truncate">{new URL(source.web.uri).hostname}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;
