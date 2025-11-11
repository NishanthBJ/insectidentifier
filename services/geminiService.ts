
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { GeminiTextResponse, InsectData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textModel = 'gemini-2.5-flash';
const imageModel = 'gemini-2.5-flash-image';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    isInsect: { type: Type.BOOLEAN },
    name: { type: Type.STRING, nullable: true },
    scientificName: { type: Type.STRING, nullable: true },
    description: { type: Type.STRING, nullable: true },
    status: { type: Type.STRING, nullable: true },
    imagePrompt: { type: Type.STRING, nullable: true },
    reason: { type: Type.STRING, nullable: true },
  },
};

export const fetchInsectData = async (searchTerm: string): Promise<InsectData> => {
  const prompt = `
    You are an entomologist expert. Your task is to analyze the user's query and provide information ONLY about insects.

    1. First, determine if the creature in the query "${searchTerm}" is an insect.
    2. If it is NOT an insect, you MUST respond with a JSON object where "isInsect" is false and "reason" explains why (e.g., "A lion is a mammal, not an insect.").
    3. If it IS an insect, you MUST respond with a JSON object containing the following details:
        * "isInsect": true
        * "name": The common name.
        * "scientificName": The scientific name.
        * "description": A concise and interesting paragraph about the insect.
        * "status": Its conservation status (e.g., "Living", "Extinct", "Vulnerable", "Common").
        * "imagePrompt": A detailed, descriptive prompt suitable for an AI image generator to create a photorealistic or high-quality illustration of the insect in its natural habitat. For example: "A close-up, photorealistic image of a Monarch butterfly with vibrant orange and black wings, resting on a bright green milkweed leaf."

    You must only respond with a single, valid JSON object and nothing else.
  `;

  const textResponse = await ai.models.generateContent({
    model: textModel,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });
  
  const textData: GeminiTextResponse = JSON.parse(textResponse.text);

  if (!textData.isInsect) {
    throw new Error(textData.reason || `"${searchTerm}" is not recognized as an insect.`);
  }

  if (!textData.imagePrompt || !textData.name || !textData.scientificName || !textData.description || !textData.status) {
    throw new Error('Incomplete data received from AI. Please try a different search term.');
  }

  const imageResponse = await ai.models.generateContent({
    model: imageModel,
    contents: {
      parts: [{ text: textData.imagePrompt }],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const imagePart = imageResponse.candidates?.[0]?.content?.parts?.[0];
  if (!imagePart || !imagePart.inlineData) {
    throw new Error('Failed to generate an image for the insect.');
  }

  const base64ImageBytes: string = imagePart.inlineData.data;
  const imageUrl = `data:image/png;base64,${base64ImageBytes}`;

  return {
    name: textData.name,
    scientificName: textData.scientificName,
    description: textData.description,
    status: textData.status,
    imageUrl: imageUrl,
  };
};
