
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FWAReport, StrategicAnalysis, TechnicalFeature } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  Target, Radio, Cpu, ShoppingBag, TrendingUp, Globe, ArrowUpRight, ShieldAlert, Microscope, Activity, Zap, BarChart, Flag
} from 'lucide-react';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  }
};

const SectionWrapper: React.FC<{ id?: string; children: React.ReactNode; bgColor?: string }> = ({ id, children, bgColor = "bg-white" }) => (
  <motion.section 
    id={id}
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    className={`${bgColor} p-6 lg:p-12 mb-8 border-b border-foreground/5 last:border-0 scroll-mt-6`}
  >
    {children}
  </motion.section>
);

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-start gap-4 mb-8 border-l-[6px] border-primary pl-4">
    <div className="w-10 h-10 bg-foreground flex items-center justify-center text-white shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div className="space-y-0.5">
      <h2 className="text-3xl font-serif tracking-tighter text-foreground leading-none">{title}</h2>
      <span className="text-[8px] font-mono font-bold uppercase tracking-[0.4em] text-foreground/30">TECHNICAL_GROUNDING_PROTOCOL</span>
    </div>
  </div>
);

const ExpertCallout: React.FC<{ critique?: string; directives?: string[] }> = ({ critique, directives }) => {
  if (!critique && (!directives || directives.length === 0)) return null;

  return (
    <div className="mt-8 p-8 bg-foreground text-white border-l-[8px] border-accent relative overflow-hidden">
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="px-2 py-0.5 bg-accent text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-sm">AUDIT_CRITIQUE</div>
        </div>
        
        {critique && (
          <p className="text-lg leading-[1.4] font-serif italic text-white/90 max-w-3xl">
            "{critique}"
          </p>
        )}

        {directives && directives.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/40">
                <Microscope className="w-3.5 h-3.5" />
                Validation Matrix
              </div>
              <ul className="space-y-2">
                {directives.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs font-medium text-white/70 leading-relaxed">
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
    strength: { bg: 'bg-secondary/10', label: 'Market Drivers', border: 'border-secondary' },
    challenge: { bg: 'bg-accent/10', label: 'Operational Risks', border: 'border-accent' },
    recommendation: { bg: 'bg-primary/10', label: 'Strategic Directives', border: 'border-primary' },
  }[type];

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-3 ${themes.bg.replace('/10', '')}`} />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/40">{themes.label}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className={`p-4 bg-muted/40 border-l-[3px] ${themes.border} hover:bg-white hover:shadow-sm transition-all duration-300`}>
             <p className="text-[12px] font-semibold text-foreground/80 leading-snug">
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
    <div className="space-y-8 py-8 border-b border-foreground/5 last:border-0 last:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-2xl font-serif text-foreground leading-tight">{data.title}</h3>
          <p className="text-[14px] text-foreground/70 leading-relaxed font-medium tracking-tight">
            {data.insight}
          </p>
        </div>
        
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {items.map((item, i) => (
      <div key={i} className="p-6 bg-muted/50 border-t-2 border-foreground hover:bg-foreground hover:text-white transition-all group flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-primary text-white">
              {item.priority}
            </span>
            <div className="text-xl font-serif italic tracking-tighter">{item.relevanceScore}%</div>
          </div>
          <h5 className="text-lg font-serif leading-none">{item.feature}</h5>
          <p className="text-[10px] font-medium leading-relaxed text-foreground/50 group-hover:text-white/70">{item.description}</p>
        </div>
      </div>
    ))}
  </div>
);

const ReportView: React.FC<{ report: FWAReport }> = ({ report }) => {
  return (
    <div className="space-y-8">
      
      {/* Executive Summary Block */}
      <motion.section 
        id="summary"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-foreground p-8 lg:p-12 text-white relative overflow-hidden scroll-mt-6"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 -translate-y-1/2 translate-x-1/4 rotate-12 blur-[80px]" />
        <div className="relative z-10 space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white text-foreground flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-4xl font-serif tracking-tighter leading-none italic">Strategic Audit.</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-12 border-b border-white/10">
             <div className="lg:col-span-12 space-y-6">
                <p className="text-xl lg:text-3xl font-serif leading-snug italic text-primary">
                  "{report.expertSummary}"
                </p>
                <div className="h-[1px] bg-white/10 w-full" />
                <p className="text-sm text-white/80 leading-relaxed font-medium tracking-tight">
                  {report.executiveSummary}
                </p>
             </div>
          </div>

          {/* New Strategic KPI Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
             <div className="p-6 bg-white/5 border-l-4 border-primary space-y-3">
               <div className="flex items-center gap-2">
                 <Zap className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">FWA潜力</span>
               </div>
               <p className="text-[13px] font-medium leading-relaxed text-white/90">
                 {report.fwaPotential}
               </p>
             </div>
             
             <div className="p-6 bg-white/5 border-l-4 border-secondary space-y-3">
               <div className="flex items-center gap-2">
                 <BarChart className="w-4 h-4 text-secondary" />
                 <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">当前评价</span>
               </div>
               <p className="text-[13px] font-medium leading-relaxed text-white/90">
                 {report.currentAssessment}
               </p>
             </div>

             <div className="p-6 bg-white/5 border-l-4 border-accent space-y-3">
               <div className="flex items-center gap-2">
                 <Flag className="w-4 h-4 text-accent" />
                 <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">未来重点</span>
               </div>
               <p className="text-[13px] font-medium leading-relaxed text-white/90">
                 {report.futurePriorities}
               </p>
             </div>
          </div>
        </div>
      </motion.section>

      {/* Main Analysis Sections */}
      <SectionWrapper id="dynamics" bgColor="bg-white">
        <SectionHeader icon={Target} title="Market Dynamics" />
        <div className="space-y-8">
          {report.painPoints?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
          {report.strategicPositioning?.map((item, idx) => <AnalysisBlock key={idx} data={item} />)}
        </div>
      </SectionWrapper>

      <SectionWrapper id="propositions" bgColor="bg-muted/10">
        <SectionHeader icon={ShoppingBag} title="Value Propositions" />
        <div className="space-y-10">
          <AnalysisBlock data={report.valueProposition?.consumer} />
          <AnalysisBlock data={report.valueProposition?.enterprise} />
          <AnalysisBlock data={report.valueProposition?.operator} />
        </div>
      </SectionWrapper>

      {/* Spectrum Modeling */}
      <SectionWrapper id="spectrum" bgColor="bg-white">
        <SectionHeader icon={Radio} title="Spectral Footprint" />
        <div className="space-y-10">
          <p className="text-2xl font-serif text-foreground leading-tight max-w-3xl">{report.spectrumAnalysis?.overview}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
             <div className="lg:col-span-7 bg-muted/30 p-8 border-b-[6px] border-primary">
                <SpectrumChart data={report.spectrumAnalysis?.bands || []} />
             </div>
             <div className="lg:col-span-5 flex flex-col gap-4">
                <h4 className="font-mono text-[9px] font-bold uppercase tracking-[0.4em] text-foreground/40">REGISTRY_OUTPUT_2024</h4>
                <div className="flex flex-col gap-2">
                  {report.spectrumAnalysis?.bands?.map((b, i) => (
                    <div key={i} className="p-4 bg-muted flex items-center justify-between border-l-[3px] border-foreground group transition-all duration-300 hover:bg-foreground hover:text-white">
                      <div className="space-y-0.5">
                        <div className="text-xl font-serif leading-none italic">{b.band}</div>
                        <div className="text-[9px] font-mono font-bold uppercase tracking-[0.1em] text-foreground/40 group-hover:text-white/40">{b.technology}</div>
                      </div>
                      <div className="text-[9px] font-bold uppercase bg-primary text-white px-2 py-0.5 rounded-sm">{b.status}</div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          <AnalysisBlock data={report.spectrumAnalysis?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* Infrastructure Evolution */}
      <SectionWrapper id="technical" bgColor="bg-muted/10">
        <SectionHeader icon={Cpu} title="Technical Stack" />
        <div className="space-y-10">
          <FeatureGrid items={report.technicalCapabilities?.items || []} />
          <AnalysisBlock data={report.technicalCapabilities?.detailedAnalysis} />
        </div>
      </SectionWrapper>

      {/* Financial Modeling - ROI */}
      <SectionWrapper id="roi" bgColor="bg-primary">
         <div className="text-white space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-6">
                 <div className="w-12 h-12 bg-white text-primary flex items-center justify-center">
                   <TrendingUp className="w-6 h-6" />
                 </div>
                 <h2 className="text-4xl lg:text-5xl font-serif tracking-tighter leading-none italic">ROI Modeling.</h2>
                 <p className="text-xl lg:text-2xl font-serif leading-snug text-white/90 max-w-2xl">
                   {report.roiAnalysis?.summary}
                 </p>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
                    {report.roiAnalysis?.assumptions?.map((a, i) => (
                      <div key={i} className="p-3 bg-white/10 text-[9px] font-bold uppercase tracking-[0.1em] border border-white/10 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-secondary shrink-0" /> {a}
                      </div>
                    ))}
                 </div>
              </div>
              <div className="lg:col-span-4">
                 <div className="p-8 bg-foreground text-white border-l-[8px] border-white/20 space-y-4">
                    <div className="text-[8px] font-mono font-bold uppercase tracking-[0.3em] text-white/30">YIELD_LOGIC_MATRIX</div>
                    <p className="text-lg font-serif italic leading-relaxed text-white/90">
                      {report.roiAnalysis?.roiCalculatorLogic}
                    </p>
                 </div>
              </div>
            </div>
            <div className="bg-white p-8 text-foreground">
              <AnalysisBlock data={report.roiAnalysis?.detailedAnalysis} />
            </div>
         </div>
      </SectionWrapper>

      {/* Source Grounding */}
      {report.groundingChunks && (
        <div id="sources" className="bg-foreground text-white p-8 lg:p-12 scroll-mt-6">
          <div className="space-y-10">
            <div className="flex flex-col gap-3">
               <div className="h-0.5 bg-primary w-12" />
               <h4 className="text-3xl font-serif italic tracking-tighter">Source Grounding</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {report.groundingChunks.filter((c: any) => c.web).map((source: any, idx: number) => (
                <a 
                  key={idx} href={source.web.uri} target="_blank" rel="noopener noreferrer"
                  className="group bg-white/5 p-6 hover:bg-primary transition-all duration-300 border-l-[4px] border-primary hover:border-white"
                >
                  <div className="w-8 h-8 bg-white text-foreground flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm font-serif leading-tight line-clamp-2">{source.web.title}</div>
                    <div className="flex items-center justify-between pt-3 opacity-40 group-hover:opacity-100">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest truncate max-w-[120px]">{new URL(source.web.uri).hostname}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
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