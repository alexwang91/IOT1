
import React from 'react';
import { FWAReport, StrategicAnalysis } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  AlertTriangle, Crosshair, Target, Radio, Cpu, Network, 
  ShoppingBag, TrendingUp, Settings, CheckCircle2, Lightbulb,
  Globe, Search
} from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isInset?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = "", isInset = false }) => (
  <div className={`bg-clay rounded-[32px] p-8 ${isInset ? 'neumorphic-inset' : 'neumorphic-extruded'} ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="p-4 bg-clay rounded-2xl neumorphic-inset text-accent">
      <Icon className="w-6 h-6" />
    </div>
    <h2 className="text-2xl font-extrabold text-clay-dark font-display tracking-tight">{title}</h2>
  </div>
);

const AnalysisList = ({ items, type }: { items: string[], type: 'strength' | 'challenge' | 'recommendation' }) => {
  const config = {
    strength: { 
      bg: 'bg-emerald-50/10', 
      text: 'text-emerald-800', 
      icon: CheckCircle2, 
      iconColor: 'text-emerald-500',
      label: 'Strengths'
    },
    challenge: { 
      bg: 'bg-rose-50/10', 
      text: 'text-rose-800', 
      icon: AlertTriangle, 
      iconColor: 'text-rose-500',
      label: 'Challenges' 
    },
    recommendation: { 
      bg: 'bg-accent/5', 
      text: 'text-clay-dark', 
      icon: Lightbulb, 
      iconColor: 'text-accent',
      label: 'Advice' 
    },
  }[type];

  const Icon = config.icon;

  if (!items || items.length === 0) return null;

  return (
    <div className={`p-6 rounded-[24px] neumorphic-inset h-full bg-clay`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-4 h-4 ${config.iconColor}`} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-clay-muted">{config.label}</span>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className={`text-sm ${config.text} flex items-start gap-3 leading-relaxed`}>
            <div className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${config.iconColor} bg-current opacity-40`} />
            <span className="font-medium">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AnalysisBlock: React.FC<{ data: StrategicAnalysis }> = ({ data }) => {
  if (!data) return null;
  return (
    <div className="mb-12 last:mb-0">
      <h3 className="text-lg font-bold text-clay-dark mb-4 pl-1">{data.title}</h3>
      <div className="p-6 rounded-2xl neumorphic-inset-deep bg-clay/50 mb-8">
        <p className="text-clay-dark/80 leading-8 text-base font-medium italic">
          "{data.insight}"
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalysisList items={data.strengths} type="strength" />
        <AnalysisList items={data.challenges} type="challenge" />
        <AnalysisList items={data.recommendations} type="recommendation" />
      </div>
    </div>
  );
};

// Component to render source URLs from grounding metadata.
const GroundingSources = ({ chunks }: { chunks?: any[] }) => {
  if (!chunks || chunks.length === 0) return null;
  
  const sources = chunks
    .filter(chunk => chunk.web)
    .map(chunk => chunk.web);

  if (sources.length === 0) return null;

  return (
    <div className="mt-8 p-8 rounded-[32px] neumorphic-inset bg-clay/20 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent/10 rounded-lg text-accent">
          <Search className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-clay-muted">Data Sources & Citations</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source, idx) => (
          <a 
            key={idx} 
            href={source.uri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-clay neumorphic-extruded hover:text-accent transition-all group overflow-hidden"
          >
            <div className="shrink-0 w-8 h-8 rounded-lg bg-clay neumorphic-inset flex items-center justify-center text-clay-muted group-hover:text-accent">
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-clay-dark truncate">{source.title || source.uri}</div>
              <div className="text-[9px] text-clay-muted truncate">{source.uri}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

interface ReportViewProps {
  report: FWAReport;
}

const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  return (
    <div className="flex flex-col gap-10 pb-24">
      
      {/* 1. Pain Points */}
      <Card>
        <SectionHeader icon={AlertTriangle} title="1. Pain Points & Market Challenges" />
        <div className="space-y-12">
          {report.painPoints?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </Card>

      {/* 2. Strategic Positioning */}
      <Card>
        <SectionHeader icon={Crosshair} title="2. FWA Strategic Positioning" />
        <div className="space-y-12">
          {report.strategicPositioning?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </Card>

      {/* 3. Value Proposition */}
      <Card>
        <SectionHeader icon={Target} title="3. Value Proposition Analysis" />
        <div className="space-y-16">
           {report.valueProposition?.consumer && <AnalysisBlock data={report.valueProposition.consumer} />}
           <div className="h-px w-full neumorphic-inset" />
           {report.valueProposition?.enterprise && <AnalysisBlock data={report.valueProposition.enterprise} />}
           <div className="h-px w-full neumorphic-inset" />
           {report.valueProposition?.operator && <AnalysisBlock data={report.valueProposition.operator} />}
        </div>
      </Card>

      {/* 4. Spectrum Analysis */}
      <Card>
        <SectionHeader icon={Radio} title="4. Spectrum Landscape & Strategy" />
        <div className="mb-10">
          <p className="text-clay-muted text-lg mb-8 font-medium italic border-l-4 border-accent pl-6">{report.spectrumAnalysis?.overview}</p>
          <div className="p-8 rounded-[32px] neumorphic-inset bg-clay/30 mb-8">
            {report.spectrumAnalysis?.bands && <SpectrumChart data={report.spectrumAnalysis.bands} />}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
             {report.spectrumAnalysis?.bands?.map((b, i) => (
               <div key={i} className="p-5 rounded-2xl bg-clay neumorphic-extruded">
                 <span className="font-extrabold block text-clay-dark text-lg mb-1">{b.band}</span>
                 <span className="text-xs text-clay-muted font-bold block mb-3">{b.technology}</span>
                 <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg text-center ${
                   b.status.toLowerCase().includes('allocated') 
                    ? 'bg-emerald-500/10 text-emerald-600 neumorphic-inset' 
                    : 'bg-amber-500/10 text-amber-600 neumorphic-inset'
                 }`}>
                    {b.status}
                 </div>
               </div>
             ))}
          </div>
        </div>
        <div className="mt-12 pt-10 border-t-2 border-clay/50">
          <AnalysisBlock data={report.spectrumAnalysis?.detailedAnalysis} />
        </div>
      </Card>

      {/* 5. Technical Capabilities */}
      <Card>
        <SectionHeader icon={Cpu} title="5. Key Technology Capabilities" />
        <div className="grid lg:grid-cols-12 gap-12">
           <div className="lg:col-span-4 space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              <h4 className="text-sm font-black text-clay-muted uppercase tracking-widest mb-4">Priority Matrix</h4>
              {report.technicalCapabilities?.items?.map((tech, idx) => (
                <div key={idx} className="p-5 rounded-2xl neumorphic-inset bg-clay/40 transition-all hover:scale-[1.02]">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-clay-dark leading-tight">{tech.feature}</span>
                    <span className={`text-[9px] font-black tracking-tighter px-2 py-1 rounded-full ${
                      tech.priority === 'High' ? 'bg-rose-500 text-white' : 
                      tech.priority === 'Medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {tech.priority}
                    </span>
                  </div>
                  <p className="text-xs text-clay-muted leading-relaxed font-medium">{tech.description}</p>
                </div>
              ))}
           </div>
           <div className="lg:col-span-8">
              <AnalysisBlock data={report.technicalCapabilities?.detailedAnalysis} />
           </div>
        </div>
      </Card>

      {/* 6. Network Planning */}
      <Card>
        <SectionHeader icon={Network} title="6. Network Planning & Optimization" />
        <div className="space-y-12">
          {report.networkPlanning?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </Card>

      {/* 7. Commercial Strategy */}
      <Card>
        <SectionHeader icon={ShoppingBag} title="7. Commercial Strategy & Go-to-Market" />
        <div className="space-y-12">
           {report.commercialStrategy?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </Card>

      {/* 8. ROI Analysis */}
      <Card className="bg-gradient-to-br from-clay to-accent/5">
        <SectionHeader icon={TrendingUp} title="8. ROI & Financial Viability" />
        <div className="mb-12 grid md:grid-cols-12 gap-8 p-10 rounded-[32px] neumorphic-inset bg-clay/50">
            <div className="md:col-span-8">
              <h4 className="font-bold text-clay-dark text-xl mb-4">Strategic Forecast</h4>
              <p className="text-clay-muted font-medium leading-loose text-lg mb-6 italic">
                {report.roiAnalysis?.summary}
              </p>
              <div className="flex gap-3 flex-wrap">
                {report.roiAnalysis?.assumptions?.map((a, i) => (
                  <span key={i} className="text-xs font-bold px-4 py-2 bg-clay text-clay-muted rounded-xl neumorphic-extruded border border-white/20">
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col gap-6 justify-center">
                 <div className="text-center p-6 bg-clay rounded-2xl neumorphic-extruded border border-emerald-500/20">
                   <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1">Forecasted NPV</div>
                   <div className="text-3xl font-extrabold text-emerald-700">HIGH</div>
                 </div>
                 <div className="text-center p-6 bg-clay rounded-2xl neumorphic-extruded border border-accent/20">
                   <div className="text-[10px] text-accent font-black uppercase tracking-widest mb-1">Exp. IRR Target</div>
                   <div className="text-3xl font-extrabold text-accent">20%+</div>
                 </div>
            </div>
        </div>
        <AnalysisBlock data={report.roiAnalysis?.detailedAnalysis} />
      </Card>

      {/* 9. Operations */}
      <Card>
        <SectionHeader icon={Settings} title="9. Operations & Lifecycle Management" />
         <div className="space-y-12">
          {report.operations?.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </Card>

      {/* Listing source URLs as required by Google Search grounding guidelines */}
      {report.groundingChunks && <GroundingSources chunks={report.groundingChunks} />}

    </div>
  );
};

export default ReportView;
