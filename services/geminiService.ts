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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Task: Generate an EXTREMELY DETAILED and EXTENSIVE professional FWA (Fixed Wireless Access) strategy insight report.
    Operator: ${operator}
    Country: ${country}
    Language: ${language}

    CRITICAL QUALITY REQUIREMENTS:
    1. EXHAUSTIVE DETAIL: Every "insight" field must contain at least 200-300 words of professional consulting-grade analysis. Avoid generic statements; focus on specific local market conditions, ${operator}'s actual financial standing, and technical debt.
    2. VERBOSE CARDS: For "strengths", "challenges", and "recommendations", do not use simple bullet points. Use 2-3 detailed sentences for each item. I want the UI cards to be full of high-value information.
    3. REAL-TIME GROUNDING: Use Google Search to find actual spectrum holdings (e.g., specific MHz in 700MHz, 2.6GHz, 3.5GHz, 26GHz bands), specific 5G commercial launch dates, and the most recent quarterly subscriber metrics for ${operator}.
    4. TECHNICAL SPECIFICITY: Mention specific technologies like Massive MIMO (64T64R), Beamforming, Network Slicing for FWA, and CPE (Customer Premises Equipment) evolution.

    Output strictly as a valid JSON object.

    JSON Structure:
    {
      "operatorName": "${operator}",
      "country": "${country}",
      "painPoints": [{ "title": "Market Saturation & Growth Constraints", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "strategicPositioning": [{ "title": "Competitive FWA vs Fiber Advantage", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "valueProposition": {
        "consumer": { "title": "Mass-Market Residential Connectivity", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] },
        "enterprise": { "title": "B2B & Industrial Wireless Solutions", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] },
        "operator": { "title": "Network Monetization & Capex Efficiency", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "spectrumAnalysis": {
        "overview": "Exhaustive summary of the total spectrum portfolio including recent auction wins.",
        "bands": [{ "band": "3.5GHz", "technology": "5G NR", "coverage": 80, "capacity": 95, "status": "In Use / Expanding" }],
        "detailedAnalysis": { "title": "Spectrum Portfolio Optimization Strategy", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "technicalCapabilities": {
        "items": [{ "feature": "...", "priority": "High", "description": "Full technical description..." }],
        "detailedAnalysis": { "title": "Architecture & Engineering Roadmap", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "roiAnalysis": {
        "summary": "Deep dive into EBITDA impact and payback period modeling.",
        "assumptions": ["List 5+ detailed assumptions"],
        "detailedAnalysis": { "title": "5-Year ROI & Yield Analysis", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "commercialStrategy": [{ "title": "GTM & Channel Partner Strategy", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }]
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
    if (error.message?.includes('API key not valid')) {
      throw new Error("Authentication failed: The provided API key is invalid. Please ensure your environment is configured correctly.");
    }
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemContext = `You are an elite Telecom Strategic Consultant. You have analyzed the FWA potential for ${reportContext.operatorName} in ${reportContext.country}. Respond with extreme professional depth. Use the provided report context: ${JSON.stringify(reportContext).substring(0, 8000)}. Language: ${language}.`;

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