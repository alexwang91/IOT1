import { GoogleGenAI } from "@google/genai";
import { FWAReport, Language, ChatMessage } from "../types";

const getAIClient = () => {
  // Strict adherence to system instructions: use process.env.API_KEY directly.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not defined.");
  }
  return new GoogleGenAI({ apiKey });
};

// Robust JSON parser that handles common LLM formatting issues and truncation
const cleanAndParseJSON = (text: string): FWAReport => {
  // 1. Try to find the JSON block if it's wrapped in markdown
  let jsonStr = text;
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
  
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  // 2. Fallback: find the first '{' and last '}'
  const start = jsonStr.indexOf('{');
  const end = jsonStr.lastIndexOf('}');
  
  if (start !== -1 && end !== -1) {
    jsonStr = jsonStr.substring(start, end + 1);
  }

  // 3. Common fixes for LLM-generated JSON
  // Remove potential trailing commas before closing braces/brackets
  jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');
  
  // Try to fix cases where the model might include unescaped newlines inside strings
  jsonStr = jsonStr.replace(/:\s*"([^"]*?)"/g, (match, p1) => {
    const cleaned = p1.replace(/\n/g, ' ').replace(/\r/g, ' ');
    return `: "${cleaned}"`;
  });

  try {
    return JSON.parse(jsonStr) as FWAReport;
  } catch (error: any) {
    console.debug("Standard JSON parsing failed. Attempting deep fix. Error:", error.message);
    
    try {
        // Attempt to fix unescaped quotes within property values (aggressive fix)
        // This looks for "key": "value with "quotes" inside"
        let saferJson = jsonStr.replace(/"([^"]+)":\s*"([\s\S]+?)"(?=\s*[,}])/g, (match, key, val) => {
            // Escape any unescaped double quotes in the value
            const escapedVal = val.replace(/(?<!\\)"/g, '\\"');
            return `"${key}": "${escapedVal}"`;
        });
        return JSON.parse(saferJson) as FWAReport;
    } catch (e) {
        console.error("Raw response that failed to parse:", text);
        throw new Error(`The analysis was too detailed for the parser to handle. Please try again or simplify the operator name.`);
    }
  }
};

export const generateFWAReport = async (country: string, operator: string, language: Language): Promise<FWAReport> => {
  const ai = getAIClient();
  
  const prompt = `
    Generate a highly detailed strategic Fixed Wireless Access (FWA) insight report for the operator "${operator}" in the country "${country}".
    The output language must be ${language}.
    
    You must use Google Search to find real, up-to-date spectrum allocations (including specific frequency bands like 2.6GHz, 3.5GHz, etc.), market challenges, and competitor data for this specific operator.
    
    CRITICAL INSTRUCTIONS FOR OUTPUT:
    1. Output strictly valid JSON.
    2. Ensure all strings are properly escaped (especially quotes inside text).
    3. Do not include any conversational text outside of the JSON block.
    4. Provide substantial "insight" paragraphs (at least 3-4 sentences each) for every section.
    
    The report should cover these 9 areas in detail:
    1. Pain Points & Challenges.
    2. FWA Strategic Positioning.
    3. Value Propositions (Consumer, Enterprise, Operator internal benefits).
    4. Spectrum Analysis (Identify specific Low/Mid/High bands currently held or planned). Estimate coverage/capacity scores (0-100) for visualization.
    5. Technical Capabilities (Prioritized list of features like 5G SA, Massive MIMO, Slicing).
    6. Network Planning (Targeted demographics, capacity planning, CPE strategies).
    7. Commercial Strategy (GTM, pricing tiers, distribution channels).
    8. ROI Analysis Model (Assumptions and strategic financial outlook).
    9. Operations & O&M (Management systems, automated provisioning).

    Return the data in this exact structure:
    {
      "operatorName": "${operator}",
      "country": "${country}",
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
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" is not used here because it is currently incompatible with googleSearch tool.
      }
    });

    const text = response.text;
    
    if (!text) {
        throw new Error("The model failed to generate a response. This could be due to safety filters or connectivity issues.");
    }

    return cleanAndParseJSON(text);

  } catch (error: any) {
    console.error("Error generating report:", error);
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
    
    Context of the analysis:
    ${JSON.stringify(reportContext)}

    Answer professionally, focusing on technical feasibility, commercial ROI, and competitive landscape.
  `;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
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