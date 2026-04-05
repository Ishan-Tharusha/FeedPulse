import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface GeminiAnalysis {
  category: 'Bug' | 'Feature Request' | 'Improvement' | 'Other';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  priority_score: number;
  summary: string;
  tags: string[];
}

export const analyzeFeedback = async (
  title: string,
  description: string
): Promise<GeminiAnalysis | null> => {
  try {
    const prompt = `Analyse this product feedback. Return ONLY valid JSON with these fields: category (Bug | Feature Request | Improvement | Other), sentiment (Positive | Neutral | Negative), priority_score (1-10), summary, tags (array of strings). 
    
    Feedback Title: ${title}
    Feedback Description: ${description}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from Gemini');
    
    // Extract JSON from response (sometimes Gemini wraps it in ```json ... ```)
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr) as GeminiAnalysis;
  } catch (error) {
    console.error('Error analyzing feedback with Gemini:', error);
    return null;
  }
};

export const generateWeeklySummary = async (feedbacks: any[]): Promise<string> => {
  try {
    const feedbackText = feedbacks
      .map((f, i) => `${i + 1}. Title: ${f.title}\nDescription: ${f.description}`)
      .join('\n\n');

    const prompt = `Summarise the following feedback theme from the last 7 days. Return the Top 3 themes. 
    
    All Feedbacks:
    ${feedbackText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return response.text || 'Could not generate AI summary at this time.';
  } catch (error) {
    console.error('Error generating weekly summary with Gemini:', error);
    return 'Could not generate AI summary at this time.';
  }
};
