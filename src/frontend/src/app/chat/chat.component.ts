import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  public users: number = 0;
  public message: string = '';
  public messages: string[] = [];

  constructor(private chatService: ChatService){
  }
  ngOnInit(){
    this.chatService.receiveChat().subscribe((message: string) => {
      this.messages.push(message);
    });
    this.chatService.getUsers().subscribe((users: number) => {
      this.users = users;
    });
  }
  addChat(){
    this.messages.push(this.message);
    this.chatService.sendChat(this.message);
    this.message = '';
  }

}
