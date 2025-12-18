import React, { useState } from 'react';
import { FWAReport, StrategicAnalysis } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  AlertCircle, Target, Radio, Cpu, Network, 
  ShoppingBag, TrendingUp, Settings, CheckCircle2, Lightbulb,
  Globe, Search, ArrowUpRight, Info
} from 'lucide-react';

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <section className={`bg-white border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm ${className}`}>
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, id }: { icon: any, title: string, id?: string }) => (
  <div className="flex items-center gap-4 mb-10" id={id}>
    <div className="w-12 h-12 bg-accent-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
      <Icon className="w-6 h-6" />
    </div>
    <h2 className="font-display text-3xl tracking-tight gradient-text">{title}</h2>
  </div>
);

const StatWithTooltip = ({ label, value, subtext, tooltip, highlight = false }: { label: string, value: string, subtext: string, tooltip: string, highlight?: boolean }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className={`p-8 border rounded-3xl space-y-2 relative group transition-all duration-300 ${
        highlight 
          ? 'bg-accent-gradient border-transparent text-white shadow-xl shadow-accent/20' 
          : 'bg-white/5 border-white/10 text-white backdrop-blur-sm hover:bg-white/10'
      }`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center justify-between">
        <div className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${highlight ? 'text-white/70' : 'text-white/50'}`}>
          {label}
        </div>
        <Info className={`w-3.5 h-3.5 transition-opacity ${show ? 'opacity-100' : 'opacity-0'} ${highlight ? 'text-white' : 'text-accent'}`} />
      </div>
      <div className="text-4xl font-display">{value}</div>
      <p className={`text-xs ${highlight ? 'text-white/70' : 'text-white/40'}`}>{subtext}</p>
      
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 bg-foreground text-white text-[11px] rounded-xl shadow-2xl border border-white/10 z-50 animate-fade-in-up font-medium leading-relaxed">
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
      dot: 'bg-emerald-600'
    },
    challenge: { 
      icon: AlertCircle, 
      color: 'text-rose-600',
      label: 'Challenge',
      dot: 'bg-rose-600'
    },
    recommendation: { 
      icon: Lightbulb, 
      color: 'text-accent',
      label: 'Advice',
      dot: 'bg-accent'
    },
  }[type];

  if (!items || items.length === 0) return null;

  const Icon = themes.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-3.5 h-3.5 ${themes.color}`} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{themes.label}</span>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 group">
            <div className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${themes.dot} opacity-20 group-hover:opacity-100 transition-opacity`} />
            <span className="text-sm text-foreground/80 leading-relaxed font-medium">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AnalysisBlock: React.FC<{ data: StrategicAnalysis }> = ({ data }) => {
  if (!data) return null;
  return (
    <div className="space-y-8 pb-12 last:pb-0 border-b border-border/50 last:border-0">
      <div className="space-y-4 max-w-3xl">
        <h3 className="font-display text-xl text-foreground">{data.title}</h3>
        <p className="text-lg text-muted-foreground leading-relaxed font-medium italic">
          "{data.insight}"
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <AnalysisList items={data.strengths} type="strength" />
        <AnalysisList items={data.challenges} type="challenge" />
        <AnalysisList items={data.recommendations} type="recommendation" />
      </div>
    </div>
  );
};

const ReportView: React.FC<{ report: FWAReport }> = ({ report }) => {
  return (
    <div className="space-y-12">
      {/* 1. Pain Points */}
      <SectionWrapper>
        <SectionHeader icon={AlertCircle} title="Market Dynamics & Core Pain Points" />
        <div className="space-y-12">
          {report.painPoints?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </SectionWrapper>

      {/* 2. Strategic Positioning */}
      <SectionWrapper>
        <SectionHeader icon={Target} title="FWA Market Positioning" />
        <div className="space-y-12">
          {report.strategicPositioning?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </SectionWrapper>

      {/* 3. Value Props */}
      <SectionWrapper>
        <SectionHeader icon={TrendingUp} title="Strategic Value Propositions" />
        <div className="grid grid-cols-1 gap-16">
           {report.valueProposition?.consumer && <AnalysisBlock data={report.valueProposition.consumer} />}
           {report.valueProposition?.enterprise && <AnalysisBlock data={report.valueProposition.enterprise} />}
           {report.valueProposition?.operator && <AnalysisBlock data={report.valueProposition.operator} />}
        </div>
      </SectionWrapper>

      {/* 4. Spectrum Analysis */}
      <SectionWrapper>
        <SectionHeader icon={Radio} title="Spectrum Assets & Strategy" />
        <div className="space-y-12">
          <p className="text-2xl font-display text-foreground max-w-4xl leading-tight">
            {report.spectrumAnalysis?.overview}
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
             <div className="bg-muted/30 border border-border rounded-3xl p-6">
                <SpectrumChart data={report.spectrumAnalysis?.bands || []} />
             </div>
             <div className="space-y-4">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground ml-1">Asset Inventory</h4>
                {report.spectrumAnalysis?.bands?.map((b, i) => (
                  <div key={i} className="p-4 bg-white border border-border rounded-2xl flex items-center justify-between group hover:border-accent transition-colors shadow-sm">
                    <div>
                      <div className="font-bold text-foreground">{b.band}</div>
                      <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{b.technology}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-accent-gradient shadow-sm`}>
                      {b.status}
                    </div>
                  </div>
                ))}
             </div>
          </div>
          <AnalysisBlock data={report.spectrumAnalysis?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* 5. Technical roadmap */}
      <SectionWrapper>
        <SectionHeader icon={Cpu} title="Infrastructure & Technical Readiness" />
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16">
           <div className="space-y-6">
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Strategic Priorities</h4>
              <div className="space-y-4">
                {report.technicalCapabilities?.items?.map((tech, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-foreground text-sm">{tech.feature}</span>
                      <span className="text-[9px] font-black uppercase text-accent">{tech.priority}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                       <div className={`h-full bg-accent-gradient ${tech.priority === 'High' ? 'w-full' : tech.priority === 'Medium' ? 'w-2/3' : 'w-1/3'}`} />
                    </div>
                  </div>
                ))}
              </div>
           </div>
           <AnalysisBlock data={report.technicalCapabilities?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* Financial Section */}
      <section className="bg-foreground rounded-[2.5rem] p-12 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 blur-[120px] rounded-full -mr-48 -mt-48" />
         
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
               <div className="w-12 h-12 bg-accent-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                 <TrendingUp className="w-6 h-6" />
               </div>
               <h2 className="font-display text-4xl">ROI & Commercial Forecast</h2>
               <p className="text-xl text-white/70 leading-relaxed italic">
                 "{report.roiAnalysis?.summary}"
               </p>
               <div className="flex flex-wrap gap-2">
                  {report.roiAnalysis?.assumptions?.map((a, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-mono uppercase tracking-widest">{a}</span>
                  ))}
               </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
               <StatWithTooltip 
                 label="Market Potential" 
                 value="HIGH" 
                 subtext="Forecasted NPV Cluster"
                 tooltip="Represents the qualitative assessment of addressable FWA market scale based on competitor coverage gaps and spectrum availability."
               />
               <StatWithTooltip 
                 label="IRR Target" 
                 value="20%+" 
                 subtext="Strategic Benchmarks"
                 highlight
                 tooltip="Internal Rate of Return expected from the FWA deployment over a 5-year horizon, assuming optimized spectrum utilization."
               />
            </div>
         </div>
      </section>

      {/* Citations */}
      {report.groundingChunks && (
        <div className="pt-12">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 ml-4">Grounded Search Sources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.groundingChunks.filter(c => c.web).map((source, idx) => (
              <a 
                key={idx} 
                href={source.web.uri} 
                target="_blank" 
                className="group flex items-center gap-4 p-4 bg-white border border-border rounded-2xl hover:border-accent transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-accent/5 flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-foreground truncate">{source.web.title}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{source.web.uri}</div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;