import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLandingCopy = async (topic: string) => {
  try {
    const ai = getClient();
    const prompt = `Create high-converting landing page copy for a product about "${topic}".
    Return the response in strictly valid JSON format with the following keys:
    {
      "headline": "A catchy, urgent headline (max 10 words)",
      "subheadline": "A persuasive subheadline explaining the benefit (max 25 words)",
      "ctaText": "Action-oriented button text (max 4 words)"
    }
    Do not add markdown formatting. Just raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};