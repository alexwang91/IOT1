import { GoogleGenAI } from "@google/genai";
import { FWAReport, Language, ChatMessage } from "../types";

// The hardcoded API Key
const GLOBAL_API_KEY = process.env.API_KEY || "YOUR_API_KEY";

/**
 * Robust JSON parser that handles common LLM issues like truncation, 
 * unescaped characters, and trailing commas.
 */
const cleanAndParseJSON = (text: string): FWAReport => {
  let cleaned = text.trim();

  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1];
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

  const openBraces = (cleaned.match(/{/g) || []).length;
  const closeBraces = (cleaned.match(/}/g) || []).length;
  if (openBraces > closeBraces) {
    cleaned += '}'.repeat(openBraces - closeBraces);
  }

  try {
    return JSON.parse(cleaned) as FWAReport;
  } catch (error: any) {
    console.error("JSON Parse Error. Data sample:", cleaned.substring(0, 100));
    try {
      const sanitized = cleaned
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/\t/g, ' ');
      return JSON.parse(sanitized) as FWAReport;
    } catch (finalError) {
      throw new Error(`Failed to parse report data. The AI response was malformed. Error: ${error.message}`);
    }
  }
};

/**
 * Generates an FWA strategy report using Gemini 3 Pro.
 */
export const generateFWAReport = async (country: string, operator: string, language: Language): Promise<FWAReport> => {
  const ai = new GoogleGenAI({ apiKey: GLOBAL_API_KEY });
  
  const prompt = `
    Task: Generate an extensive professional FWA (Fixed Wireless Access) strategy insight report.
    Operator: ${operator}
    Country: ${country}
    Language: ${language}

    Guidelines:
    1. Use Google Search to find actual spectrum holdings (e.g., 700MHz, 2.6GHz, 3.5GHz), specific 5G launch dates, and precise market share metrics for ${operator}.
    2. THE INSIGHT FIELDS MUST BE VERBOSE. Provide 3-4 sentences of deep strategic analysis for every "insight" field.
    3. THE STRENGTHS, CHALLENGES, AND RECOMMENDATIONS MUST BE DETAILED. Instead of one-word bullet points, provide full descriptive phrases (e.g., "Leveraging existing 2.6GHz mid-band assets for massive MIMO deployment" instead of just "Spectrum").
    4. Output strictly as a valid JSON object.

    JSON Structure:
    {
      "operatorName": "${operator}",
      "country": "${country}",
      "painPoints": [{ "title": "Market Saturation Analysis", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "strategicPositioning": [{ "title": "FWA vs Fiber Competitive Edge", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "valueProposition": {
        "consumer": { "title": "Residential Value", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] },
        "enterprise": { "title": "SME & Industrial FWA", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] },
        "operator": { "title": "Internal Capex Efficiency", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "spectrumAnalysis": {
        "overview": "Summary of held spectrum.",
        "bands": [{ "band": "3.5GHz", "technology": "5G", "coverage": 80, "capacity": 90, "status": "Allocated" }],
        "detailedAnalysis": { "title": "Spectrum Portfolio Optimization", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "technicalCapabilities": {
        "items": [{ "feature": "...", "priority": "High", "description": "..." }],
        "detailedAnalysis": { "title": "Network Modernization Roadmap", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "networkPlanning": [{ "title": "Infrastructure Scalability", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "commercialStrategy": [{ "title": "Pricing & GTM Model", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "roiAnalysis": {
        "summary": "...",
        "assumptions": ["..."],
        "detailedAnalysis": { "title": "5-Year ROI Forecast", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "operations": [{ "title": "Service Reliability Strategy", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }]
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
    if (!text) throw new Error("Empty response from Gemini API.");

    const report = cleanAndParseJSON(text);
    report.groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    return report;
  } catch (error: any) {
    console.error("FWA Generation Error:", error);
    throw error;
  }
};

/**
 * Expert Chat powered by Gemini 3 Pro.
 */
export const chatWithInsight = async (
  history: ChatMessage[], 
  newMessage: string, 
  reportContext: FWAReport, 
  language: Language
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: GLOBAL_API_KEY });
  const systemContext = `You are a world-class Telecom Strategic Consultant. You have analyzed the FWA potential for ${reportContext.operatorName} in ${reportContext.country}. Respond based on the provided report context: ${JSON.stringify(reportContext).substring(0, 6000)}. Always be professional, data-driven, and forward-looking. Language: ${language}.`;

  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: { systemInstruction: systemContext },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  const response = await chat.sendMessage({ message: newMessage });
  return response.text || "I'm sorry, I couldn't generate a response.";
};