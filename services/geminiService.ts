import { GoogleGenAI } from "@google/genai";
import { FWAReport, Language, ChatMessage } from "../types";

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
  // Always use a fresh instance to capture any updated environment state
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please select a valid key via the 'Select API Key' button.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Task: Generate an EXHAUSTIVE professional FWA (Fixed Wireless Access) strategy insight report.
    Operator: ${operator}
    Country: ${country}
    Language: ${language}

    CRITICAL QUALITY REQUIREMENTS (FILL THE CARDS):
    1. EXTREME VERBOSITY FOR CARDS: For every single point in "strengths", "challenges", and "recommendations", you MUST write a detailed paragraph of 3-4 sentences (at least 50-80 words per bullet point). I want the UI cards to be fully populated with deep strategic text, not short phrases.
    2. DEEP INSIGHTS: Every "insight" field must be a 500-word mini-essay providing technical and market analysis.
    3. REAL-WORLD DATA: Use Google Search to find actual spectrum holdings (700MHz, 2.6GHz, 3.5GHz, 26GHz), precise 5G coverage %, latest subscriber numbers from 2024/2025 financial reports, and specific competitor names.
    4. TECHNICAL SPECIFICITY: Discuss specific hardware (e.g., Huawei/Nokia/Ericsson gear), Massive MIMO configurations, and backhaul solutions relevant to ${operator}.

    JSON Structure:
    {
      "operatorName": "${operator}",
      "country": "${country}",
      "painPoints": [{ 
        "title": "Comprehensive Market Barriers & Growth Constraints", 
        "insight": "Extensive 500-word analysis of current market saturation and digital divide issues...", 
        "strengths": ["Detailed 4-sentence paragraph about existing spectrum assets and how they provide a competitive edge in sub-6GHz coverage...", "Another detailed paragraph about tower density and existing fiber-to-the-site backhaul infrastructure..."], 
        "challenges": ["Detailed 4-sentence paragraph about regulatory hurdles and spectrum auction costs in ${country}...", "Detailed 4-sentence paragraph about the impact of inflation on CPE procurement and consumer ARPU..."], 
        "recommendations": ["Detailed 4-sentence tactical recommendation on deploying outdoor high-gain CPE for rural expansion...", "Detailed 4-sentence recommendation on leveraging 5G Standalone network slicing for tiered FWA services..."]
      }],
      "strategicPositioning": [{ "title": "Strategic FWA vs Fiber Competitive Landscape", "insight": "Full strategic essay...", "strengths": ["Detailed paragraph..."], "challenges": ["Detailed paragraph..."], "recommendations": ["Detailed paragraph..."] }],
      "valueProposition": {
        "consumer": { "title": "B2C Value Architecture", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] },
        "enterprise": { "title": "B2B & Industrial Wireless Strategy", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] },
        "operator": { "title": "OPEX Optimization & Spectral Efficiency", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "spectrumAnalysis": {
        "overview": "Extensive summary of digital assets.",
        "bands": [{ "band": "3.5GHz", "technology": "5G NR SA", "coverage": 85, "capacity": 95, "status": "Primary Deployment Band" }],
        "detailedAnalysis": { "title": "Spectral Valuation & Asset Optimization", "insight": "Deep analysis...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "roiAnalysis": {
        "summary": "Exhaustive financial summary with EBITDA impact.",
        "assumptions": ["List 10 specific financial and technical assumptions..."],
        "detailedAnalysis": { "title": "5-Year ROI & Yield Projection", "insight": "Full financial model breakdown...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "commercialStrategy": [{ "title": "Omnichannel GTM & Pricing Evolution", "insight": "Commercial strategy analysis...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
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
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");
  
  const ai = new GoogleGenAI({ apiKey });
  const systemContext = `You are a world-class Telecom Strategic Consultant. You have analyzed ${reportContext.operatorName} in ${reportContext.country}. Respond with extreme technical and financial depth. Use this context: ${JSON.stringify(reportContext).substring(0, 10000)}. Language: ${language}.`;

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