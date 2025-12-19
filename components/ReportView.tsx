
import React, { useState } from 'react';
import { FWAReport, StrategicAnalysis, TechnicalFeature } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  AlertCircle, Target, Radio, Cpu, Network, 
  ShoppingBag, TrendingUp, Settings, CheckCircle2, Lightbulb,
  Globe, Search, ArrowUpRight, Info, Layers, Wrench, ChevronRight,
  ShieldAlert, BookOpen, Microscope
} from 'lucide-react';

const SectionWrapper: React.FC<{ children: React.ReactNode; bgColor?: string }> = ({ children, bgColor = "bg-white" }) => (
  <section className={`${bgColor} p-12 lg:p-20 mb-20`}>
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, color = "text-primary" }: { icon: any, title: string, color?: string }) => (
  <div className="flex flex-col gap-6 mb-16 border-l-[12px] border-foreground pl-10">
    <div className={`w-20 h-20 bg-foreground flex items-center justify-center text-white rounded-md`}>
      <Icon className="w-10 h-10" />
    </div>
    <div className="space-y-1">
      <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-foreground uppercase italic">{title}</h2>
      <span className="text-[11px] font-mono font-black uppercase tracking-[0.5em] text-foreground/20">Strategic Grounding Matrix</span>
    </div>
  </div>
);

const ExpertCallout: React.FC<{ critique?: string; directives?: string[] }> = ({ critique, directives }) => {
  if (!critique && (!directives || directives.length === 0)) return null;

  return (
    <div className="mt-12 p-12 bg-foreground text-white border-b-[16px] border-accent relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[1.7] duration-1000">
        <ShieldAlert className="w-48 h-48" />
      </div>
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-accent text-white text-[10px] font-black uppercase tracking-[0.4em] rounded">Expert Critique</div>
        </div>
        
        {critique && (
          <p className="text-white text-xl lg:text-2xl leading-tight font-bold italic max-w-4xl">
            "{critique}"
          </p>
        )}

        {directives && directives.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-white/10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[11px] font-mono font-black uppercase tracking-widest text-white/40">
                <Microscope className="w-4 h-4" />
                Research Directives
              </div>
              <ul className="space-y-3">
                {directives.map((d, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm font-medium text-white/70">
                    <span className="w-2 h-2 bg-accent mt-1.5 shrink-0" /> {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AnalysisList = ({ items, type }: { items: string[], type: 'strength' | 'challenge' | 'recommendation' }) => {
  const themes = {
    strength: { color: 'text-secondary', bg: 'bg-secondary/10', label: 'Strengths', border: 'border-secondary' },
    challenge: { color: 'text-accent', bg: 'bg-accent/10', label: 'Constraints', border: 'border-accent' },
    recommendation: { color: 'text-primary', bg: 'bg-primary/10', label: 'Directives', border: 'border-primary' },
  }[type];

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-2 h-6 ${themes.bg.replace('/10', '')}`} />
        <span className="font-mono text-[11px] font-black uppercase tracking-[0.4em] text-foreground/30">{themes.label}</span>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className={`p-6 bg-white border-2 ${themes.border} hover:scale-[1.02] transition-transform duration-200 cursor-default`}>
             <p className="text-base font-bold text-foreground leading-tight">
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
    <div className="space-y-16 py-16 border-b-8 border-muted last:border-0 last:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 space-y-8">
          <h3 className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tighter leading-none">{data.title}</h3>
          <div className="text-xl text-foreground/60 leading-tight font-medium border-l-8 border-primary pl-10 py-2">
            {data.insight}
          </div>
        </div>
        
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnalysisList items={data.strengths} type="strength" />
          <AnalysisList items={data.challenges} type="challenge" />
          <div className="md:col-span-2">
            <AnalysisList items={data.recommendations} type="recommendation" />
          </div>
        </div>
      </div>
      <ExpertCallout critique={data.expertCritique} directives={data.researchDirectives} />
    </div>
  );
};

const FeatureGrid: React.FC<{ items: TechnicalFeature[] }> = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {items.map((item, i) => (
      <div key={i} className="p-8 bg-muted hover:bg-primary hover:text-white transition-all duration-200 group">
        <div className="flex items-center justify-between mb-6">
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-2 py-1 rounded-sm ${
            item.priority === 'High' ? 'bg-foreground text-white' : 
            'bg-foreground/10 text-foreground group-hover:bg-white group-hover:text-primary'
          }`}>
            {item.priority}
          </span>
          <div className="text-2xl font-black italic tracking-tighter group-hover:text-white">{item.relevanceScore}%</div>
        </div>
        <h5 className="text-2xl font-extrabold tracking-tight mb-4 group-hover:text-white leading-none">{item.feature}</h5>
        <p className="text-sm font-medium leading-tight text-foreground/50 group-hover:text-white/80">{item.description}</p>
      </div>
    ))}
  </div>
);

const ReportView: React.FC<{ report: FWAReport }> = ({ report }) => {
  return (
    <div className="space-y-12">
      
      {/* 0. Executive Audit Summary - High Contrast Block */}
      <section className="bg-foreground p-16 lg:p-24 text-white relative overflow-hidden mb-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 -translate-y-1/2 translate-x-1/2 rotate-12" />
        <div className="relative z-10 space-y-16">
          <div className="flex flex-col gap-6">
            <div className="w-16 h-16 bg-white text-foreground flex items-center justify-center rounded-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-6xl lg:text-8xl font-extrabold tracking-tighter leading-none uppercase italic">The Audit.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
             <div className="lg:col-span-8">
                <p className="text-2xl lg:text-4xl font-bold leading-[1.1] italic text-primary">
                  "{report.expertSummary}"
                </p>
             </div>
             <div className="lg:col-span-4 p-10 bg-white/5 border-l-8 border-primary">
                <div className="text-[11px] font-mono font-black uppercase tracking-[0.5em] text-white/30 mb-6">Core Focus Vector</div>
                <div className="text-3xl font-extrabold leading-[1] tracking-tight">
                  {report.operatorName.toUpperCase()} / {report.country.toUpperCase()} <br/>
                  FWA Deployment Logic
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 1. Market Dynamics Positioning */}
      <SectionWrapper bgColor="bg-white">
        <SectionHeader icon={Target} title="Market Dynamics" />
        <div className="space-y-20">
          {report.painPoints?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
          {report.strategicPositioning?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
        </div>
      </SectionWrapper>

      {/* 2. Value Synthesis */}
      <SectionWrapper bgColor="bg-muted">
        <SectionHeader icon={ShoppingBag} title="Commercial Synthesis" />
        <div className="space-y-20">
          <AnalysisBlock data={report.valueProposition?.consumer} />
          <AnalysisBlock data={report.valueProposition?.enterprise} />
          <AnalysisBlock data={report.valueProposition?.operator} />
        </div>
      </SectionWrapper>

      {/* 3. Spectrum Mapping */}
      <SectionWrapper bgColor="bg-white">
        <SectionHeader icon={Radio} title="Spectral Footprint" />
        <div className="space-y-16">
          <p className="text-4xl font-extrabold text-foreground tracking-tighter leading-[1.1] max-w-4xl">{report.spectrumAnalysis?.overview}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
             <div className="lg:col-span-8 bg-muted p-12 border-b-[12px] border-primary">
                <SpectrumChart data={report.spectrumAnalysis?.bands || []} />
             </div>
             <div className="lg:col-span-4 space-y-10">
                <h4 className="font-mono text-[12px] font-black uppercase tracking-[0.5em] text-foreground/20 italic">Registry Output</h4>
                <div className="space-y-4">
                  {report.spectrumAnalysis?.bands?.map((b, i) => (
                    <div key={i} className="p-6 bg-white border-2 border-foreground hover:bg-foreground hover:text-white transition-all group flex items-center justify-between cursor-default">
                      <div className="space-y-1">
                        <div className="text-2xl font-black italic leading-none">{b.band}</div>
                        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground/30 group-hover:text-white/40">{b.technology}</div>
                      </div>
                      <div className="text-[11px] font-black uppercase bg-primary text-white px-3 py-1 rounded-sm group-hover:bg-white group-hover:text-primary">{b.status}</div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          <AnalysisBlock data={report.spectrumAnalysis?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* 4. Technical Architecture */}
      <SectionWrapper bgColor="bg-muted">
        <SectionHeader icon={Cpu} title="Infrastructure" />
        <div className="space-y-20">
          <FeatureGrid items={report.technicalCapabilities?.items || []} />
          <AnalysisBlock data={report.technicalCapabilities?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* 5. ROI Vector Modeling - Specific requested change */}
      <section className="bg-primary text-white p-20 lg:p-32 mb-20 relative overflow-hidden">
         <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-foreground/10 -translate-x-1/4 translate-y-1/2 rotate-45" />
         <div className="relative z-10 flex flex-col gap-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
              <div className="lg:col-span-8 space-y-10">
                 <div className="w-24 h-24 bg-white text-primary flex items-center justify-center rounded-sm">
                   <TrendingUp className="w-12 h-12" />
                 </div>
                 <h2 className="text-7xl lg:text-9xl font-extrabold tracking-tighter leading-none uppercase italic">ROI VECTOR.</h2>
                 <p className="text-2xl lg:text-4xl font-bold leading-[1.1] text-white max-w-2xl">
                   {report.roiAnalysis?.summary}
                 </p>
                 <div className="flex flex-wrap gap-4 pt-10">
                    {report.roiAnalysis?.assumptions?.map((a, i) => (
                      <span key={i} className="px-5 py-2 bg-foreground text-white text-[11px] font-black uppercase tracking-widest rounded-sm border border-white/10">
                        {a}
                      </span>
                    ))}
                 </div>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-10">
                 {/* Estimated IRR Block - Clean and Bold */}
                 <div className="p-12 bg-white text-foreground space-y-8 hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-black uppercase tracking-[0.5em] text-foreground/30">Estimated IRR</span>
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-8xl font-black tracking-tighter leading-none">28.4%</div>
                    <div className="h-2 bg-primary w-full" />
                    <p className="text-sm font-bold uppercase tracking-widest text-foreground/40 leading-none italic">Deployment Portfolio Yield</p>
                 </div>

                 <div className="p-10 bg-foreground text-white border-l-[12px] border-white/20">
                    <div className="text-[11px] font-mono font-black uppercase tracking-[0.5em] text-white/30 mb-6">Strategy Matrix</div>
                    <p className="text-xl font-bold leading-tight">
                      {report.roiAnalysis?.roiCalculatorLogic}
                    </p>
                 </div>
              </div>
            </div>
            <div className="bg-white p-12 lg:p-20 text-foreground">
              <AnalysisBlock data={report.roiAnalysis?.detailedAnalysis} />
            </div>
         </div>
      </section>

      {/* Footer Attribution - Grounding */}
      {report.groundingChunks && (
        <div className="bg-foreground text-white p-20 mb-20">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex flex-col gap-6">
               <div className="h-4 bg-primary w-24" />
               <h4 className="text-4xl font-extrabold uppercase tracking-tighter italic">Source Grounding</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {report.groundingChunks.filter(c => c.web).map((source, idx) => (
                <a 
                  key={idx} href={source.web.uri} target="_blank" 
                  className="group bg-white/5 p-10 hover:bg-primary transition-all duration-300 border-l-[8px] border-primary hover:border-white"
                >
                  <div className="w-12 h-12 bg-white text-foreground flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="space-y-4">
                    <div className="text-xl font-extrabold leading-tight line-clamp-2 uppercase tracking-tight">{source.web.title}</div>
                    <div className="flex items-center justify-between pt-4 opacity-30 group-hover:opacity-100">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest truncate max-w-[120px]">{new URL(source.web.uri).hostname}</span>
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;
