import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChatComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-900 to-indigo-700 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div class="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        <header class="bg-indigo-800 text-white p-4 sm:p-6 text-center shadow-md">
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Indian Legal Bot</h1>
          <p class="text-indigo-200 mt-2 text-base sm:text-lg">Your AI assistant for BNS, BNSS, and BSA.</p>
        </header>
        <main class="p-4 sm:p-6 md:p-8">
          <app-chat></app-chat>
        </main>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}