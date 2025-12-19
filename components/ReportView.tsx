
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
    className={`${bgColor} p-8 lg:p-20 mb-12 border-b-2 border-foreground/10 last:border-0`}
  >
    {children}
  </motion.section>
);

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-start gap-8 mb-12 border-l-[10px] border-primary pl-8">
    <div className="w-14 h-14 bg-foreground flex items-center justify-center text-white shrink-0 rounded-none">
      <Icon className="w-7 h-7" />
    </div>
    <div className="space-y-1">
      <h2 className="text-5xl font-serif tracking-tighter text-foreground leading-none">{title}</h2>
      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-foreground/30">TECHNICAL_GROUNDING_PROTOCOL</span>
    </div>
  </div>
);

const ExpertCallout: React.FC<{ critique?: string; directives?: string[] }> = ({ critique, directives }) => {
  if (!critique && (!directives || directives.length === 0)) return null;

  return (
    <div className="mt-10 p-10 bg-foreground text-white border-l-[12px] border-accent relative overflow-hidden">
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-accent text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-sm">AUDIT_CRITIQUE</div>
        </div>
        
        {critique && (
          <p className="text-xl leading-[1.3] font-serif italic text-white/90 max-w-4xl">
            "{critique}"
          </p>
        )}

        {directives && directives.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-white/10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white/40">
                <Microscope className="w-4 h-4" />
                Validation Matrix
              </div>
              <ul className="space-y-3">
                {directives.map((d, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm font-medium text-white/70 leading-relaxed">
                    <span className="w-2 h-2 bg-accent mt-2 shrink-0" /> {d}
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
    strength: { color: 'text-secondary', bg: 'bg-secondary/10', label: 'Market Drivers', border: 'border-secondary' },
    challenge: { color: 'text-accent', bg: 'bg-accent/10', label: 'Operational Risks', border: 'border-accent' },
    recommendation: { color: 'text-primary', bg: 'bg-primary/10', label: 'Strategic Directives', border: 'border-primary' },
  }[type];

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-4 ${themes.bg.replace('/10', '')}`} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">{themes.label}</span>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className={`p-5 bg-muted/40 border-l-4 ${themes.border} hover:bg-white hover:shadow-sm transition-all duration-300`}>
             <p className="text-[13px] font-semibold text-foreground/80 leading-snug">
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
    <div className="space-y-12 py-12 border-b border-foreground/5 last:border-0 last:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-3xl font-serif text-foreground leading-tight">{data.title}</h3>
          <p className="text-[15px] text-foreground/70 leading-relaxed font-medium tracking-tight">
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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {items.map((item, i) => (
      <div key={i} className="p-8 bg-muted/50 border-t-4 border-foreground hover:bg-foreground hover:text-white transition-all group flex flex-col justify-between h-full">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-primary text-white">
              {item.priority}
            </span>
            <div className="text-2xl font-serif italic tracking-tighter">{item.relevanceScore}%</div>
          </div>
          <h5 className="text-xl font-serif leading-none">{item.feature}</h5>
          <p className="text-[11px] font-medium leading-relaxed text-foreground/50 group-hover:text-white/70">{item.description}</p>
        </div>
      </div>
    ))}
  </div>
);

const ReportView: React.FC<{ report: FWAReport }> = ({ report }) => {
  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24">
      
      {/* Executive Summary Block - Optimized Typography */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-foreground p-12 lg:p-20 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 -translate-y-1/2 translate-x-1/4 rotate-12 blur-[100px]" />
        <div className="relative z-10 space-y-16">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white text-foreground flex items-center justify-center">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-6xl font-serif tracking-tighter leading-none italic">Strategic Audit.</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
             <div className="lg:col-span-8 space-y-10">
                <p className="text-2xl lg:text-4xl font-serif leading-snug italic text-primary">
                  "{report.expertSummary}"
                </p>
                <div className="h-0.5 bg-white/10 w-full" />
                <p className="text-base text-white/80 leading-relaxed font-medium tracking-tight">
                  {report.executiveSummary}
                </p>
             </div>
             
             <div className="lg:col-span-4 space-y-8">
                <div className="p-8 bg-white/5 border-l-8 border-primary">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-white/30 mb-4">ENTITY_METRICS</div>
                  <div className="text-3xl font-serif leading-tight tracking-tight">
                    {report.operatorName} <br/>
                    <span className="text-white/50">{report.country}</span>
                  </div>
                </div>
                <div className="p-8 bg-white/5 border-l-8 border-secondary">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-white/30 mb-4">DEPLOYMENT_VIABILITY</div>
                  <div className="text-6xl font-serif leading-none tracking-tighter italic text-secondary">98.2<span className="text-xl font-sans not-italic font-bold ml-1">%</span></div>
                </div>
             </div>
          </div>
        </div>
      </motion.section>

      {/* Main Analysis Sections */}
      <SectionWrapper bgColor="bg-white">
        <SectionHeader icon={Target} title="Market Dynamics" />
        <div className="space-y-12">
          {report.painPoints?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
          {report.strategicPositioning?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
        </div>
      </SectionWrapper>

      <SectionWrapper bgColor="bg-muted/30">
        <SectionHeader icon={ShoppingBag} title="Value Propositions" />
        <div className="space-y-16">
          <AnalysisBlock data={report.valueProposition?.consumer} />
          <AnalysisBlock data={report.valueProposition?.enterprise} />
          <AnalysisBlock data={report.valueProposition?.operator} />
        </div>
      </SectionWrapper>

      {/* Spectrum Modeling */}
      <SectionWrapper bgColor="bg-white">
        <SectionHeader icon={Radio} title="Spectral Footprint" />
        <div className="space-y-16">
          <p className="text-3xl font-serif text-foreground leading-tight max-w-4xl">{report.spectrumAnalysis?.overview}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
             <div className="lg:col-span-7 bg-muted/50 p-10 border-b-[10px] border-primary">
                <SpectrumChart data={report.spectrumAnalysis?.bands || []} />
             </div>
             <div className="lg:col-span-5 flex flex-col gap-6">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/40">REGISTRY_OUTPUT_2024</h4>
                <div className="flex flex-col gap-3">
                  {report.spectrumAnalysis?.bands?.map((b, i) => (
                    <div key={i} className="p-5 bg-muted flex items-center justify-between border-l-4 border-foreground group transition-all duration-300 hover:bg-foreground hover:text-white">
                      <div className="space-y-1">
                        <div className="text-2xl font-serif leading-none italic">{b.band}</div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-foreground/40 group-hover:text-white/40">{b.technology}</div>
                      </div>
                      <div className="text-[10px] font-bold uppercase bg-primary text-white px-3 py-1 rounded-sm">{b.status}</div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          <AnalysisBlock data={report.spectrumAnalysis?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* Infrastructure Evolution */}
      <SectionWrapper bgColor="bg-muted/30">
        <SectionHeader icon={Cpu} title="Technical Stack" />
        <div className="space-y-16">
          <FeatureGrid items={report.technicalCapabilities?.items || []} />
          <AnalysisBlock data={report.technicalCapabilities?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* Financial Modeling - ROI */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-primary text-white p-12 lg:p-24 relative overflow-hidden"
      >
         <div className="absolute inset-0 bg-foreground/5 opacity-50" />
         <div className="relative z-10 space-y-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-8 space-y-10">
                 <div className="w-16 h-16 bg-white text-primary flex items-center justify-center">
                   <TrendingUp className="w-8 h-8" />
                 </div>
                 <h2 className="text-7xl font-serif tracking-tighter leading-none italic">ROI Modeling.</h2>
                 <p className="text-2xl lg:text-3xl font-serif leading-snug text-white/90 max-w-3xl">
                   {report.roiAnalysis?.summary}
                 </p>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
                    {report.roiAnalysis?.assumptions?.map((a, i) => (
                      <div key={i} className="p-4 bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10 flex items-center gap-3">
                        <Activity className="w-4 h-4 text-secondary shrink-0" /> {a}
                      </div>
                    ))}
                 </div>
              </div>
              <div className="lg:col-span-4">
                 <div className="p-10 bg-foreground text-white border-l-[12px] border-white/20 space-y-6">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-white/30">YIELD_LOGIC_MATRIX</div>
                    <p className="text-xl font-serif italic leading-relaxed text-white/90">
                      {report.roiAnalysis?.roiCalculatorLogic}
                    </p>
                 </div>
              </div>
            </div>
            <div className="bg-white p-12 text-foreground">
              <AnalysisBlock data={report.roiAnalysis?.detailedAnalysis} />
            </div>
         </div>
      </motion.section>

      {/* Source Grounding */}
      {report.groundingChunks && (
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-foreground text-white p-12 lg:p-20"
        >
          <div className="space-y-16">
            <div className="flex flex-col gap-5">
               <div className="h-1 bg-primary w-24" />
               <h4 className="text-4xl font-serif italic tracking-tighter">Source Grounding</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {report.groundingChunks.filter((c: any) => c.web).map((source: any, idx: number) => (
                <a 
                  key={idx} href={source.web.uri} target="_blank" rel="noopener noreferrer"
                  className="group bg-white/5 p-8 hover:bg-primary transition-all duration-300 border-l-[6px] border-primary hover:border-white"
                >
                  <div className="w-10 h-10 bg-white text-foreground flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="space-y-4">
                    <div className="text-base font-serif leading-tight line-clamp-2">{source.web.title}</div>
                    <div className="flex items-center justify-between pt-4 opacity-40 group-hover:opacity-100">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest truncate max-w-[140px]">{new URL(source.web.uri).hostname}</span>
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
