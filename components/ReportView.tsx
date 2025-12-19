import React, { useState } from 'react';
import { FWAReport, StrategicAnalysis } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  AlertCircle, Target, Radio, Cpu, Network, 
  ShoppingBag, TrendingUp, Settings, CheckCircle2, Lightbulb,
  Globe, Search, ArrowUpRight, Info, Layers, Wrench
} from 'lucide-react';

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <section className={`bg-white border border-slate-100 rounded-[2.5rem] p-10 md:p-14 lg:p-16 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.02)] ${className}`}>
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, id }: { icon: any, title: string, id?: string }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12" id={id}>
    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-accent shadow-sm shrink-0">
      <Icon className="w-8 h-8" />
    </div>
    <h2 className="font-display text-3xl lg:text-4xl tracking-tight text-slate-900 leading-none">{title}</h2>
  </div>
);

const StatWithTooltip = ({ label, value, subtext, tooltip, highlight = false }: { label: string, value: string, subtext: string, tooltip: string, highlight?: boolean }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className={`p-10 border rounded-[2rem] space-y-4 relative group transition-all duration-500 ${
        highlight 
          ? 'bg-slate-900 border-slate-800 text-white shadow-xl shadow-slate-200' 
          : 'bg-slate-50 border-slate-100 text-slate-900 hover:bg-white hover:border-accent/20'
      }`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center justify-between">
        <div className={`text-[10px] font-mono font-black uppercase tracking-[0.2em] ${highlight ? 'text-white/60' : 'text-slate-400'}`}>
          {label}
        </div>
        <Info className={`w-4 h-4 transition-opacity ${show ? 'opacity-100' : 'opacity-0'} ${highlight ? 'text-white/40' : 'text-accent'}`} />
      </div>
      <div className="text-5xl font-display leading-none tracking-tight">{value}</div>
      <p className={`text-sm font-medium ${highlight ? 'text-white/60' : 'text-slate-400'}`}>{subtext}</p>
      
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-80 p-6 bg-slate-900 text-white text-xs rounded-xl shadow-2xl border border-white/5 z-50 animate-fade-in-up font-medium leading-relaxed">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};

const AnalysisList = ({ items, type }: { items: string[], type: 'strength' | 'challenge' | 'recommendation' }) => {
  const themes = {
    strength: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Strategic Leverage', bg: 'bg-emerald-50/30' },
    challenge: { icon: AlertCircle, color: 'text-rose-500', label: 'Risk Vector', bg: 'bg-rose-50/30' },
    recommendation: { icon: Lightbulb, color: 'text-accent', label: 'Consultant Directives', bg: 'bg-accent/5' },
  }[type];

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-6 flex-1">
      <div className="flex items-center gap-3 mb-4">
        <themes.icon className={`w-4 h-4 ${themes.color}`} />
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{themes.label}</span>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className={`p-6 rounded-2xl border border-slate-100 ${themes.bg} transition-all duration-300`}>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
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
    <div className="space-y-12 pb-16 last:pb-0 border-b border-slate-100 last:border-0">
      <div className="space-y-6 max-w-4xl">
        <h3 className="font-display text-2xl text-slate-900 tracking-tight">{data.title}</h3>
        <div className="text-lg text-slate-500 leading-relaxed font-medium border-l-4 border-accent/10 pl-8">
          {data.insight}
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <AnalysisList items={data.strengths} type="strength" />
        <AnalysisList items={data.challenges} type="challenge" />
        <AnalysisList items={data.recommendations} type="recommendation" />
      </div>
    </div>
  );
};

const ReportView: React.FC<{ report: FWAReport }> = ({ report }) => {
  return (
    <div className="space-y-16">
      {/* 1. Market & Positioning */}
      <SectionWrapper>
        <SectionHeader icon={Target} title="Market Dynamics & Positioning" />
        <div className="space-y-20">
          {report.painPoints?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
          {report.strategicPositioning?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
        </div>
      </SectionWrapper>

      {/* 2. Value Proposition */}
      <SectionWrapper>
        <SectionHeader icon={ShoppingBag} title="Strategic Value Propositions" />
        <div className="space-y-20">
          <AnalysisBlock data={report.valueProposition?.consumer} />
          <AnalysisBlock data={report.valueProposition?.enterprise} />
          <AnalysisBlock data={report.valueProposition?.operator} />
        </div>
      </SectionWrapper>

      {/* 3. Spectrum Analysis */}
      <SectionWrapper>
        <SectionHeader icon={Radio} title="Spectrum Infrastructure" />
        <div className="space-y-16">
          <div className="max-w-4xl">
             <p className="text-xl text-slate-500 leading-relaxed font-medium">{report.spectrumAnalysis?.overview}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-center">
             <div className="bg-slate-50 border border-slate-100 rounded-3xl p-10 shadow-inner">
                <SpectrumChart data={report.spectrumAnalysis?.bands || []} />
             </div>
             <div className="space-y-6">
                <h4 className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Status</h4>
                <div className="space-y-4">
                  {report.spectrumAnalysis?.bands?.map((b, i) => (
                    <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
                      <div className="space-y-1">
                        <div className="font-display text-lg text-slate-900">{b.band}</div>
                        <div className="text-[10px] font-mono text-slate-400 font-bold">{b.technology}</div>
                      </div>
                      <span className="text-[10px] font-black uppercase text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/10">{b.status}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          <AnalysisBlock data={report.spectrumAnalysis?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* 4. Technical & Network */}
      <SectionWrapper>
        <SectionHeader icon={Cpu} title="Technical Architecture" />
        <div className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {report.technicalCapabilities?.items?.map((item, i) => (
               <div key={i} className="p-8 border border-slate-100 rounded-2xl space-y-4 hover:border-accent/20 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg">{item.feature}</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded ${item.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{item.priority}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
               </div>
             ))}
          </div>
          <AnalysisBlock data={report.technicalCapabilities?.detailedAnalysis} />
          {report.networkPlanning?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
        </div>
      </SectionWrapper>

      {/* 5. Financial Outlook */}
      <section className="bg-slate-900 rounded-[2.5rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-10 flex flex-col justify-center">
               <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white shadow-xl">
                 <TrendingUp className="w-8 h-8" />
               </div>
               <div className="space-y-6">
                 <h2 className="font-display text-4xl lg:text-5xl tracking-tight leading-none">Financial ROI Model</h2>
                 <p className="text-xl text-white/70 leading-relaxed font-medium italic border-l-2 border-accent/40 pl-8">
                   {report.roiAnalysis?.summary}
                 </p>
               </div>
               <div className="flex flex-wrap gap-3 pt-4">
                  {report.roiAnalysis?.assumptions?.map((a, i) => (
                    <span key={i} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-mono uppercase tracking-widest font-black text-white/50">
                      {a}
                    </span>
                  ))}
               </div>
            </div>
            <div className="flex flex-col gap-8 justify-center">
               <StatWithTooltip 
                 label="Model Yield" value="28.4%" highlight subtext="Projected IRR"
                 tooltip="Estimated yield based on spectral efficiency gains and tower reuse optimization."
               />
               <StatWithTooltip 
                 label="Strategic Fit" value="Optimal" subtext="Portfolio Score"
                 tooltip="Strategic alignment with 5G rollout targets and competitive fiber displacement."
               />
            </div>
         </div>
      </section>

      {/* 6. Commercial & Ops */}
      <SectionWrapper>
        <SectionHeader icon={Wrench} title="Operational GTM & Ops" />
        <div className="space-y-20">
          {report.commercialStrategy?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
          {report.operations?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
        </div>
      </SectionWrapper>

      {/* 7. Sources */}
      {report.groundingChunks && (
        <div className="pt-12">
          <h4 className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 ml-4 text-center lg:text-left">Intelligence Sources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {report.groundingChunks.filter(c => c.web).map((source, idx) => (
              <a 
                key={idx} href={source.web.uri} target="_blank" 
                className="group flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:border-accent/20 transition-all shadow-sm hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-accent/5 flex items-center justify-center text-slate-300 group-hover:text-accent transition-colors">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate mb-1">{source.web.title}</div>
                  <div className="text-[9px] font-mono text-slate-400 truncate uppercase tracking-widest">{new URL(source.web.uri).hostname}</div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-accent transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;