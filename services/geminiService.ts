
import { GoogleGenAI, Type } from "@google/genai";
import { FWAReport, Language, ChatMessage } from "../types";

/**
 * Robust JSON parser that handles LLM-specific formatting issues.
 */
const cleanAndParseJSON = (text: string): any => {
  let cleaned = text.trim();
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) cleaned = codeBlockMatch[1];
  
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (error: any) {
    const sanitized = cleaned.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\t/g, ' ');
    return JSON.parse(sanitized);
  }
};

/**
 * Generates an exhaustive FWA strategy report using Gemini 3 Pro with Thinking Mode
 * followed by a Flash Expert Review.
 */
export const generateFWAReport = async (country: string, operator: string, language: Language): Promise<FWAReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });

  // STAGE 1: CORE STRATEGIC GENERATION (Thinking Mode)
  const corePrompt = `
    Role: Senior Telecom Strategy Architect (Expert in 5G, FWA, and Spectral Economics).
    Target: ${operator} in ${country} (Market Context: Focus on FWA vs Fiber, Spectrum n78/n77, ROI Modeling).
    Language: ${language}

    TASK: Generate an exhaustive strategic blueprint for FWA deployment.
    
    SPECIFIC REQUIREMENTS:
    1. Pain Points: Identify main frictions in the market (e.g. fiber penetration gaps, rural latency, high CAPEX).
    2. Strategic Positioning: Is FWA a fiber complement or competitor? Define based on ${operator}'s portfolio.
    3. Spectrum (CRITICAL): Detailed analysis of Romanian bands (3.5GHz/n78, 700MHz/n28, 26GHz/n258). Suggest strategies for refarming or sharing.
    4. Technical evaluation of 20+ features: VoIP/VoLTE, TR-069/USP, EasyMesh, Wi-Fi 7, Slicing, Massive MIMO, etc.
    5. GTM Strategy: Innovative pricing (周期性/无限量), OTT bundles (TV, Streaming), and channel mix.
    6. Business Model: ROI Calculator parameters, implementation roadmap (milestones), and risk framework.
    7. Global Case Studies: Reference similar markets (e.g., T-Mobile US, Optus Australia, or Vodafone UK).

    JSON SCHEMA:
    {
      "operatorName": "${operator}",
      "country": "${country}",
      "executiveSummary": "...",
      "painPoints": [{ "title": "...", "insight": "...", "strengths": [], "challenges": [], "recommendations": [] }],
      "strategicPositioning": [{ "title": "...", "insight": "...", "strengths": [], "challenges": [], "recommendations": [] }],
      "valueProposition": {
        "consumer": { "title": "B2C", "insight": "...", "strengths": [], "challenges": [], "recommendations": [] },
        "enterprise": { "title": "B2B", "insight": "...", "strengths": [], "challenges": [], "recommendations": [] },
        "operator": { "title": "Internal", "insight": "...", "strengths": [], "challenges": [], "recommendations": [] }
      },
      "spectrumAnalysis": {
        "overview": "...",
        "bands": [{ "band": "n78", "technology": "5G NR", "coverage": 70, "capacity": 90, "status": "Allocated" }],
        "detailedAnalysis": { "title": "Spectral Efficiency", "insight": "...", "strengths": [], "challenges": [], "recommendations": [] }
      },
      "technicalCapabilities": {
        "items": [{ "feature": "Massive MIMO", "priority": "High", "description": "...", "relevanceScore": 95 }],
        "detailedAnalysis": { "title": "Tech Stack", "insight": "...", "strengths": [], "challenges": [], "recommendations": [] }
      },
      "networkPlanning": [{ "title": "Optimization", "insight": "...", "strengths": [], "challenges": [], "recommendations": [] }],
      "commercialStrategy": [{ "title": "GTM", "insight": "...", "strengths": [], "challenges": [], "recommendations": [] }],
      "roiAnalysis": {
        "summary": "...",
        "assumptions": ["CAPEX...", "OPEX..."],
        "detailedAnalysis": { "title": "Finance", "insight": "...", "strengths": [], "challenges": [], "recommendations": [] },
        "roiCalculatorLogic": "..."
      },
      "operations": [{ "title": "Ops Roadmap", "insight": "...", "strengths": [], "challenges": [], "recommendations": [] }]
    }
  `;

  const coreResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: corePrompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      maxOutputTokens: 64000, // To allow room for the thinking + large JSON
      tools: [{ googleSearch: {} }],
      temperature: 0.1,
    }
  });

  const coreReport = cleanAndParseJSON(coreResponse.text);

  // STAGE 2: EXPERT CRITIQUE (Flash Expert - Silent Role)
  // This model acts as a "cynical reviewer" to identify uncertainties.
  const critiquePrompt = `
    Role: Senior Telecom Audit Expert. 
    Task: Critically review the following Strategic Report for ${operator} in ${country}.
    Report Data: ${JSON.stringify(coreReport)}
    
    INSTRUCTIONS:
    1. For each section, provide a short "expertCritique" (max 3 sentences) highlighting what might be too optimistic or risky.
    2. List "researchDirectives" for things requiring field testing or regulatory verification.
    3. Provide a final "expertSummary" judging the feasibility of the overall plan (Cynical/Professional tone).
    4. Connect to the internet if needed to verify 2024 Romanian spectrum news or Vodafone specific announcements.
    
    Output Format: ONLY JSON containing:
    {
      "critiques": [ { "sectionTitle": "...", "critique": "...", "directives": ["..."] } ],
      "expertSummary": "..."
    }
  `;

  const critiqueResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: critiquePrompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json"
    }
  });

  const critiqueData = JSON.parse(critiqueResponse.text);

  // STAGE 3: MERGE ANALYTICS
  // Map critiques back to the core report
  const mergeCritique = (section: any, title: string) => {
    const crit = critiqueData.critiques.find((c: any) => c.sectionTitle.includes(title) || title.includes(c.sectionTitle));
    if (crit && section) {
      section.expertCritique = crit.critique;
      section.researchDirectives = crit.directives;
    }
  };

  coreReport.painPoints.forEach((p: any) => mergeCritique(p, p.title));
  coreReport.strategicPositioning.forEach((p: any) => mergeCritique(p, p.title));
  mergeCritique(coreReport.valueProposition.consumer, "B2C");
  mergeCritique(coreReport.valueProposition.enterprise, "B2B");
  mergeCritique(coreReport.valueProposition.operator, "Internal");
  mergeCritique(coreReport.spectrumAnalysis.detailedAnalysis, "Spectral");
  mergeCritique(coreReport.technicalCapabilities.detailedAnalysis, "Tech");
  coreReport.networkPlanning.forEach((p: any) => mergeCritique(p, p.title));
  coreReport.commercialStrategy.forEach((p: any) => mergeCritique(p, p.title));
  mergeCritique(coreReport.roiAnalysis.detailedAnalysis, "Finance");
  coreReport.operations.forEach((p: any) => mergeCritique(p, p.title));
  
  coreReport.expertSummary = critiqueData.expertSummary;
  coreReport.groundingChunks = coreResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;

  return coreReport as FWAReport;
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
  
  const systemContext = `Context: You are a Senior Telecom Consultant. Context: ${JSON.stringify(reportContext).substring(0, 20000)}. Language: ${language}. Use the thinking process for complex questions.`;

  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: { 
      systemInstruction: systemContext,
      thinkingConfig: { thinkingBudget: 16000 }
    },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  const response = await chat.sendMessage({ message: newMessage });
  return response.text || "No response generated.";
};
