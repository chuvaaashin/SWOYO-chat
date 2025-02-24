import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-chat',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    MatFormField,
    MatInput
  ],
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  storageMessages: {
    username: string, text: string
  }[] = []

  userName: string | null = '';

  messageForm = new FormGroup({
    message: new FormControl('')
  })

  ngOnInit() {
    this.userName = localStorage.getItem('username');

    const savedMessages = localStorage.getItem('storageMessages');
    if (savedMessages) {
      this.storageMessages = JSON.parse(savedMessages);
    }
  }

  addMessage() {
    const message = this.messageForm.value.message;
    if (message) {
      if (message && this.userName) {
        const newMessage = {text: message, username: this.userName};

        this.storageMessages.push(newMessage);

        this.messageForm.reset();
      }
    }
  }
}
