import React, { useState } from 'react';
import { FWAReport, StrategicAnalysis } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  AlertCircle, Target, Radio, Cpu, Network, 
  ShoppingBag, TrendingUp, Settings, CheckCircle2, Lightbulb,
  Globe, Search, ArrowUpRight, Info
} from 'lucide-react';

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <section className={`bg-white border border-border rounded-[2.5rem] p-10 md:p-14 shadow-sm ${className}`}>
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, id }: { icon: any, title: string, id?: string }) => (
  <div className="flex items-center gap-5 mb-12" id={id}>
    <div className="w-14 h-14 bg-accent-gradient rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-accent/20">
      <Icon className="w-7 h-7" />
    </div>
    <h2 className="font-display text-4xl tracking-tight gradient-text">{title}</h2>
  </div>
);

const StatWithTooltip = ({ label, value, subtext, tooltip, highlight = false }: { label: string, value: string, subtext: string, tooltip: string, highlight?: boolean }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className={`p-10 border rounded-[2rem] space-y-3 relative group transition-all duration-500 ${
        highlight 
          ? 'bg-accent-gradient border-transparent text-white shadow-2xl shadow-accent/25' 
          : 'bg-white/5 border-white/10 text-white backdrop-blur-md hover:bg-white/10'
      }`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center justify-between">
        <div className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${highlight ? 'text-white/80' : 'text-white/60'}`}>
          {label}
        </div>
        <Info className={`w-4 h-4 transition-opacity ${show ? 'opacity-100' : 'opacity-0'} ${highlight ? 'text-white' : 'text-accent'}`} />
      </div>
      <div className="text-5xl font-display">{value}</div>
      <p className={`text-sm font-medium ${highlight ? 'text-white/70' : 'text-white/50'}`}>{subtext}</p>
      
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 w-72 p-5 bg-foreground text-white text-xs rounded-[1.25rem] shadow-2xl border border-white/10 z-50 animate-fade-in-up font-medium leading-relaxed">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-foreground" />
        </div>
      )}
    </div>
  );
};

const AnalysisList = ({ items, type }: { items: string[], type: 'strength' | 'challenge' | 'recommendation' }) => {
  const themes = {
    strength: { 
      icon: CheckCircle2, 
      color: 'text-emerald-600',
      label: 'Strength',
      bg: 'bg-emerald-50/20',
      border: 'border-emerald-100/50',
      dot: 'bg-emerald-600'
    },
    challenge: { 
      icon: AlertCircle, 
      color: 'text-rose-600',
      label: 'Challenge',
      bg: 'bg-rose-50/20',
      border: 'border-rose-100/50',
      dot: 'bg-rose-600'
    },
    recommendation: { 
      icon: Lightbulb, 
      color: 'text-accent',
      label: 'Advice',
      bg: 'bg-accent/5',
      border: 'border-accent/10',
      dot: 'bg-accent'
    },
  }[type];

  if (!items || items.length === 0) return null;

  const Icon = themes.icon;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-7 h-7 rounded-lg ${themes.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${themes.color}`} />
        </div>
        <span className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">{themes.label}</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {items.map((item, i) => (
          <div 
            key={i} 
            className={`p-5 rounded-2xl border ${themes.border} ${themes.bg} shadow-sm group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${themes.dot} opacity-40 group-hover:opacity-100 transition-opacity`} />
              <p className="text-sm text-foreground/80 leading-relaxed font-semibold">{item}</p>
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
    <div className="space-y-10 pb-16 last:pb-0 border-b border-border/50 last:border-0">
      <div className="space-y-5 max-w-4xl">
        <h3 className="font-display text-2xl text-foreground">{data.title}</h3>
        <p className="text-xl text-muted-foreground leading-relaxed font-medium italic">
          "{data.insight}"
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      {/* 1. Pain Points */}
      <SectionWrapper>
        <SectionHeader icon={AlertCircle} title="Strategic Market Analysis" />
        <div className="space-y-16">
          {report.painPoints?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </SectionWrapper>

      {/* 2. Positioning */}
      <SectionWrapper>
        <SectionHeader icon={Target} title="FWA Positioning Strategy" />
        <div className="space-y-16">
          {report.strategicPositioning?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </SectionWrapper>

      {/* 4. Spectrum */}
      <SectionWrapper>
        <SectionHeader icon={Radio} title="Spectrum Ecosystem & Assets" />
        <div className="space-y-14">
          <p className="text-3xl font-display text-foreground max-w-4xl leading-tight">
            {report.spectrumAnalysis?.overview}
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12">
             <div className="bg-muted/30 border border-border rounded-[2.5rem] p-10 flex items-center justify-center">
                <SpectrumChart data={report.spectrumAnalysis?.bands || []} />
             </div>
             <div className="space-y-5">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-2">Digital Asset Inventory</h4>
                <div className="grid grid-cols-1 gap-3">
                  {report.spectrumAnalysis?.bands?.map((b, i) => (
                    <div key={i} className="p-6 bg-white border border-border rounded-2xl flex items-center justify-between group hover:border-accent transition-all duration-300 shadow-sm hover:shadow-lg">
                      <div>
                        <div className="font-bold text-lg text-foreground">{b.band}</div>
                        <div className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest">{b.technology} Architecture</div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-white bg-accent-gradient shadow-md`}>
                        {b.status}
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          <AnalysisBlock data={report.spectrumAnalysis?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* Financials */}
      <section className="bg-foreground rounded-[3rem] p-14 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[150px] rounded-full -mr-64 -mt-64" />
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-secondary/10 blur-[120px] rounded-full -ml-32 -mb-32" />
         
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-10 flex flex-col justify-center">
               <div className="w-16 h-16 bg-accent-gradient rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-accent/40">
                 <TrendingUp className="w-8 h-8" />
               </div>
               <div className="space-y-6">
                 <h2 className="font-display text-5xl">Financial Forecast & Yield</h2>
                 <p className="text-2xl text-white/70 leading-relaxed font-medium italic">
                   "{report.roiAnalysis?.summary}"
                 </p>
               </div>
               <div className="flex flex-wrap gap-3">
                  {report.roiAnalysis?.assumptions?.map((a, i) => (
                    <span key={i} className="px-4 py-2 bg-white/10 border border-white/5 rounded-xl text-xs font-mono uppercase tracking-[0.15em] font-bold backdrop-blur-md">
                      {a}
                    </span>
                  ))}
               </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
               <StatWithTooltip 
                 label="Market Opportunity" 
                 value="V. HIGH" 
                 subtext="Net Present Value Cluster"
                 tooltip="The long-term economic value of the FWA opportunity, adjusted for local competitive factors and spectrum density."
               />
               <StatWithTooltip 
                 label="Internal Yield" 
                 value="22.4%" 
                 subtext="Annualized IRR Target"
                 highlight
                 tooltip="Projected internal rate of return, specifically modeling 5G infrastructure reuse and legacy copper replacement efficiencies."
               />
            </div>
         </div>
      </section>

      {/* Sources */}
      {report.groundingChunks && (
        <div className="pt-16">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8 ml-6">Primary Strategic Sources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {report.groundingChunks.filter(c => c.web).map((source, idx) => (
              <a 
                key={idx} 
                href={source.web.uri} 
                target="_blank" 
                className="group flex items-center gap-5 p-5 bg-white border border-border rounded-[1.5rem] hover:border-accent transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-accent/5 flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors shadow-inner">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">{source.web.title}</div>
                  <div className="text-[10px] font-mono text-muted-foreground truncate uppercase tracking-widest">{new URL(source.web.uri).hostname}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;