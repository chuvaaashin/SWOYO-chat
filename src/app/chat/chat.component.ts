import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForOf } from '@angular/common';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {BroadcastChannelService} from '../broadcast-channel.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    MatFormField,
    MatInput
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  router = inject(Router);
  broadcastService = inject(BroadcastChannelService);

  storageMessages: {
    username: string;
    text: string;
    time: string;
  }[] = [];

  userName: string | null = '';
  checkStorageInterval: any;

  messageForm = new FormGroup({
    message: new FormControl('')
  });

  ngOnInit() {
    this.userName = localStorage.getItem('username');
    if (!this.userName) {
      this.router.navigate(['/login']);
    }

    this.loadMessagesFromStorage();

    this.broadcastService.listenMessages((message) => {
      this.handleNewMessage(message);
    });

    this.checkStorageInterval = setInterval(() => {
      this.loadMessagesFromStorage();
    }, 1000);
  }

  addMessage() {
    const message = this.messageForm.value.message;
    if (message && this.userName) {
      const newMessage = {
        text: message,
        username: this.userName,
        time: new Date().toLocaleTimeString(),
      };

      this.storageMessages.push(newMessage);
      this.saveMessagesToStorage();

      this.broadcastService.sendMessage(newMessage);

      this.messageForm.reset();
    }
  }

  ngOnDestroy() {
    if (this.checkStorageInterval) {
      clearInterval(this.checkStorageInterval);
    }

    this.broadcastService.closeChannel();
  }

  private loadMessagesFromStorage() {
    const savedMessages = localStorage.getItem('storageMessages');
    if (savedMessages) {
      this.storageMessages = JSON.parse(savedMessages);
    }
  }

  private saveMessagesToStorage() {
    localStorage.setItem('storageMessages', JSON.stringify(this.storageMessages));
  }

  private handleNewMessage(message: { username: string; text: string; time: string }) {
    this.storageMessages.push(message);
    this.saveMessagesToStorage();
  }
}
