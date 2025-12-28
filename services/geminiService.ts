
import { GoogleGenAI, Type, Modality, FunctionDeclaration } from "@google/genai";

class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async transcribeAudio(base64: string, mimeType: string) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { inlineData: { data: base64, mimeType } },
              { text: "Transcribe the provided audio into text exactly as spoken." }
            ]
          }
        ]
      });
      return response.text || "";
    } catch (e) {
      console.error("Transcription error", e);
      return "";
    }
  }

  async getChatResponse(input: string, history: any[], options: any = {}) {
    const ai = this.getAI();
    const { mode, files, useSearch, useMaps, location } = options;

    let modelName = 'gemini-3-pro-preview';
    let config: any = {};

    if (mode === 'thinking') {
      config.thinkingConfig = { thinkingBudget: 32768 };
    } else if (mode === 'fast') {
      modelName = 'gemini-3-flash-preview';
    }

    if (useMaps) {
      modelName = 'gemini-2.5-flash-lite-latest';
      config.tools = [{ googleMaps: {} }];
      if (location) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        };
      }
    } else if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const userParts: any[] = [{ text: input }];
    if (files && files.length > 0) {
      files.forEach((f: any) => {
        userParts.push({ inlineData: { data: f.data, mimeType: f.mimeType } });
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [...history, { role: 'user', parts: userParts }],
        config
      });

      return {
        text: response.text || "",
        functionCalls: response.functionCalls,
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      };
    } catch (e) {
      console.error("Chat Error", e);
      throw e;
    }
  }

  async generateImage(prompt: string, options: any = {}) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: options.aspectRatio || "1:1",
            imageSize: options.size || "1K"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (e) {
      console.error("Image generation error", e);
      return null;
    }
  }

  async editImage(prompt: string, base64: string, mimeType: string) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64, mimeType } },
            { text: prompt }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (e) {
      console.error("Image edit error", e);
      return null;
    }
  }

  async generateVideo(prompt: string, aspectRatio: '16:9' | '9:16', options: any = {}) {
    const ai = this.getAI();
    try {
      let operation;
      if (options.extendVideo && options.extendVideo.uri) {
        operation = await ai.models.generateVideos({
          model: 'veo-3.1-generate-preview',
          prompt: prompt || 'Continue this scene beautifully',
          video: options.extendVideo,
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
          }
        });
      } else {
        const referenceImages: any[] = [];
        if (options.images && options.images.length > 0) {
          options.images.slice(0, 3).forEach((img: any) => {
            referenceImages.push({
              image: { imageBytes: img.data, mimeType: img.mimeType },
              referenceType: 'ASSET'
            });
          });
        }

        operation = await ai.models.generateVideos({
          model: referenceImages.length > 0 ? 'veo-3.1-generate-preview' : 'veo-3.1-fast-generate-preview',
          prompt: prompt,
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio,
            ...(referenceImages.length > 0 ? { referenceImages } : {})
          }
        });
      }

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      const videoData = operation.response?.generatedVideos?.[0]?.video;
      const downloadLink = videoData?.uri;
      const finalUrl = `${downloadLink}&key=${process.env.API_KEY}`;
      return { url: finalUrl, videoData };
    } catch (e) {
      console.error("Video generation error", e);
      throw e;
    }
  }

  async generateListingMetadata(productName: string, description: string, price: number, niche: string) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          parts: [{
            text: `Generate SEO listing metadata for the following product: ${productName}. Description: ${description}. Price: ${price}. Niche: ${niche}. 
            Provide optimized titles, descriptions, and tags for both Gumroad and Etsy.`
          }]
        }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              gumroad: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              etsy: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Listing metadata generation error", e);
      return null;
    }
  }

  async generateLegalDocument(type: 'Privacy' | 'Terms' | 'Imprint', userData: any) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: `Draft a professional, legally binding ${type} Policy for a digital business. Business Owner: ${userData.name}, Address: ${userData.address}, Email: ${userData.email}. Ensure compliance with GDPR and international digital commerce laws.` }] }]
      });
      return response.text || "Failed to generate legal document.";
    } catch (e) { return "Error: " + e; }
  }

  async scanArbitrage() {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: "Simulate a market scan for digital or physical arbitrage. Identify 3 realistic opportunities with 'Source Price', 'Target Price', and 'Estimated Profit Margin'. Return as JSON." }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING },
                source: { type: Type.STRING },
                buy: { type: Type.NUMBER },
                sell: { type: Type.NUMBER },
                profit: { type: Type.NUMBER },
                confidence: { type: Type.NUMBER }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (e) { return []; }
  }

  async authorChapter(title: string, bookTitle: string, niche: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Write a high-quality 400-word chapter for "${bookTitle}" titled "${title}". Niche: ${niche}.` }] }]
    });
    return response.text || "";
  }

  async performGapAnalysis(niche: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ parts: [{ text: `Gap analysis for ${niche}. JSON format.` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            opportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  productName: { type: Type.STRING },
                  margin: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  }

  async forgeOmniProduct(niche: string, type: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Forge ${type} for ${niche}. JSON.` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            price: { type: Type.NUMBER },
            outline: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  }

  async generateMockup(prompt: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }
}

export const geminiService = new GeminiService();
