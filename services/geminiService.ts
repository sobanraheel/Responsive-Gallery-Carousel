
import { GoogleGenAI } from "@google/genai";
import { GalleryImage } from "../types";

export const generateGalleryTheme = async (prompt: string): Promise<GalleryImage[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use Gemini 3 Flash to brainstorm 8 specific scenes for a fuller carousel
  const brainstormResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Brainstorm exactly 8 vivid, cinematic image prompts and short descriptions based on the theme: "${prompt}". 
    Format the response as a JSON array of objects with "title", "prompt", and "description" keys.`,
    config: {
      responseMimeType: "application/json"
    }
  });

  const scenes = JSON.parse(brainstormResponse.text);
  const galleryItems: GalleryImage[] = [];

  // For each scene, generate an actual image using the Image Generation model
  // We process these in a loop to respect the 8-image requirement
  for (const scene of scenes) {
    try {
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: scene.prompt + " cinematic photography, ultra-realistic, 8k, highly detailed" }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      let imageUrl = "";
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        galleryItems.push({
          id: Math.random().toString(36).substr(2, 9),
          url: imageUrl,
          title: scene.title,
          description: scene.description,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error("Failed to generate image for scene:", scene.title, error);
    }
  }

  return galleryItems;
};
