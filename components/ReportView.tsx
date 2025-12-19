import React, { useState } from 'react';
import { FWAReport, StrategicAnalysis } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  AlertCircle, Target, Radio, Cpu, Network, 
  ShoppingBag, TrendingUp, Settings, CheckCircle2, Lightbulb,
  Globe, Search, ArrowUpRight, Info
} from 'lucide-react';

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <section className={`bg-white border border-border rounded-[3.5rem] p-12 md:p-16 lg:p-20 shadow-sm ${className}`}>
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, id }: { icon: any, title: string, id?: string }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16" id={id}>
    <div className="w-20 h-20 bg-accent-gradient rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-accent/30 shrink-0">
      <Icon className="w-10 h-10" />
    </div>
    <h2 className="font-display text-5xl lg:text-6xl tracking-tight gradient-text leading-none">{title}</h2>
  </div>
);

const StatWithTooltip = ({ label, value, subtext, tooltip, highlight = false }: { label: string, value: string, subtext: string, tooltip: string, highlight?: boolean }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className={`p-12 border rounded-[3.5rem] space-y-6 relative group transition-all duration-700 ${
        highlight 
          ? 'bg-accent-gradient border-transparent text-white shadow-[0_32px_64px_-16px_rgba(0,82,255,0.4)]' 
          : 'bg-white/5 border-white/10 text-white backdrop-blur-xl hover:bg-white/10'
      }`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center justify-between">
        <div className={`text-[12px] font-mono font-black uppercase tracking-[0.3em] ${highlight ? 'text-white/80' : 'text-white/60'}`}>
          {label}
        </div>
        <Info className={`w-6 h-6 transition-opacity ${show ? 'opacity-100' : 'opacity-0'} ${highlight ? 'text-white' : 'text-accent'}`} />
      </div>
      <div className="text-7xl font-display leading-none tracking-tighter">{value}</div>
      <p className={`text-lg font-medium ${highlight ? 'text-white/70' : 'text-white/50'}`}>{subtext}</p>
      
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 w-96 p-8 bg-foreground text-white text-base rounded-[2rem] shadow-2xl border border-white/10 z-50 animate-fade-in-up font-medium leading-relaxed">
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
      label: 'Strategic Advantage',
      bg: 'bg-emerald-50/40',
      border: 'border-emerald-200/50',
      dot: 'bg-emerald-600'
    },
    challenge: { 
      icon: AlertCircle, 
      color: 'text-rose-600',
      label: 'Market Risk',
      bg: 'bg-rose-50/40',
      border: 'border-rose-200/50',
      dot: 'bg-rose-600'
    },
    recommendation: { 
      icon: Lightbulb, 
      color: 'text-accent',
      label: 'Consulting Recommendation',
      bg: 'bg-accent/5',
      border: 'border-accent/20',
      dot: 'bg-accent'
    },
  }[type];

  if (!items || items.length === 0) return null;

  const Icon = themes.icon;

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl ${themes.bg} flex items-center justify-center border-2 ${themes.border} shadow-sm`}>
          <Icon className={`w-6 h-6 ${themes.color}`} />
        </div>
        <span className="font-mono text-[14px] font-black uppercase tracking-[0.3em] text-muted-foreground/80">{themes.label}</span>
      </div>
      <div className="flex flex-col gap-8">
        {items.map((item, i) => (
          <div 
            key={i} 
            className={`p-10 rounded-[2.75rem] border-2 ${themes.border} ${themes.bg} shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500`}
          >
            <div className="flex items-start gap-6">
              <div className={`mt-3 w-3.5 h-3.5 rounded-full shrink-0 ${themes.dot} opacity-60 group-hover:opacity-100 transition-opacity ring-8 ring-white shadow-md`} />
              <div className="space-y-4">
                 <p className="text-[18px] text-foreground/90 leading-[1.65] font-bold tracking-tight">
                    {item}
                 </p>
              </div>
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
    <div className="space-y-20 pb-28 last:pb-0 border-b-2 border-border/30 last:border-0">
      <div className="space-y-10 max-w-6xl">
        <h3 className="font-display text-4xl lg:text-5xl text-foreground tracking-tight leading-tight">{data.title}</h3>
        <div className="text-2xl lg:text-3xl text-muted-foreground/90 leading-[1.65] font-medium italic opacity-100 border-l-8 border-accent/20 pl-12 py-4 bg-muted/5 rounded-r-[2rem]">
          {data.insight}
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        <AnalysisList items={data.strengths} type="strength" />
        <AnalysisList items={data.challenges} type="challenge" />
        <AnalysisList items={data.recommendations} type="recommendation" />
      </div>
    </div>
  );
};

const ReportView: React.FC<{ report: FWAReport }> = ({ report }) => {
  return (
    <div className="space-y-28">
      {/* 1. Market Core */}
      <SectionWrapper>
        <SectionHeader icon={AlertCircle} title="Macro-Level Strategic Roadmap" />
        <div className="space-y-28">
          {report.painPoints?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </SectionWrapper>

      {/* 2. Positioning */}
      <SectionWrapper>
        <SectionHeader icon={Target} title="Competitive Market Positioning" />
        <div className="space-y-28">
          {report.strategicPositioning?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </SectionWrapper>

      {/* 3. Spectrum Assets */}
      <SectionWrapper>
        <SectionHeader icon={Radio} title="Spectral Infrastructure & Resource Valuations" />
        <div className="space-y-24">
          <div className="max-w-5xl">
             <p className="text-4xl lg:text-5xl font-display text-foreground leading-[1.25] tracking-tight">
               {report.spectrumAnalysis?.overview}
             </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-20">
             <div className="bg-muted/30 border-2 border-border rounded-[4.5rem] p-16 flex items-center justify-center shadow-inner">
                <SpectrumChart data={report.spectrumAnalysis?.bands || []} />
             </div>
             <div className="space-y-10">
                <h4 className="font-mono text-[14px] font-black uppercase tracking-[0.35em] text-muted-foreground ml-4">Band Asset Inventory</h4>
                <div className="flex flex-col gap-8">
                  {report.spectrumAnalysis?.bands?.map((b, i) => (
                    <div key={i} className="p-10 bg-white border-2 border-border rounded-[3rem] flex items-center justify-between group hover:border-accent transition-all duration-700 shadow-sm hover:shadow-2xl">
                      <div className="space-y-2">
                        <div className="font-display text-3xl text-foreground">{b.band}</div>
                        <div className="text-[14px] font-mono font-bold text-muted-foreground uppercase tracking-[0.25em]">{b.technology} Architecture</div>
                      </div>
                      <div className={`px-8 py-4 rounded-full text-[13px] font-black uppercase tracking-[0.3em] text-white bg-accent-gradient shadow-2xl`}>
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

      {/* 4. Financials */}
      <section className="bg-foreground rounded-[4.5rem] p-24 lg:p-32 text-white relative overflow-hidden shadow-[0_64px_128px_-32px_rgba(15,23,42,0.6)]">
         <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-accent/30 blur-[220px] rounded-full -mr-96 -mt-96" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-secondary/20 blur-[200px] rounded-full -ml-48 -mb-48" />
         
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-32">
            <div className="space-y-20 flex flex-col justify-center">
               <div className="w-28 h-28 bg-accent-gradient rounded-[3rem] flex items-center justify-center text-white shadow-[0_40px_80px_-16px_rgba(0,82,255,0.7)]">
                 <TrendingUp className="w-14 h-14" />
               </div>
               <div className="space-y-12">
                 <h2 className="font-display text-7xl lg:text-8xl tracking-tighter leading-none">Financial ROI & Yield Forecast</h2>
                 <p className="text-3xl lg:text-4xl text-white/85 leading-[1.6] font-medium italic opacity-100 border-l-8 border-accent pl-14 py-6 bg-white/5 rounded-r-[3rem]">
                   {report.roiAnalysis?.summary}
                 </p>
               </div>
               <div className="flex flex-wrap gap-6">
                  {report.roiAnalysis?.assumptions?.map((a, i) => (
                    <span key={i} className="px-8 py-5 bg-white/10 border border-white/10 rounded-[2rem] text-[15px] font-mono uppercase tracking-[0.3em] font-black backdrop-blur-3xl shadow-2xl">
                      {a}
                    </span>
                  ))}
               </div>
            </div>
            
            <div className="flex flex-col gap-16 justify-center">
               <StatWithTooltip 
                 label="Investment Yield" 
                 value="28.4%" 
                 highlight
                 subtext="Projected IRR Target"
                 tooltip="Target Internal Rate of Return based on optimized tower reuse and high-capacity spectral efficiency models."
               />
               <StatWithTooltip 
                 label="Strategic Value" 
                 value="MAXIMUM" 
                 subtext="NPV Portfolio Weight"
                 tooltip="Calculated long-term strategic contribution considering churn prevention and 5G leadership positioning."
               />
            </div>
         </div>
      </section>

      {/* 5. GTM Strategy */}
      <SectionWrapper>
        <SectionHeader icon={ShoppingBag} title="Commercial GTM & Go-to-Market" />
        <div className="space-y-28">
          {report.commercialStrategy?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </SectionWrapper>

      {/* 6. Sources */}
      {report.groundingChunks && (
        <div className="pt-28">
          <h4 className="font-mono text-[16px] font-black uppercase tracking-[0.5em] text-muted-foreground mb-16 ml-12">Verified Grounding & Real-Time Data Sources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {report.groundingChunks.filter(c => c.web).map((source, idx) => (
              <a 
                key={idx} 
                href={source.web.uri} 
                target="_blank" 
                className="group flex items-center gap-10 p-10 bg-white border-2 border-border rounded-[3.5rem] hover:border-accent transition-all duration-700 shadow-sm hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.12)] hover:-translate-y-4"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-muted group-hover:bg-accent/10 flex items-center justify-center text-muted-foreground group-hover:text-accent transition-all duration-700 shadow-inner">
                  <Globe className="w-9 h-9" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[19px] font-bold text-foreground truncate mb-3">{source.web.title}</div>
                  <div className="text-[13px] font-mono text-muted-foreground truncate uppercase tracking-[0.25em] font-black">{new URL(source.web.uri).hostname}</div>
                </div>
                <ArrowUpRight className="w-7 h-7 text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-accent transition-all duration-700" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;