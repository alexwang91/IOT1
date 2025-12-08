import React from 'react';
import { FWAReport, StrategicAnalysis } from '../types';
import SpectrumChart from './SpectrumChart';
import { 
  AlertTriangle, Crosshair, Target, Radio, Cpu, Network, 
  ShoppingBag, TrendingUp, Settings, CheckCircle2, Lightbulb 
} from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-200">
    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
      <Icon className="w-5 h-5" />
    </div>
    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
  </div>
);

// New component to render list items for SWOT analysis
const AnalysisList = ({ items, type }: { items: string[], type: 'strength' | 'challenge' | 'recommendation' }) => {
  const config = {
    strength: { 
      bg: 'bg-green-50/50', 
      border: 'border-green-100', 
      text: 'text-green-900', 
      icon: CheckCircle2, 
      iconColor: 'text-green-600',
      label: 'Key Strengths'
    },
    challenge: { 
      bg: 'bg-red-50/50', 
      border: 'border-red-100', 
      text: 'text-red-900', 
      icon: AlertTriangle, 
      iconColor: 'text-red-500',
      label: 'Challenges & Risks' 
    },
    recommendation: { 
      bg: 'bg-blue-50/50', 
      border: 'border-blue-100', 
      text: 'text-blue-900', 
      icon: Lightbulb, 
      iconColor: 'text-blue-600',
      label: 'Strategic Advice' 
    },
  }[type];

  const Icon = config.icon;

  if (!items || items.length === 0) return null;

  return (
    <div className={`p-4 rounded-xl border ${config.bg} ${config.border} h-full transition-all hover:shadow-sm`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${config.iconColor}`} />
        <span className={`text-xs font-bold uppercase tracking-wider ${config.text} opacity-80`}>{config.label}</span>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className={`text-sm ${config.text} flex items-start gap-2 leading-relaxed`}>
            <span className={`mt-1.5 w-1 h-1 rounded-full bg-current opacity-40 shrink-0`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Component to render a full Strategic Analysis block
const AnalysisBlock: React.FC<{ data: StrategicAnalysis }> = ({ data }) => (
  <div className="mb-10 last:mb-0">
    <h3 className="text-lg font-bold text-slate-900 mb-3">{data.title}</h3>
    <p className="text-slate-600 mb-5 leading-7 text-sm md:text-base border-l-4 border-slate-200 pl-4">{data.insight}</p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AnalysisList items={data.strengths} type="strength" />
      <AnalysisList items={data.challenges} type="challenge" />
      <AnalysisList items={data.recommendations} type="recommendation" />
    </div>
  </div>
);

interface ReportViewProps {
  report: FWAReport;
}

const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 pb-20">
      
      {/* 1. Pain Points */}
      <Card className="lg:col-span-12">
        <SectionHeader icon={AlertTriangle} title="1. Pain Points & Market Challenges" />
        <div className="space-y-6">
          {report.painPoints.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </Card>

      {/* 2. Strategic Positioning */}
      <Card className="lg:col-span-12">
        <SectionHeader icon={Crosshair} title="2. FWA Strategic Positioning" />
        <div className="space-y-6">
          {report.strategicPositioning.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </Card>

      {/* 3. Value Proposition */}
      <Card className="lg:col-span-12">
        <SectionHeader icon={Target} title="3. Value Proposition Analysis" />
        <div className="space-y-8">
           <AnalysisBlock data={report.valueProposition.consumer} />
           <hr className="border-slate-100" />
           <AnalysisBlock data={report.valueProposition.enterprise} />
           <hr className="border-slate-100" />
           <AnalysisBlock data={report.valueProposition.operator} />
        </div>
      </Card>

      {/* 4. Spectrum Analysis */}
      <Card className="lg:col-span-12">
        <SectionHeader icon={Radio} title="4. Spectrum Landscape & Strategy" />
        <div className="mb-8">
          <p className="text-slate-600 mb-6">{report.spectrumAnalysis.overview}</p>
          <SpectrumChart data={report.spectrumAnalysis.bands} />
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
             {report.spectrumAnalysis.bands.map((b, i) => (
               <div key={i} className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                 <span className="font-bold block text-slate-800 text-sm mb-1">{b.band}</span>
                 <div className="flex justify-between text-slate-500 mb-1">
                    <span>Tech: {b.technology}</span>
                 </div>
                 <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                   b.status.includes('Allocated') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                 }`}>
                    {b.status}
                 </span>
               </div>
             ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100">
          <AnalysisBlock data={report.spectrumAnalysis.detailedAnalysis} />
        </div>
      </Card>

      {/* 5. Technical Capabilities */}
      <Card className="lg:col-span-12">
        <SectionHeader icon={Cpu} title="5. Key Technology Capabilities" />
        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <h4 className="font-bold text-slate-700 mb-2">Priority Features</h4>
              {report.technicalCapabilities.items.map((tech, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors bg-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-800 text-sm">{tech.feature}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                      tech.priority === 'High' ? 'bg-red-100 text-red-700' : 
                      tech.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {tech.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{tech.description}</p>
                </div>
              ))}
           </div>
           <div className="lg:col-span-2">
              <AnalysisBlock data={report.technicalCapabilities.detailedAnalysis} />
           </div>
        </div>
      </Card>

      {/* 6. Network Planning */}
      <Card className="lg:col-span-12">
        <SectionHeader icon={Network} title="6. Network Planning & Optimization" />
        <div className="space-y-6">
          {report.networkPlanning.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </Card>

      {/* 7. Commercial Strategy */}
      <Card className="lg:col-span-12">
        <SectionHeader icon={ShoppingBag} title="7. Commercial Strategy & Go-to-Market" />
        <div className="space-y-6">
           {report.commercialStrategy.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </Card>

      {/* 8. ROI Analysis */}
      <Card className="lg:col-span-12 bg-gradient-to-b from-blue-50/50 to-white">
        <SectionHeader icon={TrendingUp} title="8. Dynamic ROI & Financial Model" />
        <div className="mb-8 p-6 bg-white rounded-xl border border-blue-100 shadow-sm">
           <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 mb-2">Executive Summary</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{report.roiAnalysis.summary}</p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {report.roiAnalysis.assumptions.slice(0, 4).map((a, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded border border-slate-200">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-center p-4 bg-green-50 rounded-lg min-w-[100px]">
                   <div className="text-xs text-green-600 font-bold uppercase">Exp. NPV</div>
                   <div className="text-xl font-bold text-green-700">High</div>
                 </div>
                 <div className="text-center p-4 bg-blue-50 rounded-lg min-w-[100px]">
                   <div className="text-xs text-blue-600 font-bold uppercase">Exp. IRR</div>
                   <div className="text-xl font-bold text-blue-700">20%+</div>
                 </div>
              </div>
           </div>
        </div>
        <AnalysisBlock data={report.roiAnalysis.detailedAnalysis} />
      </Card>

      {/* 9. Operations */}
      <Card className="lg:col-span-12">
        <SectionHeader icon={Settings} title="9. Operations, O&M & Automation" />
         <div className="space-y-6">
          {report.operations.map((item, idx) => (
            <AnalysisBlock key={idx} data={item} />
          ))}
        </div>
      </Card>

    </div>
  );
};

export default ReportView;