import { Component, OnInit } from '@angular/core';
import {Message,ChatService} from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  messages: Message[] = [];
  value: string;

  constructor(public chatService: ChatService) { }

  ngOnInit() {
    this.chatService.conversation.subscribe((val) => {
    this.messages = this.messages.concat(val);
  });
  setTimeout( this.hideNotification, 5000);
}

sendMessage() {
  this.chatService.getBotAnswer(this.value);
  this.value = '';
}

openForm() {
  document.getElementById("chat-box").style.display = "block";
  this.welcomeMessage();
}

closeForm() {
  document.getElementById("chat-box").style.display = "none";
}

welcomeMessage(){
  this.value = 'Hola.';
  this.chatService.getBotAnswer(this.value);
  this.value = '';
}

options(content: any){
  this.value = content;
  this.chatService.getBotAnswer(this.value);
  this.value = '';
}

hideNotification(){
  document.getElementById("notification").style.display = "none";
}


}
