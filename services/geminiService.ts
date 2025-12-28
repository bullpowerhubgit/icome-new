import { GoogleGenAI, Type, Modality, FunctionDeclaration, VideoGenerationReferenceType } from "@google/genai";

// Definition von Tools für Function Calling
const controlTools: FunctionDeclaration[] = [
  {
    name: 'get_agent_telemetry',
    parameters: {
      type: Type.OBJECT,
      description: 'Ruft aktuelle Telemetriedaten eines spezifischen Agenten ab.',
      properties: {
        agentId: {
          type: Type.STRING,
          description: 'Die ID des Agenten (z.B. agent-1)',
        },
        metric: {
          type: Type.STRING,
          description: 'Die gewünschte Metrik: "yield", "uptime" oder "load"',
        },
      },
      required: ['agentId', 'metric'],
    },
  },
];

class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getChatResponse(
    prompt: string, 
    history: any[], 
    options: { 
      mode?: 'fast' | 'balanced' | 'thinking',
      files?: { data: string; mimeType: string }[],
      useSearch?: boolean,
      useMaps?: boolean,
      location?: { latitude: number; longitude: number }
    } = {}
  ) {
    const ai = this.getAI();
    let modelName = 'gemini-3-flash-preview';
    if (options.mode === 'fast') modelName = 'gemini-flash-lite-latest';
    if (options.mode === 'thinking') modelName = 'gemini-3-pro-preview';
    
    const parts = options.files?.map(f => ({
      inlineData: { data: f.data, mimeType: f.mimeType }
    })) || [];
    
    parts.push({ text: prompt } as any);

    const tools: any[] = [];
    if (options.useSearch) tools.push({ googleSearch: {} });
    if (options.useMaps) tools.push({ googleMaps: {} });
    
    // Aktiviere Function Calling Tools
    tools.push({ functionDeclarations: controlTools });

    const config: any = {
      tools,
      toolConfig: options.location ? {
        retrievalConfig: {
          latLng: options.location
        }
      } : undefined,
      systemInstruction: "You are the Nexus Intelligence Core. You specialize in data analysis, API orchestration, and agent management. If the user provides JSON or API data, perform a professional audit. Use the provided tools if the user asks for specific agent telemetry."
    };

    if (options.mode === 'thinking') {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    try {
      const finalModel = options.useMaps ? 'gemini-2.5-flash' : modelName;
      const response = await ai.models.generateContent({
        model: finalModel,
        contents: [...history, { role: 'user', parts }],
        config
      });
      
      return {
        text: response.text || "",
        functionCalls: response.functionCalls,
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      };
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }

  async auditAgentCode(code: string, agentName: string) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: `Audit the following agent logic for ${agentName}. Evaluate its efficiency and yield potential. Return the results in JSON format. Code:\n${code}` }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              efficiencyScore: { type: Type.NUMBER },
              yieldForecast: { type: Type.NUMBER },
              newDescription: { type: Type.STRING }
            },
            required: ["efficiencyScore", "yieldForecast", "newDescription"]
          }
        }
      });
      const text = response.text;
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Audit Error:", error);
      return null;
    }
  }

  async transcribeAudio(audioBase64: string, mimeType: string) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: audioBase64, mimeType } },
            { text: "Transcribe audio." }
          ]
        }
      });
      return response.text || "";
    } catch (error) {
      return "";
    }
  }

  async generateImage(prompt: string, config: { aspectRatio: string; size: string }) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          imageConfig: { aspectRatio: config.aspectRatio as any, imageSize: config.size as any }
        }
      });
      // Iterate through parts to find the image part, do not assume it is the first part.
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    } catch (error) { throw error; }
  }

  async editImage(prompt: string, base64Image: string, mimeType: string) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ inlineData: { data: base64Image, mimeType } }, { text: prompt }]
        }
      });
      // Iterate through parts to find the image part, do not assume it is the first part.
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    } catch (error) { throw error; }
  }

  async generateVideo(prompt: string, aspectRatio: '16:9' | '9:16', options: { 
    images?: { data: string, mimeType: string }[], 
    extendVideo?: any 
  } = {}) {
    const ai = this.getAI();
    try {
      const config: any = { numberOfVideos: 1, resolution: '720p', aspectRatio };
      let payload: any = {
        model: options.images && options.images.length > 1 ? 'veo-3.1-generate-preview' : 'veo-3.1-fast-generate-preview',
        prompt,
        config
      };
      if (options.extendVideo) {
        payload.video = options.extendVideo;
        payload.model = 'veo-3.1-generate-preview';
      } else if (options.images && options.images.length > 0) {
        if (options.images.length === 1) {
          payload.image = { imageBytes: options.images[0].data, mimeType: options.images[0].mimeType };
        } else {
          config.referenceImages = options.images.map(img => ({
            image: { imageBytes: img.data, mimeType: img.mimeType },
            referenceType: VideoGenerationReferenceType.ASSET
          }));
          config.aspectRatio = '16:9';
          config.resolution = '720p'; // Mandatory for multi-reference images.
          payload.model = 'veo-3.1-generate-preview';
        }
      }
      let operation = await ai.models.generateVideos(payload);
      while (!operation.done) {
        await new Promise(r => setTimeout(r, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await res.blob();
      return { url: URL.createObjectURL(blob), videoData: operation.response?.generatedVideos?.[0]?.video };
    } catch (error) { throw error; }
  }
}

export const geminiService = new GeminiService();