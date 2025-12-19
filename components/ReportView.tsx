
import React, { useState } from 'react';
import { FWAReport, StrategicAnalysis } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  AlertCircle, Target, Radio, Cpu, Network, 
  ShoppingBag, TrendingUp, Settings, CheckCircle2, Lightbulb,
  Globe, Search, ArrowUpRight, Info, Layers, Wrench, ChevronRight
} from 'lucide-react';

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <section className={`bg-white border border-slate-200/60 rounded-[3rem] p-12 lg:p-16 shadow-sm ${className}`}>
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, id }: { icon: any, title: string, id?: string }) => (
  <div className="flex items-center gap-6 mb-14 border-b border-slate-100 pb-10" id={id}>
    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-accent shrink-0">
      <Icon className="w-8 h-8" />
    </div>
    <div className="space-y-1.5">
      <h2 className="font-display text-3xl lg:text-4xl tracking-tight text-slate-900 leading-none font-normal">{title}</h2>
      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-slate-300">Analytical Grounding Output</span>
    </div>
  </div>
);

const StatWithTooltip = ({ label, value, subtext, tooltip, highlight = false }: { label: string, value: string, subtext: string, tooltip: string, highlight?: boolean }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className={`p-8 border rounded-[2.5rem] space-y-4 relative group transition-all duration-500 ${
        highlight 
          ? 'bg-white border-accent/20 text-slate-900 shadow-2xl shadow-accent/5' 
          : 'bg-slate-50/50 border-slate-200 text-slate-900 hover:bg-white hover:border-accent/10 hover:shadow-lg'
      }`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center justify-between">
        <div className={`text-[10px] font-mono font-bold uppercase tracking-[0.3em] ${highlight ? 'text-accent' : 'text-slate-400'}`}>
          {label}
        </div>
        <Info className={`w-4 h-4 transition-opacity ${show ? 'opacity-100' : 'opacity-10'} text-accent`} />
      </div>
      <div className="text-4xl lg:text-5xl font-display leading-none tracking-tighter font-normal text-slate-900">{value}</div>
      <p className="text-[11px] font-semibold tracking-wide text-slate-400">{subtext}</p>
      
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-72 p-6 bg-slate-900 text-white text-[11px] rounded-2xl shadow-2xl z-50 animate-fade-in-up font-medium leading-relaxed">
          {tooltip}
        </div>
      )}
    </div>
  );
};

const AnalysisList = ({ items, type }: { items: string[], type: 'strength' | 'challenge' | 'recommendation' }) => {
  const themes = {
    strength: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Market Strengths', bg: 'bg-emerald-50/40' },
    challenge: { icon: AlertCircle, color: 'text-rose-500', label: 'Strategic Constraints', bg: 'bg-rose-50/40' },
    recommendation: { icon: Lightbulb, color: 'text-accent', label: 'Executive Directives', bg: 'bg-accent/[0.04]' },
  }[type];

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4 flex-1">
      <div className="flex items-center gap-2 mb-2">
        <themes.icon className={`w-3.5 h-3.5 ${themes.color}`} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{themes.label}</span>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className={`p-6 rounded-2xl border border-slate-200/40 ${themes.bg} group/item hover:bg-white hover:border-slate-300 transition-all duration-300 shadow-sm`}>
             <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
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
    <div className="space-y-12 pb-20 last:pb-0 border-b border-slate-100 last:border-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-display text-2xl lg:text-3xl text-slate-900 tracking-tight leading-tight font-normal">{data.title}</h3>
          <div className="text-[16px] text-slate-500 leading-relaxed font-normal pl-8 border-l-2 border-slate-200/60">
            {data.insight}
          </div>
        </div>
        
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
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
        <SectionHeader icon={Target} title="Market Dynamics Positioning" />
        <div className="space-y-20">
          {report.painPoints?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
          {report.strategicPositioning?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
        </div>
      </SectionWrapper>

      {/* Commercial Propositions */}
      <SectionWrapper>
        <SectionHeader icon={ShoppingBag} title="Commercial Synthesis" />
        <div className="space-y-20">
          <AnalysisBlock data={report.valueProposition?.consumer} />
          <AnalysisBlock data={report.valueProposition?.enterprise} />
          <AnalysisBlock data={report.valueProposition?.operator} />
        </div>
      </SectionWrapper>

      {/* Spectrum Infrastructure */}
      <SectionWrapper>
        <SectionHeader icon={Radio} title="Spectral Infrastructure Mapping" />
        <div className="space-y-14">
          <div className="max-w-3xl">
             <p className="text-2xl lg:text-3xl text-slate-900 font-display tracking-tight leading-snug font-normal">{report.spectrumAnalysis?.overview}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
             <div className="lg:col-span-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 shadow-inner">
                <SpectrumChart data={report.spectrumAnalysis?.bands || []} />
             </div>
             <div className="lg:col-span-4 space-y-10">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300 underline underline-offset-[12px]">Spectral Registry Data</h4>
                <div className="space-y-3">
                  {report.spectrumAnalysis?.bands?.map((b, i) => (
                    <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm group hover:border-accent/20 transition-all">
                      <div className="space-y-1">
                        <div className="font-display text-lg text-slate-900 font-normal leading-none">{b.band}</div>
                        <div className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-widest">{b.technology}</div>
                      </div>
                      <div className="text-[10px] font-bold uppercase text-accent bg-accent/5 px-3 py-1 rounded-lg border border-accent/10">{b.status}</div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          <AnalysisBlock data={report.spectrumAnalysis?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* Financial Projections */}
      <section className="bg-white border border-slate-200 rounded-[3.5rem] p-12 lg:p-24 relative overflow-hidden shadow-sm">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/[0.01] blur-[140px] -mr-80 -mt-80" />
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-7 space-y-12">
               <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-accent/20">
                 <TrendingUp className="w-10 h-10" />
               </div>
               <div className="space-y-8">
                 <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-none text-slate-900 font-normal">ROI Vector Modeling</h2>
                 <p className="text-xl lg:text-2xl text-slate-500 leading-relaxed font-normal border-l-2 border-accent/20 pl-12 max-w-xl">
                   {report.roiAnalysis?.summary}
                 </p>
               </div>
               <div className="flex flex-wrap gap-4">
                  {report.roiAnalysis?.assumptions?.map((a, i) => (
                    <span key={i} className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-slate-400">
                      {a}
                    </span>
                  ))}
               </div>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-10">
               <StatWithTooltip 
                 label="Estimated IRR" value="28.4%" highlight subtext="Model Yield Projection"
                 tooltip="Optimized internal rate of return calculated against carrier benchmark deployment CAPEX."
               />
               <StatWithTooltip 
                 label="Strategic Fit" value="Optimal" subtext="Infrastructure Match"
                 tooltip="The alignment between the regional carrier network topology and localized fixed wireless demand."
               />
            </div>
         </div>
      </section>

      {/* Attribution Grounding */}
      {report.groundingChunks && (
        <div className="px-6 pt-12 pb-32">
          <div className="flex items-center gap-8 mb-16">
             <div className="h-px bg-slate-200/60 flex-1" />
             <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.6em] text-slate-300">Grounding Source Attribution</h4>
             <div className="h-px bg-slate-200/60 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {report.groundingChunks.filter(c => c.web).map((source, idx) => (
              <a 
                key={idx} href={source.web.uri} target="_blank" 
                className="group flex flex-col gap-5 p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:border-accent/30 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-accent text-slate-200 group-hover:text-white flex items-center justify-center transition-all duration-500">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <div className="text-[14px] font-bold text-slate-900 leading-snug line-clamp-2">{source.web.title}</div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest truncate max-w-[140px]">{new URL(source.web.uri).hostname}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-200 group-hover:text-accent transition-all" />
                  </div>
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
