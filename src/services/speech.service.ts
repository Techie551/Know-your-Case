import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// Removed GoogleGenAI import as it's not used for browser-native TTS
// import { GoogleGenAI } from '@google/genai';

declare const webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private recognition: any;
  private recognizedTextSubject = new Subject<string>();
  private recordingStatusSubject = new Subject<boolean>();
  // private ai: GoogleGenAI; // No longer needed for TTS

  isRecording = signal(false);

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-IN'; // Indian English

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.recognizedTextSubject.next(transcript);
        this.stopRecognition();
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.recordingStatusSubject.next(false);
      };

      this.recognition.onend = () => {
        this.recordingStatusSubject.next(false);
        this.isRecording.set(false);
      };
    } else {
      console.warn('Web Speech API (webkitSpeechRecognition) is not supported in this browser.');
    }

    // Gemini API key check is not needed here as it's not used for TTS.
    // The GeminiService handles its own API key initialization.
  }

  startRecognition(): void {
    if (this.recognition) {
      this.recognition.start();
      this.recordingStatusSubject.next(true);
      this.isRecording.set(true);
    }
  }

  stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.recordingStatusSubject.next(false);
      this.isRecording.set(false);
    }
  }

  getRecognizedText(): Observable<string> {
    return this.recognizedTextSubject.asObservable();
  }

  getRecordingStatus(): Observable<boolean> {
    return this.recordingStatusSubject.asObservable();
  }

  async synthesizeSpeech(text: string): Promise<HTMLAudioElement> {
    if (!('speechSynthesis' in window)) {
      console.warn('Web Speech API (SpeechSynthesis) is not supported in this browser.');
      throw new Error('Text-to-speech not supported.');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN'; // Set language for Indian English
      utterance.rate = 1; // You can adjust rate (0.1 to 10)
      utterance.pitch = 1; // You can adjust pitch (0 to 2)

      const voices = window.speechSynthesis.getVoices();
      // Try to find an Indian English voice, or a general English voice
      const indianVoice = voices.find(voice => voice.lang === 'en-IN');
      const englishVoice = voices.find(voice => voice.lang.startsWith('en-') && voice.name.includes('Google') || voice.default);
      
      if (indianVoice) {
        utterance.voice = indianVoice;
      } else if (englishVoice) {
        utterance.voice = englishVoice;
      }
      // If no specific voice is found, browser default will be used.

      utterance.onstart = () => {
        // This is where you might update an 'isSpeaking' signal in the component
        // For this service, we just resolve the promise after speech starts,
        // and the component handles its own signal based on this promise's lifecycle.
        console.log('Speech synthesis started.');
      };

      utterance.onend = () => {
        console.log('Speech synthesis ended.');
        // Create a dummy Audio element to satisfy the return type,
        // as native TTS doesn't return an HTMLAudioElement directly.
        // The component uses the promise resolution to toggle `isSpeaking`.
        resolve(new Audio());
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      // Ensure voices are loaded before trying to use them
      if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
              window.speechSynthesis.speak(utterance);
          };
      } else {
          window.speechSynthesis.speak(utterance);
      }
    });
  }
}