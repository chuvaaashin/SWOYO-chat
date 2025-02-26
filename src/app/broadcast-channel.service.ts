import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface ChatMessage {
  username: string;
  text: string;
  time: string;
}

@Injectable({
  providedIn: 'root',
})
export class BroadcastChannelService implements OnDestroy {
  private channel: BroadcastChannel;
  private messageSubject = new BehaviorSubject<ChatMessage | null>(null);
  public messages$: Observable<ChatMessage | null> = this.messageSubject.asObservable();

  constructor() {
    this.channel = new BroadcastChannel('chat-channel');
    this.channel.onmessage = (event) => {
      try {
        const parsedMessage: ChatMessage = JSON.parse(event.data);
        this.messageSubject.next(parsedMessage);
      } catch (error) {
        console.error('Ошибка парсинга JSON:', error);
      }
    };
  }

  sendMessage(message: ChatMessage) {
    const jsonMessage = JSON.stringify(message);
    this.channel.postMessage(jsonMessage);
  }

  listenMessages(callback: (message: ChatMessage) => void) {
    this.messages$.subscribe((message) => {
      if (message) callback(message);
    });
  }

  closeChannel() {
    this.channel.close();
  }

  ngOnDestroy(): void {
    this.closeChannel();
  }
}
