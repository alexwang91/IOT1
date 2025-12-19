
import { GoogleGenAI } from "@google/genai";
import { FWAReport, Language, ChatMessage } from "../types";

/**
 * Robust JSON parser that handles LLM-specific issues.
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
      throw new Error(`Failed to parse AI response. Error: ${error.message}`);
    }
  }
};

/**
 * Generates an exhaustive FWA strategy report.
 */
export const generateFWAReport = async (country: string, operator: string, language: Language): Promise<FWAReport> => {
  // Use the API_KEY from environment variables as required by system instructions.
  // We check process.env.API_KEY.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing API Key. Ensure 'API_KEY' is set in your environment variables. Current environment does not expose this variable to the client.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Task: Act as a Senior Telecom Strategy Consultant. Generate a 10,000-word equivalent FWA (Fixed Wireless Access) Strategy Blueprint.
    Target: ${operator} in ${country}
    Language: ${language}

    MANDATORY DEPTH:
    1. Populate EVERY section defined in the JSON structure with high-density technical and financial data.
    2. Every bullet point MUST be a paragraph of at least 4-5 detailed sentences.
    3. Use real-world 2024/2025 data points (spectrum holdings, specific vendor partnerships, latest financial report metrics).
    4. Ground the analysis in actual local market conditions using Google Search.

    JSON Structure to follow precisely:
    {
      "operatorName": "${operator}",
      "country": "${country}",
      "painPoints": [{ "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "strategicPositioning": [{ "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "valueProposition": {
        "consumer": { "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] },
        "enterprise": { "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] },
        "operator": { "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "spectrumAnalysis": {
        "overview": "...",
        "bands": [{ "band": "3.5GHz", "technology": "5G NR", "coverage": 80, "capacity": 90, "status": "Allocated" }],
        "detailedAnalysis": { "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "technicalCapabilities": {
        "items": [{ "feature": "Massive MIMO 64T64R", "priority": "High", "description": "..." }],
        "detailedAnalysis": { "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
      },
      "networkPlanning": [{ "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "commercialStrategy": [{ "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }],
      "roiAnalysis": {
        "summary": "...",
        "assumptions": ["Assumption 1...", "Assumption 2..."],
        "detailedAnalysis": { "title": "...", "insight": "...", "strengths": ["..."], "challenges": ["..."], "recommendations": ["..."] }
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
        temperature: 0.15,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI response received.");

    const report = cleanAndParseJSON(text);
    report.groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    return report;
  } catch (error: any) {
    console.error("FWA Generation Error:", error);
    throw error;
  }
};

export const chatWithInsight = async (
  history: ChatMessage[], 
  newMessage: string, 
  reportContext: FWAReport, 
  language: Language
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key configuration error.");
  const ai = new GoogleGenAI({ apiKey });
  
  const systemContext = `Role: Principal Strategy Consultant. Market: ${reportContext.country}, Carrier: ${reportContext.operatorName}. Tone: Professional, authoritative, technical. Use this report context: ${JSON.stringify(reportContext).substring(0, 15000)}. Language: ${language}.`;

  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: { systemInstruction: systemContext },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  const response = await chat.sendMessage({ message: newMessage });
  return response.text || "No response generated.";
};
