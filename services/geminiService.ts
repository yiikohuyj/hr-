
import { GoogleGenAI, Type } from "@google/genai";

/**
 * 使用 Gemini AI 生成創意的中文隊名。
 */
export const generateTeamNames = async (count: number, theme: string = "專業且具創意") => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `請為一個企業工作坊生成正好 ${count} 個極具創意的小組名稱。主題方向：${theme}。請以中文回傳，並僅回傳 JSON 字串陣列格式。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) {
      return Array.from({ length: count }, (_, i) => `第 ${i + 1} 小組`);
    }

    const names = JSON.parse(text.trim());
    return Array.isArray(names) ? names : Array.from({ length: count }, (_, i) => `第 ${i + 1} 小組`);
  } catch (error) {
    console.error("Gemini 生成隊名失敗:", error);
    return Array.from({ length: count }, (_, i) => `第 ${i + 1} 小組`);
  }
};
