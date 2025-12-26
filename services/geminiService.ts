
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Helper to convert an image URL to a base64 string
async function urlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error("Failed to process image for analysis.");
  }
}

export const analyzePhoto = async (photoUrl: string): Promise<AnalysisResult> => {
  // Safe environment access
  let apiKey = undefined;
  try {
    if (typeof process !== 'undefined' && process.env) {
      apiKey = process.env.API_KEY;
    }
  } catch (e) {}

  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await urlToBase64(photoUrl);

  const prompt = `
    Analyze this photograph as a professional art critic and technical photographer.
    Provide a JSON response with:
    1. A creative, short title.
    2. Estimated technical specs (Guess the Camera Type, Lens, Aperture, ISO based on visual characteristics).
    3. A brief, poetic artistic description (max 2 sentences).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            technicalSpecs: { type: Type.STRING },
            artisticDescription: { type: Type.STRING },
          },
          required: ["title", "technicalSpecs", "artisticDescription"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      title: "Visual Analysis Unavailable",
      technicalSpecs: "Data unavailable",
      artisticDescription: "Unable to analyze this image at the moment."
    };
  }
};
