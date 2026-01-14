
import { GoogleGenAI } from "@google/genai";
import { WeightEntry, BMIResult } from "../types";

export const getAIInsights = async (weights: WeightEntry[], bmi: BMIResult): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const weightHistory = weights.slice(0, 5).map(w => `${w.weight}kg em ${w.date}`).join(', ');
    
    const prompt = `
      Você é um assistente de saúde virtual motivacional e empático.
      Dados do usuário:
      - IMC Atual: ${bmi.value} (${bmi.category})
      - Últimas pesagens: ${weightHistory}
      
      Gere um único parágrafo curto (máximo 3 frases) com um insight sobre o progresso do usuário ou uma dica de saúde baseada no IMC. 
      Seja encorajador e evite termos médicos complexos. Responda em Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "Continue focado no seu progresso! Cada dia é uma nova oportunidade para cuidar da sua saúde.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Mantenha a constância! O mais importante é continuar monitorando seus hábitos.";
  }
};
