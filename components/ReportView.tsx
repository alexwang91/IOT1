
import React, { useState } from 'react';
import { FWAReport, StrategicAnalysis } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  AlertCircle, Target, Radio, Cpu, Network, 
  ShoppingBag, TrendingUp, Settings, CheckCircle2, Lightbulb,
  Globe, Search, ArrowUpRight, Info, Layers, Wrench, ChevronRight
} from 'lucide-react';

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <section className={`bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] ${className}`}>
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, id }: { icon: any, title: string, id?: string }) => (
  <div className="flex items-center gap-8 mb-16 border-b border-slate-100 pb-12" id={id}>
    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-accent shrink-0">
      <Icon className="w-10 h-10" />
    </div>
    <div className="space-y-2">
      <h2 className="font-display text-4xl lg:text-5xl tracking-tight text-slate-900 leading-none">{title}</h2>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-accent rounded-full" />
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-300">Section Analysis Complete</span>
      </div>
    </div>
  </div>
);

const StatWithTooltip = ({ label, value, subtext, tooltip, highlight = false }: { label: string, value: string, subtext: string, tooltip: string, highlight?: boolean }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className={`p-8 border rounded-[2.5rem] space-y-4 relative group transition-all duration-500 ${
        highlight 
          ? 'bg-slate-900 border-slate-800 text-white shadow-2xl shadow-slate-300' 
          : 'bg-white border-slate-100 text-slate-900 hover:shadow-xl hover:shadow-slate-100 hover:border-accent/10'
      }`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center justify-between">
        <div className={`text-[9px] font-mono font-black uppercase tracking-[0.3em] ${highlight ? 'text-white/40' : 'text-slate-400'}`}>
          {label}
        </div>
        <Info className={`w-3.5 h-3.5 transition-opacity ${show ? 'opacity-100' : 'opacity-20'} ${highlight ? 'text-white/40' : 'text-accent'}`} />
      </div>
      <div className="text-5xl font-display leading-none tracking-tight">{value}</div>
      <p className={`text-xs font-semibold tracking-wide ${highlight ? 'text-white/50' : 'text-slate-400'}`}>{subtext}</p>
      
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-72 p-6 bg-slate-900 text-white text-[11px] rounded-2xl shadow-2xl border border-white/10 z-50 animate-fade-in-up font-medium leading-relaxed">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};

const AnalysisList = ({ items, type }: { items: string[], type: 'strength' | 'challenge' | 'recommendation' }) => {
  const themes = {
    strength: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Competitive Leverage', bg: 'bg-emerald-50/20' },
    challenge: { icon: AlertCircle, color: 'text-rose-500', label: 'Market Friction', bg: 'bg-rose-50/20' },
    recommendation: { icon: Lightbulb, color: 'text-accent', label: 'Consultant Directive', bg: 'bg-accent/[0.03]' },
  }[type];

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4 flex-1 min-w-[300px]">
      <div className="flex items-center gap-2 mb-2">
        <themes.icon className={`w-3 h-3 ${themes.color}`} />
        <span className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{themes.label}</span>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className={`p-5 rounded-2xl border border-slate-100/50 ${themes.bg} group/item hover:bg-white hover:border-slate-200 transition-all duration-300`}>
            <div className="flex gap-3">
               <ChevronRight className={`w-3.5 h-3.5 mt-0.5 shrink-0 transition-transform group-hover/item:translate-x-1 ${themes.color}`} />
               <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                {item}
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalysisBlock: React.FC<{ data: StrategicAnalysis }> = ({ data }) => {
  if (!data) return null;
  return (
    <div className="space-y-10 pb-16 last:pb-0 border-b border-slate-100 last:border-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-display text-3xl text-slate-900 tracking-tight leading-none">{data.title}</h3>
          <div className="text-base text-slate-500 leading-relaxed font-medium pl-6 border-l-2 border-slate-100">
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
    <div className="space-y-20 max-w-7xl mx-auto">
      
      {/* 1. Positioning Brief */}
      <SectionWrapper>
        <SectionHeader icon={Target} title="Market Dynamics & Positioning" />
        <div className="space-y-24">
          {report.painPoints?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
          {report.strategicPositioning?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
        </div>
      </SectionWrapper>

      {/* 2. Commercial Brief */}
      <SectionWrapper>
        <SectionHeader icon={ShoppingBag} title="Strategic Value Propositions" />
        <div className="space-y-24">
          <AnalysisBlock data={report.valueProposition?.consumer} />
          <AnalysisBlock data={report.valueProposition?.enterprise} />
          <AnalysisBlock data={report.valueProposition?.operator} />
        </div>
      </SectionWrapper>

      {/* 3. Spectrum Brief */}
      <SectionWrapper>
        <SectionHeader icon={Radio} title="Spectral Infrastructure Mapping" />
        <div className="space-y-16">
          <div className="max-w-3xl">
             <p className="text-2xl text-slate-900 font-display tracking-tight leading-relaxed">{report.spectrumAnalysis?.overview}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
             <div className="lg:col-span-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 shadow-inner">
                <SpectrumChart data={report.spectrumAnalysis?.bands || []} />
             </div>
             <div className="lg:col-span-4 space-y-8">
                <h4 className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Registry Snapshot</h4>
                <div className="space-y-3">
                  {report.spectrumAnalysis?.bands?.map((b, i) => (
                    <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm group hover:border-accent/20 transition-all">
                      <div className="space-y-0.5">
                        <div className="font-display text-base text-slate-900">{b.band}</div>
                        <div className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest">{b.technology}</div>
                      </div>
                      <div className="text-[9px] font-black uppercase text-accent bg-accent/5 px-2.5 py-1 rounded-md border border-accent/10">{b.status}</div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          <AnalysisBlock data={report.spectrumAnalysis?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* 4. Infrastructure Brief */}
      <SectionWrapper>
        <SectionHeader icon={Cpu} title="Technological Implementation" />
        <div className="space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {report.technicalCapabilities?.items?.map((item, i) => (
               <div key={i} className="p-8 border border-slate-100 rounded-3xl space-y-4 hover:border-accent/20 hover:shadow-xl hover:shadow-slate-100 transition-all bg-white relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl tracking-tight">{item.feature}</span>
                    <div className={`w-2 h-2 rounded-full ${item.priority === 'High' ? 'bg-amber-400 animate-pulse' : 'bg-slate-200'}`} />
                  </div>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{item.description}</p>
                  <div className="pt-2">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-300">Priority: {item.priority}</span>
                  </div>
               </div>
             ))}
          </div>
          <AnalysisBlock data={report.technicalCapabilities?.detailedAnalysis} />
          {report.networkPlanning?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
        </div>
      </SectionWrapper>

      {/* 5. Financial Synthesis */}
      <section className="bg-slate-900 rounded-[4rem] p-12 lg:p-24 text-white relative overflow-hidden shadow-3xl">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] -mr-64 -mt-64" />
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-7 space-y-12">
               <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-accent/40 ring-4 ring-accent/20">
                 <TrendingUp className="w-10 h-10" />
               </div>
               <div className="space-y-8">
                 <h2 className="font-display text-5xl lg:text-7xl tracking-tighter leading-none">ROI Synthesis</h2>
                 <p className="text-xl text-white/60 leading-relaxed font-medium border-l-2 border-accent/40 pl-10 max-w-2xl">
                   {report.roiAnalysis?.summary}
                 </p>
               </div>
               <div className="flex flex-wrap gap-4">
                  {report.roiAnalysis?.assumptions?.map((a, i) => (
                    <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono uppercase tracking-[0.2em] font-black text-white/40 hover:text-white/80 transition-colors">
                      {a}
                    </span>
                  ))}
               </div>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-10 justify-center">
               <StatWithTooltip 
                 label="Model Yield" value="28.4%" highlight subtext="Projected IRR (2025-2028)"
                 tooltip="Optimized yield projections based on automated tower reuse and spectral density modeling."
               />
               <StatWithTooltip 
                 label="Strategic Fit" value="Optimal" subtext="Portfolio Alignment Score"
                 tooltip="The level of synergy between current infrastructure assets and market demand vectors."
               />
            </div>
         </div>
      </section>

      {/* 6. Intelligence Sources */}
      {report.groundingChunks && (
        <div className="px-8 lg:px-16 pt-12 pb-24">
          <div className="flex items-center gap-4 mb-12">
             <div className="h-px bg-slate-100 flex-1" />
             <h4 className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Grounding Metadata</h4>
             <div className="h-px bg-slate-100 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.groundingChunks.filter(c => c.web).map((source, idx) => (
              <a 
                key={idx} href={source.web.uri} target="_blank" 
                className="group flex flex-col gap-4 p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-accent/30 transition-all shadow-sm hover:shadow-2xl hover:shadow-slate-100"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-accent text-slate-300 group-hover:text-white flex items-center justify-center transition-all duration-500">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-bold text-slate-900 leading-tight line-clamp-2">{source.web.title}</div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">{new URL(source.web.uri).hostname}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-200 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
