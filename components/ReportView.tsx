import React, { useState } from 'react';
import { FWAReport, StrategicAnalysis } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  AlertCircle, Target, Radio, Cpu, Network, 
  ShoppingBag, TrendingUp, Settings, CheckCircle2, Lightbulb,
  Globe, Search, ArrowUpRight, Info
} from 'lucide-react';

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <section className={`bg-white border border-border rounded-[2.5rem] p-10 md:p-14 lg:p-16 shadow-sm ${className}`}>
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, id }: { icon: any, title: string, id?: string }) => (
  <div className="flex items-center gap-6 mb-12" id={id}>
    <div className="w-16 h-16 bg-accent-gradient rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-accent/20">
      <Icon className="w-8 h-8" />
    </div>
    <h2 className="font-display text-4xl lg:text-5xl tracking-tight gradient-text">{title}</h2>
  </div>
);

const StatWithTooltip = ({ label, value, subtext, tooltip, highlight = false }: { label: string, value: string, subtext: string, tooltip: string, highlight?: boolean }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className={`p-10 border rounded-[2.5rem] space-y-4 relative group transition-all duration-500 ${
        highlight 
          ? 'bg-accent-gradient border-transparent text-white shadow-2xl shadow-accent/25' 
          : 'bg-white/5 border-white/10 text-white backdrop-blur-md hover:bg-white/10'
      }`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center justify-between">
        <div className={`text-[11px] font-mono font-bold uppercase tracking-[0.25em] ${highlight ? 'text-white/80' : 'text-white/60'}`}>
          {label}
        </div>
        <Info className={`w-5 h-5 transition-opacity ${show ? 'opacity-100' : 'opacity-0'} ${highlight ? 'text-white' : 'text-accent'}`} />
      </div>
      <div className="text-6xl font-display leading-none">{value}</div>
      <p className={`text-base font-medium ${highlight ? 'text-white/70' : 'text-white/50'}`}>{subtext}</p>
      
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-80 p-6 bg-foreground text-white text-sm rounded-[1.5rem] shadow-2xl border border-white/10 z-50 animate-fade-in-up font-medium leading-relaxed">
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
      bg: 'bg-emerald-50/25',
      border: 'border-emerald-200/50',
      dot: 'bg-emerald-600'
    },
    challenge: { 
      icon: AlertCircle, 
      color: 'text-rose-600',
      label: 'Challenge',
      bg: 'bg-rose-50/25',
      border: 'border-rose-200/50',
      dot: 'bg-rose-600'
    },
    recommendation: { 
      icon: Lightbulb, 
      color: 'text-accent',
      label: 'Advice',
      bg: 'bg-accent/5',
      border: 'border-accent/20',
      dot: 'bg-accent'
    },
  }[type];

  if (!items || items.length === 0) return null;

  const Icon = themes.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-xl ${themes.bg} flex items-center justify-center border ${themes.border}`}>
          <Icon className={`w-5 h-5 ${themes.color}`} />
        </div>
        <span className="font-mono text-[12px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">{themes.label}</span>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div 
            key={i} 
            className={`p-6 rounded-[1.75rem] border ${themes.border} ${themes.bg} shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="flex items-start gap-4">
              <div className={`mt-2 w-2 h-2 rounded-full shrink-0 ${themes.dot} opacity-50 group-hover:opacity-100 transition-opacity ring-4 ring-white shadow-sm`} />
              <p className="text-[15px] text-foreground/90 leading-relaxed font-semibold">{item}</p>
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
    <div className="space-y-12 pb-20 last:pb-0 border-b border-border/50 last:border-0">
      <div className="space-y-6 max-w-5xl">
        <h3 className="font-display text-3xl text-foreground tracking-tight">{data.title}</h3>
        <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-medium italic opacity-90">
          "{data.insight}"
        </p>
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
    <div className="space-y-20">
      {/* 1. Market Analysis */}
      <SectionWrapper>
        <SectionHeader icon={AlertCircle} title="Macro-Economic & Strategic Analysis" />
        <div className="space-y-20">
          {report.painPoints?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </SectionWrapper>

      {/* 2. Positioning */}
      <SectionWrapper>
        <SectionHeader icon={Target} title="Competitive Positioning Roadmap" />
        <div className="space-y-20">
          {report.strategicPositioning?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </SectionWrapper>

      {/* 4. Spectrum Assets */}
      <SectionWrapper>
        <SectionHeader icon={Radio} title="Spectrum Ecosystem & Digital Assets" />
        <div className="space-y-16">
          <div className="max-w-4xl space-y-4">
             <p className="text-3xl lg:text-4xl font-display text-foreground leading-tight">
               {report.spectrumAnalysis?.overview}
             </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-14">
             <div className="bg-muted/30 border border-border rounded-[3rem] p-12 flex items-center justify-center shadow-inner">
                <SpectrumChart data={report.spectrumAnalysis?.bands || []} />
             </div>
             <div className="space-y-6">
                <h4 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-3">Spectrum Inventory Details</h4>
                <div className="flex flex-col gap-4">
                  {report.spectrumAnalysis?.bands?.map((b, i) => (
                    <div key={i} className="p-7 bg-white border border-border rounded-[2rem] flex items-center justify-between group hover:border-accent transition-all duration-500 shadow-sm hover:shadow-2xl">
                      <div className="space-y-1">
                        <div className="font-display text-2xl text-foreground">{b.band}</div>
                        <div className="text-[12px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em]">{b.technology} Next-Gen Architecture</div>
                      </div>
                      <div className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white bg-accent-gradient shadow-xl`}>
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

      {/* Financials & ROI */}
      <section className="bg-foreground rounded-[3.5rem] p-16 lg:p-20 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 blur-[180px] rounded-full -mr-80 -mt-80" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-secondary/10 blur-[150px] rounded-full -ml-40 -mb-40" />
         
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-24">
            <div className="space-y-12 flex flex-col justify-center">
               <div className="w-20 h-20 bg-accent-gradient rounded-[1.75rem] flex items-center justify-center text-white shadow-[0_20px_40px_-10px_rgba(0,82,255,0.5)]">
                 <TrendingUp className="w-10 h-10" />
               </div>
               <div className="space-y-8">
                 <h2 className="font-display text-6xl tracking-tight">Yield Forecast & Commercial ROI</h2>
                 <p className="text-2xl lg:text-3xl text-white/80 leading-relaxed font-medium italic opacity-90 border-l-4 border-accent pl-8">
                   "{report.roiAnalysis?.summary}"
                 </p>
               </div>
               <div className="flex flex-wrap gap-4">
                  {report.roiAnalysis?.assumptions?.map((a, i) => (
                    <span key={i} className="px-5 py-3 bg-white/10 border border-white/5 rounded-2xl text-[12px] font-mono uppercase tracking-[0.2em] font-black backdrop-blur-xl shadow-lg">
                      {a}
                    </span>
                  ))}
               </div>
            </div>
            
            <div className="flex flex-col gap-10 justify-center">
               <StatWithTooltip 
                 label="Commercial Upside" 
                 value="STRATEGIC" 
                 subtext="Enterprise Market Expansion"
                 tooltip="Represents the calculated strategic value beyond direct revenue, including brand equity in the 5G era and churn reduction."
               />
               <StatWithTooltip 
                 label="Yield Target" 
                 value="24.8%" 
                 subtext="5-Year Model IRR"
                 highlight
                 tooltip="Internal Rate of Return based on optimized infrastructure sharing and spectral efficiency gains via 5G NR Beamforming."
               />
            </div>
         </div>
      </section>

      {/* Commercial Strategy */}
      <SectionWrapper>
        <SectionHeader icon={ShoppingBag} title="Go-to-Market & Commercial Excellence" />
        <div className="space-y-20">
          {report.commercialStrategy?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </SectionWrapper>

      {/* Sources */}
      {report.groundingChunks && (
        <div className="pt-20">
          <h4 className="font-mono text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-10 ml-8">Primary Data Sources & Grounding</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {report.groundingChunks.filter(c => c.web).map((source, idx) => (
              <a 
                key={idx} 
                href={source.web.uri} 
                target="_blank" 
                className="group flex items-center gap-6 p-6 bg-white border border-border rounded-[2rem] hover:border-accent transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted group-hover:bg-accent/10 flex items-center justify-center text-muted-foreground group-hover:text-accent transition-all duration-500 shadow-inner">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-foreground truncate mb-1">{source.web.title}</div>
                  <div className="text-[11px] font-mono text-muted-foreground truncate uppercase tracking-[0.15em] font-bold">{new URL(source.web.uri).hostname}</div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:text-accent transition-all duration-500" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;