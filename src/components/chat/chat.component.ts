import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { SpeechService } from '../../services/speech.service';
import { LegalDocumentService } from '../../services/legal-document.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';

interface ChatMessage {
  type: 'user' | 'bot' | 'image';
  text?: string;
  imageUrl?: SafeUrl;
  isThinking?: boolean;
  references?: string[];
  caseStrength?: string;
  documentsNeeded?: string[];
  isSpeaking?: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  template: `
    <div class="flex flex-col h-[calc(100vh-160px)] sm:h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] lg:h-[700px]">
      <!-- Chat Messages Display -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-md shadow-inner mb-4" #chatHistoryContainer>
        @for (message of messages(); track $index) {
          <div class="flex" [class.justify-end]="message.type === 'user'">
            <div class="p-3 rounded-lg shadow-md max-w-[80%]"
                 [ngClass]="{
                   'bg-indigo-100 text-indigo-900 border border-indigo-200': message.type === 'user',
                   'bg-white text-gray-800 border border-gray-200': message.type === 'bot',
                   'bg-gray-100 border border-gray-300': message.type === 'image'
                 }">
              @if (message.imageUrl) {
                <img [src]="message.imageUrl" alt="Uploaded image" class="max-w-xs h-auto rounded-md mb-2">
              }
              @if (message.text) {
                <p class="text-sm">{{ message.text }}</p>
              }
              @if (message.isThinking) {
                <div class="flex items-center text-gray-500 mt-1">
                  <svg class="animate-spin h-4 w-4 mr-2 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </div>
              }
              @if (message.isSpeaking) {
                <div class="flex items-center text-indigo-600 mt-1">
                  <svg class="h-4 w-4 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M9.383 3.033A1 1 0 0110 3v14a1 1 0 01-1.617.767l-5-4A1 1 0 013 13V7a1 1 0 01.383-.767l5-4zM16.5 7.5a1 1 0 00-1 1v3a1 1 0 001 1h.5a1 1 0 001-1v-3a1 1 0 00-1-1h-.5z" clip-rule="evenodd"></path>
                  </svg>
                  Speaking...
                </div>
              }
              @if (message.caseStrength || message.documentsNeeded?.length || message.references?.length) {
                <div class="mt-3 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                  @if (message.caseStrength) {
                    <p class="font-semibold text-indigo-800">Case Strength: <span class="font-normal">{{ message.caseStrength }}</span></p>
                  }
                  @if (message.documentsNeeded?.length) {
                    <p class="font-semibold text-indigo-800 mt-1">Documents Needed:</p>
                    <ul class="list-disc list-inside text-sm text-indigo-700">
                      @for (doc of message.documentsNeeded; track $index) {
                        <li>{{ doc }}</li>
                      }
                    </ul>
                  }
                  @if (message.references?.length) {
                    <p class="font-semibold text-indigo-800 mt-1">References:</p>
                    <ul class="list-disc list-inside text-sm text-indigo-700">
                      @for (ref of message.references; track $index) {
                        <li>{{ ref }}</li>
                      }
                    </ul>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Input Area -->
      <div class="flex items-center space-x-3 mt-4">
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" [(ngModel)]="thinkingMode" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          <span class="ml-3 text-sm font-medium text-gray-900">Thinking Mode (Complex Queries)</span>
        </label>
        
        <input
          #fileInput
          type="file"
          accept="image/*"
          (change)="onFileSelected($event)"
          class="hidden"
        />
        <button
          (click)="fileInput.click()"
          class="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
          title="Upload Image"
          [disabled]="isBotResponding()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </button>

        <input
          type="text"
          [(ngModel)]="userMessage"
          (keyup.enter)="sendMessage()"
          placeholder="Ask me about Indian legal codes..."
          class="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          [disabled]="isBotResponding()"
        />
        <button
          (click)="toggleVoiceInput()"
          [ngClass]="{
            'bg-red-500 hover:bg-red-600': isRecording(),
            'bg-green-500 hover:bg-green-600': !isRecording(),
            'opacity-50 cursor-not-allowed': isBotResponding()
          }"
          class="p-3 text-white rounded-full transition-colors duration-200"
          title="{{ isRecording() ? 'Stop Recording' : 'Start Recording' }}"
          [disabled]="isBotResponding()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            @if (isRecording()) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4z" />
            } @else {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a5 5 0 01-9.284-2.731C4.618 6.829 4 6.31 4 5a3 3 0 016-3h0a3 3 0 011 3v2.731a5 5 0 015.716 2.731H19V11z" />
            }
          </svg>
        </button>
        <button
          (click)="sendMessage()"
          class="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200"
          title="Send Message"
          [disabled]="!userMessage || isBotResponding()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  private geminiService = inject(GeminiService);
  private speechService = inject(SpeechService);
  private legalDocumentService = inject(LegalDocumentService);
  // Fix: Explicitly type `sanitizer` as `DomSanitizer`
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  userMessage = '';
  messages = signal<ChatMessage[]>([]);
  isRecording = signal(false);
  isBotResponding = signal(false);
  currentAudioPlayback: HTMLAudioElement | null = null;
  thinkingMode = signal(false);
  
  @ViewChild('chatHistoryContainer') private chatHistoryContainer!: ElementRef;

  constructor() {
    this.speechService.getRecognizedText().subscribe((text) => {
      if (text) {
        this.userMessage = text;
        this.sendMessage();
      }
    });

    this.speechService.getRecordingStatus().subscribe((status) => {
      this.isRecording.set(status);
    });
  }

  async sendMessage(): Promise<void> {
    const message = this.userMessage.trim();
    if (!message || this.isBotResponding()) {
      return;
    }

    this.messages.update(msgs => [...msgs, { type: 'user', text: message }]);
    this.userMessage = '';
    this.isBotResponding.set(true);

    const botMessage: ChatMessage = { type: 'bot', text: '', isThinking: true };
    this.messages.update(msgs => [...msgs, botMessage]);
    this.scrollToBottom();

    try {
      const chatHistory = this.messages().filter(msg => msg.type !== 'image').map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const relevantDocs = this.legalDocumentService.searchDocuments(message);
      const groundedPrompt = this.constructGroundedPrompt(message, relevantDocs);

      const response = await this.geminiService.chat(
        chatHistory,
        groundedPrompt,
        this.thinkingMode()
      );

      // Stream response chunks
      let fullResponseText = '';
      for await (const chunk of response) {
        fullResponseText += chunk.text;
        this.messages.update(msgs => {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg.type === 'bot' && lastMsg.isThinking) {
            lastMsg.text = fullResponseText;
            return [...msgs];
          }
          return msgs;
        });
        this.scrollToBottom();
      }

      // Final processing of the full response for legal analysis
      const legalAnalysis = await this.extractLegalAnalysis(fullResponseText);
      this.messages.update(msgs => {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg.type === 'bot') {
          lastMsg.text = legalAnalysis.response;
          lastMsg.references = legalAnalysis.references;
          lastMsg.documentsNeeded = legalAnalysis.documentsNeeded;
          lastMsg.caseStrength = legalAnalysis.caseStrength;
          lastMsg.isThinking = false;
        }
        return [...msgs];
      });

      await this.speakResponse(legalAnalysis.response);

    } catch (error) {
      console.error('Error sending message:', error);
      this.messages.update(msgs => {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg.type === 'bot') {
          lastMsg.text = 'Apologies, I encountered an error. Please try again or rephrase your query.';
          lastMsg.isThinking = false;
        }
        return [...msgs];
      });
      await this.speakResponse('Apologies, I encountered an error. Please try again or rephrase your query.');
    } finally {
      this.isBotResponding.set(false);
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || this.isBotResponding()) {
      return;
    }

    this.messages.update(msgs => [...msgs, { type: 'image', imageUrl: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)) }]);
    this.messages.update(msgs => [...msgs, { type: 'user', text: 'Analyze this image.' }]); // Add a default prompt
    this.userMessage = '';
    this.isBotResponding.set(true);

    const botMessage: ChatMessage = { type: 'bot', text: '', isThinking: true };
    this.messages.update(msgs => [...msgs, botMessage]);
    this.scrollToBottom();

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        const mimeType = file.type;

        const response = await this.geminiService.analyzeImage(
          'Analyze the uploaded image in the context of Indian legal frameworks. Identify any potential legal issues, relevant sections (from BNS, BNSS, BSA if applicable), suggest documents needed for court, and assess case strength based on what is visible in the image and relevant legal principles. Format the response as: \n**Legal Analysis:** [Analysis text]\n**Relevant Sections:** [Section numbers, e.g., BNS Section 123]\n**Documents Needed:** [List of documents]\n**Case Strength:** [Assessment]. If no legal issues are apparent, state so.',
          { mimeType, data: base64String.split(',')[1] }
        );

        const fullResponseText = response.text;
        const legalAnalysis = await this.extractLegalAnalysis(fullResponseText);
        
        this.messages.update(msgs => {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg.type === 'bot') {
            lastMsg.text = legalAnalysis.response;
            lastMsg.references = legalAnalysis.references;
            lastMsg.documentsNeeded = legalAnalysis.documentsNeeded;
            lastMsg.caseStrength = legalAnalysis.caseStrength;
            lastMsg.isThinking = false;
          }
          return [...msgs];
        });
        await this.speakResponse(legalAnalysis.response);
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      this.messages.update(msgs => {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg.type === 'bot') {
          lastMsg.text = 'Apologies, I encountered an error during image analysis. Please try again.';
          lastMsg.isThinking = false;
        }
        return [...msgs];
      });
      await this.speakResponse('Apologies, I encountered an error during image analysis. Please try again.');
    } finally {
      this.isBotResponding.set(false);
      (event.target as HTMLInputElement).value = ''; // Clear file input
    }
  }

  async toggleVoiceInput(): Promise<void> {
    if (this.isRecording()) {
      this.speechService.stopRecognition();
    } else {
      this.messages.update(msgs => [...msgs, { type: 'bot', text: 'Listening...', isSpeaking: true }]);
      this.scrollToBottom();
      this.speechService.startRecognition();
    }
  }

  private async speakResponse(text: string): Promise<void> {
    if (this.currentAudioPlayback) {
      this.currentAudioPlayback.pause();
      this.currentAudioPlayback.currentTime = 0;
    }
    this.messages.update(msgs => {
      const lastMsg = msgs[msgs.length - 1];
      if (lastMsg.type === 'bot') {
        lastMsg.isSpeaking = true;
      }
      return [...msgs];
    });
    this.currentAudioPlayback = await this.speechService.synthesizeSpeech(text);
    this.currentAudioPlayback.onended = () => {
      this.messages.update(msgs => {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg.type === 'bot') {
          lastMsg.isSpeaking = false;
        }
        return [...msgs];
      });
    };
  }

  private constructGroundedPrompt(userQuery: string, relevantDocs: string[]): string {
    let prompt = `You are an expert Indian Legal Bot. A user has described a situation and needs legal guidance.
    Based on the provided legal texts (Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA)), analyze the situation to:
    1. Identify the most relevant sections from these Sanhitas/Adhiniyam.
    2. List documents typically needed for court in such a case.
    3. Assess the case strength (e.g., 'Strong', 'Moderate', 'Weak', 'Requires more information').

    Provide your response in the following structured format, extracting information ONLY from the provided legal context and the user's situation. If certain information cannot be determined from the given context, state 'N/A' or 'Requires further information'.

    **Legal Analysis:** [Detailed analysis based on the situation and legal texts, explaining why certain sections are relevant.]
    **Relevant Sections:** [List section numbers and names, e.g., BNS Section 101 - Murder, BNSS Section 173 - Information in Cognizable Cases, BSA Section 104 - Burden of Proof]
    **Documents Needed:** [List specific documents, e.g., FIR Copy, Medical Report, Witness Statements, Property Documents.]
    **Case Strength:** [e.g., Strong, Moderate, Weak, Requires more information.]

    ---
    **User Situation:**
    ${userQuery}
    ---
    **Relevant Legal Text Snippets for Context (do not directly quote without attributing to section):**
    `;

    if (relevantDocs.length > 0) {
      relevantDocs.forEach(doc => {
        prompt += `\n${doc}\n`;
      });
    } else {
      prompt += `\nNo direct legal text snippets found for the keywords in your query. Rely on general legal knowledge of BNS, BNSS, BSA if the query is broad.\n`;
    }

    prompt += `\n---
    **Your Expert Legal Bot Response:**`;
    
    return prompt;
  }

  private async extractLegalAnalysis(fullResponse: string): Promise<{response: string, references: string[], documentsNeeded: string[], caseStrength: string}> {
    const analysisMatch = fullResponse.match(/\*\*Legal Analysis:\*\*\s*(.*?)(?=\*\*Relevant Sections:|$)/s);
    const sectionsMatch = fullResponse.match(/\*\*Relevant Sections:\*\*\s*(.*?)(?=\*\*Documents Needed:|$)/s);
    const documentsMatch = fullResponse.match(/\*\*Documents Needed:\*\*\s*(.*?)(?=\*\*Case Strength:|$)/s);
    const strengthMatch = fullResponse.match(/\*\*Case Strength:\*\*\s*(.*)/s);

    const analysis = analysisMatch ? analysisMatch[1].trim() : fullResponse.trim();
    const sections = sectionsMatch ? sectionsMatch[1].split(',').map(s => s.trim()).filter(s => s) : [];
    const documents = documentsMatch ? documentsMatch[1].split(',').map(d => d.trim()).filter(d => d) : [];
    const strength = strengthMatch ? strengthMatch[1].trim() : 'Requires more information';

    return {
      response: analysis,
      references: sections,
      documentsNeeded: documents,
      caseStrength: strength
    };
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.chatHistoryContainer.nativeElement.scrollTop = this.chatHistoryContainer.nativeElement.scrollHeight;
    }, 0);
  }
}