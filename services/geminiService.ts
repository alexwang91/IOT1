
import { GoogleGenAI } from "@google/genai";
import { FWAReport, Language, ChatMessage } from "../types";

/**
 * Robust JSON parser that handles LLM-specific formatting issues.
 */
const cleanAndParseJSON = (text: string): FWAReport => {
  let cleaned = text.trim();
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) cleaned = codeBlockMatch[1];
  
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned) as FWAReport;
  } catch (error: any) {
    try {
      const sanitized = cleaned.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\t/g, ' ');
      return JSON.parse(sanitized) as FWAReport;
    } catch (finalError) {
      throw new Error(`Failed to parse AI output. Ensure API_KEY is valid. Error: ${error.message}`);
    }
  }
};

/**
 * Generates an exhaustive FWA strategy report.
 * Uses gemini-3-pro-preview for high-quality technical reasoning.
 */
export const generateFWAReport = async (country: string, operator: string, language: Language): Promise<FWAReport> => {
  // Accessing API_KEY strictly as required by developer guidelines.
  // The system ensures process.env.API_KEY is available in the execution context.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing from process.env. Please verify your environment settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Role: Senior Telecom Strategy Consultant (Specializing in 5G & FWA).
    Objective: Generate an EXHAUSTIVE, multi-dimensional Strategic Analysis.
    Target Operator: ${operator}
    Target Market: ${country}
    Language: ${language}

    MANDATORY DEPTH (完整信息要求):
    1. Every JSON field must be populated with high-density, professional insights.
    2. Analysis must include real-world 2024/2025 market trends, specific spectrum allocation (e.g., n77/n78 bands), and competitive landscape.
    3. Insights should be technical (Massive MIMO, 5G SA vs NSA) and commercial (ARPU growth, customer churn reduction).
    4. Bullet points must be detailed (min 3-4 sentences each) providing a "sales pitch" and technical "blueprint".
    5. ROI analysis should list specific assumptions regarding subscriber acquisition costs (SAC) and network density.

    Output format: STRICT JSON following this schema:
    {
      "operatorName": "${operator}",
      "country": "${country}",
      "painPoints": [{ "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "strategicPositioning": [{ "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "valueProposition": {
        "consumer": { "title": "B2C Value", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] },
        "enterprise": { "title": "B2B Value", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] },
        "operator": { "title": "Internal Strategy", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "spectrumAnalysis": {
        "overview": "...",
        "bands": [{ "band": "3.5GHz", "technology": "5G NR", "coverage": 85, "capacity": 90, "status": "Allocated" }],
        "detailedAnalysis": { "title": "Spectral Efficiency", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "technicalCapabilities": {
        "items": [{ "feature": "Massive MIMO 64T64R", "priority": "High", "description": "..." }],
        "detailedAnalysis": { "title": "Technical Roadmap", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "networkPlanning": [{ "title": "Deployment Strategy", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "commercialStrategy": [{ "title": "Market Penetration", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "roiAnalysis": {
        "summary": "...",
        "assumptions": ["Subscribers...", "CAPEX...", "OPEX..."],
        "detailedAnalysis": { "title": "Financial Viability", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "operations": [{ "title": "Operational GTM", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from Gemini 3 Pro.");

    const report = cleanAndParseJSON(text);
    report.groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    return report;
  } catch (error: any) {
    console.error("FWA Generation Error:", error);
    throw error;
  }
};

/**
 * Expert Chat functionality.
 */
export const chatWithInsight = async (
  history: ChatMessage[], 
  newMessage: string, 
  reportContext: FWAReport, 
  language: Language
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing.");
  const ai = new GoogleGenAI({ apiKey });
  
  const systemContext = `Context: You are a Top-tier Telecom Consultant analyzing ${reportContext.operatorName} in ${reportContext.country}. You have the following report data: ${JSON.stringify(reportContext).substring(0, 15000)}. Language: ${language}. Answer with authority and technical depth.`;

  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: { systemInstruction: systemContext },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  const response = await chat.sendMessage({ message: newMessage });
  return response.text || "Strategic response could not be generated.";
};
