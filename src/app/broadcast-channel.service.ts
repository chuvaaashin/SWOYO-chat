import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BroadcastChannelService {
  private channel: BroadcastChannel | null = null;

  constructor() {
    this.channel = new BroadcastChannel('chat-channel');

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'NEW_MESSAGE') {
        try {
          const parsedMessage = JSON.parse(event.data.message);
          this.channel?.postMessage(parsedMessage);
        } catch (error) {
          console.error('Ошибка парсинга JSON:', error);
        }
      }
    });
  }

  sendMessage(message: { username: string; text: string; time: string }) {
    const jsonMessage = JSON.stringify(message);
    if (this.channel) {
      this.channel.postMessage(jsonMessage);
    }

    navigator.serviceWorker.controller?.postMessage({
      type: 'NEW_MESSAGE',
      message: jsonMessage
    });
  }

  listenMessages(callback: (message: { username: string; text: string; time: string}) => void) {
    if (this.channel) {
      this.channel.onmessage = (event) => {
        try {
          const parsedMessage = JSON.parse(event.data);
          callback(parsedMessage);
        } catch (error) {
          console.error('Ошибка парсинга JSON:', error);
        }
      };
    }
  }

  closeChannel() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}
