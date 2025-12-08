
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

// New rich structure for detailed insights
export interface StrategicAnalysis {
  title: string;
  insight: string; // Detailed paragraph analysis
  strengths: string[];
  challenges: string[]; // Weaknesses/Cons
  recommendations: string[]; // Sales pitch/Advice
}

export interface ROIData {
  npv: number;
  irr: number;
  paybackPeriod: number;
}

export interface FWAReport {
  operatorName: string;
  country: string;
  
  // 1. Pain Points
  painPoints: StrategicAnalysis[];

  // 2. Strategic Positioning
  strategicPositioning: StrategicAnalysis[];

  // 3. Value Proposition
  valueProposition: {
    consumer: StrategicAnalysis;
    enterprise: StrategicAnalysis;
    operator: StrategicAnalysis;
  };

  // 4. Spectrum
  spectrumAnalysis: {
    overview: string;
    bands: SpectrumBand[];
    detailedAnalysis: StrategicAnalysis;
  };

  // 5. Technical
  technicalCapabilities: {
    items: {
        feature: string;
        priority: 'High' | 'Medium' | 'Low';
        description: string;
    }[];
    detailedAnalysis: StrategicAnalysis;
  };

  // 6. Network
  networkPlanning: StrategicAnalysis[];

  // 7. Commercial
  commercialStrategy: StrategicAnalysis[];

  // 8. ROI
  roiAnalysis: {
    summary: string;
    assumptions: string[];
    detailedAnalysis: StrategicAnalysis;
  };

  // 9. Operations
  operations: StrategicAnalysis[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
