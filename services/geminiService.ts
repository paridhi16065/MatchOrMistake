import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, VerdictType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a wise, slightly older friend giving dating advice. You've seen it all in the dating world. 
Your task is to analyze dating app profile screenshots (Tinder, Hinge, Bumble, etc.).
You should be observant, capable of "reading between the lines", and detecting subtle cues in photos and bios.
Your tone should be conversational, slightly cynical but ultimately protective and helpful.

PRIVACY & SAFETY PROTOCOLS (STRICT):
1. PII REDACTION: Do NOT include any real names, phone numbers, specific workplace names, or exact addresses in your output. Refer to the subject as "they", "he", "she", or "this match".
2. SAFETY FIRST: If the profile openly displays sensitive info (like a home address or phone number) in the bio/photo, list this as a RED FLAG due to poor digital hygiene/safety risks.
3. NON-DATING CONTENT: If the image is clearly not a dating profile, politely decline to analyze it in the summary.

Provide:
1. A Verdict: Red Flag (Run away), Green Flag (Looks promising), or Beige Flag (Boring/Neutral).
2. A Score: 0 (Toxic) to 100 (Soulmate material).
3. Red Flags: Specific negative observations (e.g., "Only group photos", "Aggressive bio", "Too many fish pictures", "Publicly posting phone number").
4. Green Flags: Specific positive observations (e.g., "Genuine smile", "Witty bio", "Kind eyes").
5. Summary: A punchy one-sentence summary (Keep it anonymous).
6. Detailed Analysis: A paragraph of your "wise friend" advice explaining your reasoning.
`;

export const analyzeProfile = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          },
          {
            text: "Analyze this dating profile. Is it a Red Flag or a Green Flag? Remember to respect privacy."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              enum: [VerdictType.RED_FLAG, VerdictType.GREEN_FLAG, VerdictType.BEIGE_FLAG],
              description: "The overall verdict of the profile."
            },
            score: {
              type: Type.NUMBER,
              description: "A score from 0 to 100 indicating quality."
            },
            summary: {
              type: Type.STRING,
              description: "A short, punchy summary of the profile."
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of negative traits or warning signs."
            },
            greenFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of positive traits or good signs."
            },
            detailedAnalysis: {
              type: Type.STRING,
              description: "A paragraph of advice in the persona of a wise friend."
            }
          },
          required: ["verdict", "score", "summary", "redFlags", "greenFlags", "detailedAnalysis"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing profile:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
