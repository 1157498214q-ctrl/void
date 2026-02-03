
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCharacterDetails = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the prompt: "${prompt}", generate a fictional character profile in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          title: { type: Type.STRING },
          introduction: { type: Type.STRING },
          ability: { type: Type.STRING, description: "The character's core superpower or skill system." },
          stats: { type: Type.STRING, description: "A multi-line rank string like 'Power: A\nSpeed: B...'" },
          trivia: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cool trivia or minor facts about the character." },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          attributes: {
            type: Type.OBJECT,
            properties: {
              height: { type: Type.STRING },
              age: { type: Type.STRING },
              alignment: { 
                type: Type.STRING, 
                description: "Character affiliation. Must be one of: ASF, 黎明会, 结社, RW, CRUIS, 血色圣杯, 无." 
              },
              gender: { type: Type.STRING }
            }
          }
        },
        required: ['name', 'title', 'introduction', 'tags', 'attributes', 'ability', 'stats', 'trivia']
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const continueLogStream = async (context: string, lastMessage: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Continuing the roleplay log. Context: ${context}. Last message: ${lastMessage}. Generate the next paragraph of narration.`,
    config: {
      systemInstruction: "You are a creative writer for a futuristic/fantasy roleplay archive. Keep the tone mysterious and atmospheric."
    }
  });

  return response.text || '';
};
