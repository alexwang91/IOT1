
export enum Language {
  ENGLISH = 'English',
  CHINESE = 'Chinese',
}

export interface SpectrumBand {
  band: string;
  technology: string;
  coverage: number; // 0-100 score
  capacity: number; // 0-100 score
  status: string; // e.g., "Allocated", "Auction Soon"
}

export interface StrategicAnalysis {
  title: string;
  insight: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  expertCritique?: string; // Commentary from the Flash expert
  researchDirectives?: string[]; // Areas needing further study
}

export interface TechnicalFeature {
  feature: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  relevanceScore: number; // 0-100
}

export interface FWAReport {
  operatorName: string;
  country: string;
  
  // High-level conclusion
  executiveSummary: string;
  fwaPotential: string;       // New: FWA潜力
  currentAssessment: string;   // New: 当前评价
  futurePriorities: string;    // New: 未来重点
  
  // 1. Market Context & Pain Points
  painPoints: StrategicAnalysis[];

  // 2. Strategic Positioning
  strategicPositioning: StrategicAnalysis[];

  // 3. Value Proposition (Consumer, Enterprise, Operator)
  valueProposition: {
    consumer: StrategicAnalysis;
    enterprise: StrategicAnalysis;
    operator: StrategicAnalysis;
  };

  // 4. Spectrum Detail
  spectrumAnalysis: {
    overview: string;
    bands: SpectrumBand[];
    detailedAnalysis: StrategicAnalysis;
  };

  // 5. Technical Capabilities (20+ features evaluated)
  technicalCapabilities: {
    items: TechnicalFeature[];
    detailedAnalysis: StrategicAnalysis;
  };

  // 6. Network Planning & Optimization
  networkPlanning: StrategicAnalysis[];

  // 7. Commercial & GTM Strategy
  commercialStrategy: StrategicAnalysis[];

  // 8. ROI & Business Modeling
  roiAnalysis: {
    summary: string;
    assumptions: string[];
    detailedAnalysis: StrategicAnalysis;
    roiCalculatorLogic: string;
  };

  // 9. Operations & Roadmap
  operations: StrategicAnalysis[];
  
  // Expert Meta
  expertSummary: string; // Cynical summary of the report's validity
  
  groundingChunks?: any[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}