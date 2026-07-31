import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type MessageRole = 'assistant' | 'user';

interface ChatMessage {
  id: number;
  role: MessageRole;
  author: string;
  content: string;
  createdAt: Date;
}

interface ChatResponse {
  reply: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/chat';
  private nextMessageId = 2;

  protected draft = '';
  protected readonly isLoading = signal(false);
  protected readonly status = signal('');
  protected readonly hasError = signal(false);
  protected readonly messages = signal<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      author: 'Assistente',
      content: 'Olá! Envie uma pergunta sobre o sistem LUERP',
      createdAt: new Date(),
    },
  ]);

  protected sendMessage(): void {
    const message = this.draft.trim();
    if (!message || this.isLoading()) {
      return;
    }

    this.addMessage('user', 'Você', message);
    this.draft = '';
    this.isLoading.set(true);
    this.hasError.set(false);
    this.status.set('Consultando o modelo...');

    this.http.post<ChatResponse>(this.apiUrl, { message }).subscribe({
      next: (response) => {
        this.addMessage('assistant', 'Assistente', response.reply || 'A API retornou uma resposta vazia.');
        this.status.set('');
      },
      error: () => {
        this.hasError.set(true);
        this.status.set('Não foi possível conectar ao backend. Verifique se ele está rodando na porta 8080.');
        this.addMessage('assistant', 'Assistente', 'Tive um problema ao buscar a resposta. Tente novamente em instantes.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  protected submitWithEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  protected formatMessage(content: string): string {
    const normalized = content
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      .trim();

    const formatted = this.escapeHtml(normalized)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    return formatted
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  private addMessage(role: MessageRole, author: string, content: string): void {
    this.messages.update((messages) => [
      ...messages,
      {
        id: this.nextMessageId++,
        role,
        author,
        content,
        createdAt: new Date(),
      },
    ]);
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
