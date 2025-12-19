
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
 */
export const generateFWAReport = async (country: string, operator: string, language: Language): Promise<FWAReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });

  const isChinese = language === Language.CHINESE;

  const corePrompt = `
    Role: Senior Telecom Strategy Architect & Lead Market Analyst (A16z/Strategy& Style).
    Target: ${operator} in ${country} (Market Context: Focus on FWA deployment, 5G Spectral Strategy, ROI Analysis).
    Language: ${language}. IMPORTANT: ALL content must be in ${language}. DO NOT include English translations in brackets.

    TASK: Generate an extremely detailed, high-density strategic blueprint for FWA.
    
    CONTENT REQUIREMENTS (VERY IMPORTANT):
    - Each "insight" must be a long, data-rich paragraph (at least 150-200 words).
    - Every list (strengths, challenges, recommendations) must contain at least 5-7 items.
    - Technical evaluation must be thorough: mention specific 3GPP releases, beamforming techniques, and spectral efficiency ratios.
    - Spectrum Analysis: Research the latest 2024 spectrum holdings for ${operator} in ${country}.
    - ROI Logic: Provide a breakdown of cost per bit, CPE subsidies, and churn reduction strategies.

    JSON SCHEMA (Strict adherence):
    {
      "operatorName": "${operator}",
      "country": "${country}",
      "executiveSummary": "A highly detailed, professional summary (300+ words) of the strategic outlook.",
      "painPoints": [{ "title": "Section Title", "insight": "Extensive paragraph...", "strengths": ["Item 1", "Item 2", ...], "challenges": [...], "recommendations": [...] }],
      "strategicPositioning": [{ "title": "Positioning Factor", "insight": "Extensive paragraph...", "strengths": [...], "challenges": [...], "recommendations": [...] }],
      "valueProposition": {
        "consumer": { "title": "B2C Strategy", "insight": "Detailed analysis...", "strengths": [...], "challenges": [...], "recommendations": [...] },
        "enterprise": { "title": "B2B/SME Strategy", "insight": "Detailed analysis...", "strengths": [...], "challenges": [...], "recommendations": [...] },
        "operator": { "title": "Internal/OpEx Efficiency", "insight": "Detailed analysis...", "strengths": [...], "challenges": [...], "recommendations": [...] }
      },
      "spectrumAnalysis": {
        "overview": "Detailed spectral landscape overview...",
        "bands": [{ "band": "n78 (3.5GHz)", "technology": "5G NR", "coverage": 85, "capacity": 95, "status": "Primary" }],
        "detailedAnalysis": { "title": "Spectral Engineering", "insight": "...", "strengths": [...], "challenges": [...], "recommendations": [...] }
      },
      "technicalCapabilities": {
        "items": [{ "feature": "Massive MIMO (64T64R)", "priority": "High", "description": "Long technical explanation...", "relevanceScore": 98 }],
        "detailedAnalysis": { "title": "Infrastructure Roadmap", "insight": "...", "strengths": [...], "challenges": [...], "recommendations": [...] }
      },
      "networkPlanning": [{ "title": "Optimization Strategy", "insight": "...", "strengths": [...], "challenges": [...], "recommendations": [...] }],
      "commercialStrategy": [{ "title": "GTM & Pricing Logic", "insight": "...", "strengths": [...], "challenges": [...], "recommendations": [...] }],
      "roiAnalysis": {
        "summary": "Long breakdown of financial viability...",
        "assumptions": ["List 8-10 specific financial assumptions..."],
        "detailedAnalysis": { "title": "Economic Modeling", "insight": "...", "strengths": [...], "challenges": [...], "recommendations": [...] },
        "roiCalculatorLogic": "Detailed formulaic description of the yield calculation."
      },
      "operations": [{ "title": "Roadmap 2025-2027", "insight": "...", "strengths": [...], "challenges": [...], "recommendations": [...] }]
    }
  `;

  const coreResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: corePrompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      maxOutputTokens: 64000,
      tools: [{ googleSearch: {} }],
      temperature: 0.1,
    }
  });

  const coreReport = cleanAndParseJSON(coreResponse.text || "{}");

  // STAGE 2: EXPERT CRITIQUE
  const critiquePrompt = `
    Role: Cynical Telecom Auditor. Language: ${language}.
    Task: Critically review this report for ${operator}.
    Data: ${JSON.stringify(coreReport).substring(0, 15000)}
    
    INSTRUCTIONS:
    - Provide an "expertCritique" and "researchDirectives" for each core block.
    - Everything must be in ${language}. No English.
    - Be sharp, technical, and professional.

    Output format: JSON ONLY.
    {
      "critiques": [ { "sectionTitle": "Exact Section Title from Data", "critique": "...", "directives": ["..."] } ],
      "expertSummary": "A final 200-word critical judgement."
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

  const critiqueData = cleanAndParseJSON(critiqueResponse.text || "{}");

  const mergeCritique = (section: any, title: string) => {
    const crit = critiqueData.critiques?.find((c: any) => 
      (c.sectionTitle && title.toLowerCase().includes(c.sectionTitle.toLowerCase())) || 
      (c.sectionTitle && c.sectionTitle.toLowerCase().includes(title.toLowerCase()))
    );
    if (crit && section) {
      section.expertCritique = crit.critique;
      section.researchDirectives = crit.directives;
    }
  };

  // Merge back
  if (coreReport.painPoints) coreReport.painPoints.forEach((p: any) => mergeCritique(p, p.title));
  if (coreReport.strategicPositioning) coreReport.strategicPositioning.forEach((p: any) => mergeCritique(p, p.title));
  if (coreReport.valueProposition) {
    mergeCritique(coreReport.valueProposition.consumer, coreReport.valueProposition.consumer.title);
    mergeCritique(coreReport.valueProposition.enterprise, coreReport.valueProposition.enterprise.title);
    mergeCritique(coreReport.valueProposition.operator, coreReport.valueProposition.operator.title);
  }
  if (coreReport.spectrumAnalysis) mergeCritique(coreReport.spectrumAnalysis.detailedAnalysis, coreReport.spectrumAnalysis.detailedAnalysis.title);
  if (coreReport.technicalCapabilities) mergeCritique(coreReport.technicalCapabilities.detailedAnalysis, coreReport.technicalCapabilities.detailedAnalysis.title);
  if (coreReport.networkPlanning) coreReport.networkPlanning.forEach((p: any) => mergeCritique(p, p.title));
  if (coreReport.commercialStrategy) coreReport.commercialStrategy.forEach((p: any) => mergeCritique(p, p.title));
  if (coreReport.roiAnalysis) mergeCritique(coreReport.roiAnalysis.detailedAnalysis, coreReport.roiAnalysis.detailedAnalysis.title);
  if (coreReport.operations) coreReport.operations.forEach((p: any) => mergeCritique(p, p.title));
  
  coreReport.expertSummary = critiqueData.expertSummary;
  coreReport.groundingChunks = coreResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;

  return coreReport as FWAReport;
};

export const chatWithInsight = async (
  history: ChatMessage[], 
  newMessage: string, 
  reportContext: FWAReport, 
  language: Language
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing.");
  const ai = new GoogleGenAI({ apiKey });
  
  const systemContext = `Context: Senior Telecom Consultant. Data: ${JSON.stringify(reportContext).substring(0, 15000)}. Language: ${language}. Always answer in ${language}. Be technical.`;

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
