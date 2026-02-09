import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;
  private currentChatHistory: any[] = [];

  constructor() {
    // API key must be obtained exclusively from the environment variable process.env.API_KEY
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error('API_KEY environment variable is not set. Gemini API will not be available.');
      // Handle the absence of the API key gracefully, e.g., disable AI features.
      this.ai = null!; // Mark as null to prevent further API calls
    } else {
      this.ai = new GoogleGenAI({ apiKey });
      this.initializeChat();
    }
  }

  private initializeChat(): void {
    if (!this.ai) return;
    this.chatSession = this.ai.chats.create({
      model: 'gemini-2.5-flash', // Use Flash for general chat
      config: {
        // Omitting thinkingConfig for general chat for faster responses
      },
    });
    this.currentChatHistory = [];
  }

  async generateText(prompt: string, thinkingMode: boolean = false): Promise<GenerateContentResponse> {
    if (!this.ai) throw new Error('Gemini API is not initialized.');

    const model = thinkingMode ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
    const config: any = {};
    if (thinkingMode) {
      config.thinkingConfig = { thinkingBudget: 32768 }; // Max for gemini 3 pro
      // Do not set maxOutputTokens for thinking mode as per guidelines
    }

    const response = await this.ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: config,
    });
    return response;
  }

  async analyzeImage(prompt: string, imageData: { mimeType: string, data: string }): Promise<GenerateContentResponse> {
    if (!this.ai) throw new Error('Gemini API is not initialized.');

    const imagePart = {
      inlineData: {
        mimeType: imageData.mimeType,
        data: imageData.data,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Use a capable model for image analysis
      contents: { parts: [imagePart, textPart] },
      config: {
        thinkingConfig: { thinkingBudget: 32768 } // Enable thinking mode for potentially complex image analysis
      }
    });
    return response;
  }

  async chat(history: any[], newMessage: string, thinkingMode: boolean = false): Promise<AsyncIterable<GenerateContentResponse>> {
    if (!this.ai || !this.chatSession) {
      // Re-initialize chat session if null
      this.initializeChat();
      if (!this.chatSession) throw new Error('Gemini API chat session is not initialized.');
    }

    const model = thinkingMode ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
    if (this.chatSession.model !== model) {
       // If model changes, start a new chat session to apply the model change
       this.chatSession = this.ai.chats.create({ model: model });
       this.currentChatHistory = []; // Clear history as context is tied to model.
    }

    const config: any = {};
    if (thinkingMode) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    // Update internal chat history for context if it's the correct model
    if (this.chatSession.model === model) {
      this.currentChatHistory = history;
    } else {
      // If model switched, history is cleared, so only send the new message
      this.currentChatHistory = [{ role: 'user', parts: [{ text: newMessage }] }];
    }

    return this.chatSession.sendMessageStream(
      {
        message: newMessage,
        history: this.currentChatHistory, // Pass the entire history for context
      },
      config
    );
  }
}