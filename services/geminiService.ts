
import { GoogleGenAI } from "@google/genai";
import { FWAReport, Language, ChatMessage } from "../types";

// The hardcoded API Key as per user instruction
const GLOBAL_API_KEY = "AIzaSyCyA8Z6GzGHbj1SU2Dw4P9urGMjBY0JlbE";

/**
 * Robust JSON parser that handles common LLM issues like truncation, 
 * unescaped characters, and trailing commas.
 */
const cleanAndParseJSON = (text: string): FWAReport => {
  let cleaned = text.trim();

  // Remove markdown formatting if present
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1];
  }

  // Find boundaries of the JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Basic cleanup: remove trailing commas before closing symbols
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

  // Attempt to fix common truncation issues by balancing braces
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
    Task: Generate a professional FWA (Fixed Wireless Access) strategy insight report.
    Operator: ${operator}
    Country: ${country}
    Language: ${language}

    Guidelines:
    1. Use Google Search to find actual spectrum holdings (e.g., 700MHz, 2.6GHz, 3.5GHz), recent news, and market share for ${operator}.
    2. Output strictly as a valid JSON object.
    3. Ensure all strings are properly escaped.

    JSON Structure:
    {
      "operatorName": "${operator}",
      "country": "${country}",
      "painPoints": [{ "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "strategicPositioning": [{ "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "valueProposition": {
        "consumer": { "title": "Consumer", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] },
        "enterprise": { "title": "Enterprise", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] },
        "operator": { "title": "Internal", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "spectrumAnalysis": {
        "overview": "Summary of held spectrum.",
        "bands": [{ "band": "3.5GHz", "technology": "5G", "coverage": 80, "capacity": 90, "status": "Allocated" }],
        "detailedAnalysis": { "title": "Strategy", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "technicalCapabilities": {
        "items": [{ "feature": "...", "priority": "High", "description": "..." }],
        "detailedAnalysis": { "title": "Roadmap", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "networkPlanning": [{ "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "commercialStrategy": [{ "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "roiAnalysis": {
        "summary": "...",
        "assumptions": ["..."],
        "detailedAnalysis": { "title": "ROI", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "operations": [{ "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }]
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
  const ai = new GoogleGenAI({ apiKey: GLOBAL_API_KEY });
  const systemContext = `You are an expert Telecom Strategic Consultant. Report Context for ${reportContext.operatorName} in ${reportContext.country}: ${JSON.stringify(reportContext).substring(0, 5000)}. Language: ${language}.`;

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
