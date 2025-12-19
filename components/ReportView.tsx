
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FWAReport, StrategicAnalysis, TechnicalFeature } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  Target, Radio, Cpu, ShoppingBag, TrendingUp, Globe, ArrowUpRight, ShieldAlert, Microscope, Activity
} from 'lucide-react';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  }
};

const SectionWrapper: React.FC<{ children: React.ReactNode; bgColor?: string }> = ({ children, bgColor = "bg-white" }) => (
  <motion.section 
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    className={`${bgColor} p-8 lg:p-16 mb-12 border-b-4 border-foreground last:border-0`}
  >
    {children}
  </motion.section>
);

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-start gap-6 mb-10 border-l-[8px] border-primary pl-6">
    <div className="w-16 h-16 bg-foreground flex items-center justify-center text-white shrink-0">
      <Icon className="w-8 h-8" />
    </div>
    <div className="space-y-1">
      <h2 className="text-4xl font-extrabold tracking-tighter text-foreground uppercase italic leading-none">{title}</h2>
      <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-foreground/40">Technical Grounding Module</span>
    </div>
  </div>
);

const ExpertCallout: React.FC<{ critique?: string; directives?: string[] }> = ({ critique, directives }) => {
  if (!critique && (!directives || directives.length === 0)) return null;

  return (
    <div className="mt-8 p-8 bg-foreground text-white border-t-8 border-accent relative overflow-hidden group">
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-4">
          <div className="px-2 py-1 bg-accent text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-sm">Expert Audit</div>
        </div>
        
        {critique && (
          <p className="text-lg leading-snug font-bold italic border-l-4 border-accent pl-6 text-white/90">
            "{critique}"
          </p>
        )}

        {directives && directives.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[9px] font-mono font-black uppercase tracking-widest text-white/30">
                <Microscope className="w-4 h-4" />
                Validation Directives
              </div>
              <ul className="space-y-2">
                {directives.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs font-medium text-white/60">
                    <span className="w-1.5 h-1.5 bg-accent mt-1.5 shrink-0" /> {d}
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
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-4 ${themes.bg.replace('/10', '')}`} />
        <span className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40">{themes.label}</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {items.map((item, i) => (
          <div key={i} className={`p-4 bg-muted/50 border-l-4 ${themes.border} group transition-all`}>
             <p className="text-xs font-bold text-foreground/80 leading-relaxed">
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
    <div className="space-y-10 py-10 border-b-2 border-muted last:border-0 last:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-2xl font-black text-foreground tracking-tighter leading-none uppercase">{data.title}</h3>
          <p className="text-sm text-foreground/70 leading-relaxed font-medium">
            {data.insight}
          </p>
        </div>
        
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {items.map((item, i) => (
      <div key={i} className="p-6 bg-muted border-b-4 border-foreground hover:bg-primary hover:text-white transition-all group">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-foreground text-white group-hover:bg-white group-hover:text-primary">
            {item.priority}
          </span>
          <div className="text-xl font-black italic tracking-tighter">{item.relevanceScore}%</div>
        </div>
        <h5 className="text-lg font-extrabold tracking-tight mb-2 leading-none uppercase">{item.feature}</h5>
        <p className="text-[10px] font-medium leading-normal text-foreground/50 group-hover:text-white/80">{item.description}</p>
      </div>
    ))}
  </div>
);

const ReportView: React.FC<{ report: FWAReport }> = ({ report }) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Executive Summary Block */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-foreground p-12 lg:p-16 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 -translate-y-1/2 translate-x-1/4 rotate-12" />
        <div className="relative z-10 space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white text-foreground flex items-center justify-center rounded-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-5xl font-extrabold tracking-tighter leading-none uppercase italic">Strategic Audit.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
             <div className="lg:col-span-8 space-y-8">
                <p className="text-xl lg:text-3xl font-bold leading-tight italic text-primary">
                  "{report.expertSummary}"
                </p>
                <div className="h-1 bg-white/10 w-full" />
                <p className="text-sm text-white/60 leading-relaxed font-medium">
                  {report.executiveSummary}
                </p>
             </div>
             <div className="lg:col-span-4 space-y-6">
                <div className="p-8 bg-white/5 border-l-8 border-primary">
                  <div className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-white/30 mb-4">Market Identity</div>
                  <div className="text-2xl font-black leading-tight tracking-tight uppercase">
                    {report.operatorName} <br/>
                    {report.country}
                  </div>
                </div>
                <div className="p-8 bg-white/5 border-l-8 border-secondary">
                  <div className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-white/30 mb-4">Deployment Confidence</div>
                  <div className="text-5xl font-black leading-none tracking-tighter italic">98.2<span className="text-lg font-normal">%</span></div>
                </div>
             </div>
          </div>
        </div>
      </motion.section>

      {/* Market & Strategy Sections */}
      <SectionWrapper bgColor="bg-white">
        <SectionHeader icon={Target} title="Market Dynamics" />
        <div className="space-y-12">
          {report.painPoints?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
          {report.strategicPositioning?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="bg-muted/30">
        <SectionHeader icon={ShoppingBag} title="Value Propositions" />
        <div className="space-y-12">
          <AnalysisBlock data={report.valueProposition?.consumer} />
          <AnalysisBlock data={report.valueProposition?.enterprise} />
          <AnalysisBlock data={report.valueProposition?.operator} />
        </div>
      </SectionWrapper>

      {/* Spectrum Section - Optimized for Data Density */}
      <SectionWrapper bgColor="bg-white">
        <SectionHeader icon={Radio} title="Spectral Analysis" />
        <div className="space-y-12">
          <p className="text-2xl font-extrabold text-foreground tracking-tight leading-snug max-w-4xl">{report.spectrumAnalysis?.overview}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             <div className="lg:col-span-7 bg-muted p-8 border-b-8 border-primary h-full">
                <SpectrumChart data={report.spectrumAnalysis?.bands || []} />
             </div>
             <div className="lg:col-span-5 space-y-4">
                <h4 className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 mb-4">Spectral Holdings 2024</h4>
                <div className="grid grid-cols-1 gap-2">
                  {report.spectrumAnalysis?.bands?.map((b, i) => (
                    <div key={i} className="p-4 bg-muted flex items-center justify-between border-l-4 border-foreground hover:bg-foreground hover:text-white group transition-all cursor-default">
                      <div className="space-y-1">
                        <div className="text-xl font-black italic leading-none uppercase">{b.band}</div>
                        <div className="text-[9px] font-mono font-black uppercase tracking-widest text-foreground/30 group-hover:text-white/40">{b.technology}</div>
                      </div>
                      <div className="text-[10px] font-black uppercase bg-primary text-white px-2 py-1 rounded-sm">{b.status}</div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          <AnalysisBlock data={report.spectrumAnalysis?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* Infrastructure Section */}
      <SectionWrapper bgColor="bg-muted/30">
        <SectionHeader icon={Cpu} title="Technical Infrastructure" />
        <div className="space-y-12">
          <FeatureGrid items={report.technicalCapabilities?.items || []} />
          <AnalysisBlock data={report.technicalCapabilities?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* ROI Modeling Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-primary text-white p-12 lg:p-20 relative overflow-hidden"
      >
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-foreground/10 -translate-x-1/4 translate-y-1/2 rotate-45" />
         <div className="relative z-10 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8 space-y-8">
                 <div className="w-16 h-16 bg-white text-primary flex items-center justify-center">
                   <TrendingUp className="w-8 h-8" />
                 </div>
                 <h2 className="text-6xl font-extrabold tracking-tighter leading-none uppercase italic">ROI Modeling.</h2>
                 <p className="text-xl lg:text-2xl font-bold leading-tight text-white/90 max-w-3xl">
                   {report.roiAnalysis?.summary}
                 </p>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-6">
                    {report.roiAnalysis?.assumptions?.map((a, i) => (
                      <div key={i} className="p-3 bg-foreground/40 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-white/10 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-secondary" /> {a}
                      </div>
                    ))}
                 </div>
              </div>
              <div className="lg:col-span-4">
                 <div className="p-10 bg-foreground text-white border-l-[12px] border-white/20 space-y-6">
                    <div className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white/30">Strategic Yield Logic</div>
                    <p className="text-lg font-bold leading-relaxed italic">
                      {report.roiAnalysis?.roiCalculatorLogic}
                    </p>
                 </div>
              </div>
            </div>
            <div className="bg-white p-10 text-foreground">
              <AnalysisBlock data={report.roiAnalysis?.detailedAnalysis} />
            </div>
         </div>
      </motion.section>

      {/* Grounding & Footnotes */}
      {report.groundingChunks && (
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-foreground text-white p-12 lg:p-16"
        >
          <div className="space-y-12">
            <div className="flex flex-col gap-4">
               <div className="h-2 bg-primary w-20" />
               <h4 className="text-3xl font-extrabold uppercase tracking-tighter italic">Source Verification</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {report.groundingChunks.filter((c: any) => c.web).map((source: any, idx: number) => (
                <a 
                  key={idx} href={source.web.uri} target="_blank" rel="noopener noreferrer"
                  className="group bg-white/5 p-6 hover:bg-primary transition-all duration-300 border-l-[4px] border-primary hover:border-white"
                >
                  <div className="w-10 h-10 bg-white text-foreground flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-black leading-tight line-clamp-2 uppercase tracking-tight">{source.web.title}</div>
                    <div className="flex items-center justify-between pt-2 opacity-30 group-hover:opacity-100">
                      <span className="text-[9px] font-mono font-black uppercase tracking-widest truncate max-w-[150px]">{new URL(source.web.uri).hostname}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReportView;
