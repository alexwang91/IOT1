import { GoogleGenAI } from "@google/genai";
import { FWAReport, Language, ChatMessage } from "../types";

// NOTE: We initialize the AI client inside the functions to prevent 
// "process is not defined" errors at module load time in some client-side environments.

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing. Please ensure it is set in your environment variables (e.g., .env file or Vercel settings).");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFWAReport = async (country: string, operator: string, language: Language): Promise<FWAReport> => {
  const ai = getAIClient();
  
  const prompt = `
    Generate a highly detailed strategic Fixed Wireless Access (FWA) insight report for the operator "${operator}" in the country "${country}".
    The output language must be ${language}.
    
    You must use Google Search to find real, up-to-date spectrum allocations, market challenges, and competitor data for this specific operator.
    
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

    Return ONLY the raw JSON string matching the structure below. Do not wrap in markdown code blocks.
    
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
    // Switch to gemini-2.5-flash for better stability and speed.
    // Thinking mode removed to prevent timeouts in web contexts.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType is NOT allowed when using googleSearch tool
      }
    });

    let text = response.text;
    
    if (!text) {
        throw new Error("No content generated. The model may have been blocked or failed to respond.");
    }

    // Clean up Markdown code blocks if present (e.g., ```json ... ```)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Robust JSON extraction: Find the first '{' and last '}'
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    } else {
      console.error("Invalid JSON format received:", text);
      throw new Error("The AI response was not valid JSON. Please try again.");
    }

    return JSON.parse(text) as FWAReport;
  } catch (error: any) {
    console.error("Error generating report:", error);
    // enhance error message for UI
    if (error.message.includes("API_KEY")) {
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
    model: 'gemini-2.5-flash', // Matched model for consistency
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