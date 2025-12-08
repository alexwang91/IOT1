import { GoogleGenAI } from "@google/genai";
import { FWAReport, Language, ChatMessage } from "../types";

// NOTE: We initialize the AI client inside the functions to prevent 
// "process is not defined" errors at module load time in some client-side environments.

const getAIClient = () => {
  // Attempt to retrieve the API key from various common environment variable patterns.
  // Frontend build tools (Vite, CRA) typically require variables to start with VITE_ or REACT_APP_
  // to be exposed to the client-side browser bundle.
  
  let viteKey = undefined;
  try {
    // @ts-ignore - Handle Vite's import.meta.env if available
    if (typeof import.meta !== 'undefined' && import.meta.env) {
       // @ts-ignore
       viteKey = import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Ignore errors if import.meta is not supported in the environment
  }

  const apiKey = 
    process.env.API_KEY || 
    process.env.VITE_API_KEY || 
    process.env.REACT_APP_API_KEY || 
    viteKey;

  if (!apiKey) {
    throw new Error(
      "API Key is missing.\n\n" +
      "If you are deploying on Vercel:\n" +
      "1. Go to Settings > Environment Variables.\n" +
      "2. Rename your variable from 'API_KEY' to 'VITE_API_KEY'.\n" +
      "3. Redeploy the application.\n\n" +
      "Security Note: Frontend build tools hide variables by default. They must be prefixed with 'VITE_' (for Vite) or 'REACT_APP_' (for Create React App) to be visible in the browser."
    );
  }
  return new GoogleGenAI({ apiKey });
};

// Robust JSON parser that attempts to fix common LLM syntax errors
const cleanAndParseJSON = (text: string): FWAReport => {
  // 1. Remove Markdown code blocks
  let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

  // 2. Extract the main JSON object (first '{' to last '}')
  const start = jsonStr.indexOf('{');
  const end = jsonStr.lastIndexOf('}');
  
  if (start !== -1 && end !== -1) {
    jsonStr = jsonStr.substring(start, end + 1);
  } else {
    throw new Error("No valid JSON object found in the response.");
  }

  // 3. Auto-repair common syntax errors
  // Fix: Missing commas between objects in arrays (e.g., "...}" "{...")
  jsonStr = jsonStr.replace(/}\s*\{/g, '}, {');
  // Fix: Missing commas between arrays and keys (e.g., "...]" "key"...)
  jsonStr = jsonStr.replace(/]\s*"/g, '], "');
  // Fix: Trailing commas before closing braces/brackets (e.g., "..., }")
  jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');

  try {
    return JSON.parse(jsonStr) as FWAReport;
  } catch (error: any) {
    console.error("JSON Parse failed. Raw text snippet:", jsonStr.substring(0, 200) + "...");
    throw new Error(`Failed to parse report data: ${error.message}. The AI response was malformed.`);
  }
};

export const generateFWAReport = async (country: string, operator: string, language: Language): Promise<FWAReport> => {
  const ai = getAIClient();
  
  const prompt = `
    Generate a highly detailed strategic Fixed Wireless Access (FWA) insight report for the operator "${operator}" in the country "${country}".
    The output language must be ${language}.
    
    You must use Google Search to find real, up-to-date spectrum allocations, market challenges, and competitor data for this specific operator.
    
    CRITICAL INSTRUCTIONS FOR JSON OUTPUT:
    1. Output strictly valid JSON only.
    2. Return the JSON as a SINGLE LINE string (minified) to avoid parsing issues with newlines.
    3. ESCAPE all double quotes inside string values (e.g., "insight": "The \\"best\\" strategy...").
    4. Do NOT use markdown formatting.
    
    For every section, you must provide a detailed analysis that includes:
    1. "insight": A comprehensive paragraph analyzing the current situation and context.
    2. "strengths": Specific advantages (Pros) this operator has.
    3. "challenges": Specific weaknesses, gaps, or threats (Cons) they face.
    4. "recommendations": Actionable advice or "Sales Pitch" points on how to pitch solutions to them.

    The report should cover these 9 areas in detail (Do NOT include Templates/Tools):
    1. Pain Points & Challenges.
    2. FWA Strategic Positioning.
    3. Value Propositions (Consumer, Enterprise, Operator internal benefits).
    4. Spectrum Analysis (Low/Mid/High bands, current status in ${country}). Estimate coverage/capacity scores (0-100) for visualization.
    5. Technical Capabilities (Prioritized list + Strategic Analysis).
    6. Network Planning (Target areas, capacity planning, CPE selection).
    7. Commercial Strategy (Go-to-market, Pricing, Channels).
    8. ROI Analysis Model (Assumptions and financial viability).
    9. Operations & O&M (TR-069/USP).

    Structure:
    {
      "operatorName": "string",
      "country": "string",
      "painPoints": [{ "title": "string", "insight": "string", "strengths": ["string"], "challenges": ["string"], "recommendations": ["string"] }],
      "strategicPositioning": [{ "title": "string", "insight": "string", "strengths": ["string"], "challenges": ["string"], "recommendations": ["string"] }],
      "valueProposition": {
        "consumer": { "title": "Consumer (ToC)", "insight": "string", "strengths": ["string"], "challenges": ["string"], "recommendations": ["string"] },
        "enterprise": { "title": "Enterprise (ToB)", "insight": "string", "strengths": ["string"], "challenges": ["string"], "recommendations": ["string"] },
        "operator": { "title": "Operator Benefits", "insight": "string", "strengths": ["string"], "challenges": ["string"], "recommendations": ["string"] }
      },
      "spectrumAnalysis": {
        "overview": "string",
        "bands": [{ "band": "string", "technology": "string", "coverage": number, "capacity": number, "status": "string" }],
        "detailedAnalysis": { "title": "Spectrum Strategy", "insight": "string", "strengths": ["string"], "challenges": ["string"], "recommendations": ["string"] }
      },
      "technicalCapabilities": {
        "items": [{ "feature": "string", "priority": "High" | "Medium" | "Low", "description": "string" }],
        "detailedAnalysis": { "title": "Tech Capability Gap", "insight": "string", "strengths": ["string"], "challenges": ["string"], "recommendations": ["string"] }
      },
      "networkPlanning": [{ "title": "string", "insight": "string", "strengths": ["string"], "challenges": ["string"], "recommendations": ["string"] }],
      "commercialStrategy": [{ "title": "string", "insight": "string", "strengths": ["string"], "challenges": ["string"], "recommendations": ["string"] }],
      "roiAnalysis": {
        "summary": "string",
        "assumptions": ["string"],
        "detailedAnalysis": { "title": "ROI & Investment", "insight": "string", "strengths": ["string"], "challenges": ["string"], "recommendations": ["string"] }
      },
      "operations": [{ "title": "string", "insight": "string", "strengths": ["string"], "challenges": ["string"], "recommendations": ["string"] }]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType is NOT allowed when using googleSearch tool
      }
    });

    const text = response.text;
    
    if (!text) {
        throw new Error("No content generated. The model may have been blocked or failed to respond.");
    }

    return cleanAndParseJSON(text);

  } catch (error: any) {
    console.error("Error generating report:", error);
    if (error.message.includes("API Key is missing")) {
        throw error;
    }
    throw new Error(error.message || "An unexpected error occurred during analysis.");
  }
};

export const chatWithInsight = async (
  history: ChatMessage[], 
  newMessage: string, 
  reportContext: FWAReport, 
  language: Language
): Promise<string> => {
  
  const ai = getAIClient();

  const systemContext = `
    You are an expert Telecom Consultant AI. You are discussing a specific FWA Strategy Report for ${reportContext.operatorName} in ${reportContext.country}.
    Language: ${language}.
    
    Here is the context of the report you generated:
    ${JSON.stringify(reportContext)}

    Answer the user's questions based on this report and your general telecom knowledge. 
    Be professional, insightful, and concise.
  `;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemContext,
    },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  const result = await chat.sendMessage({ message: newMessage });
  return result.text || "I apologize, I could not generate a response.";
};
