import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{

  rooms$ = this.chatService.getMyRooms();

  constructor(private chatService: ChatService){
  }

  ngOnInit()
  {
    this.chatService.createRoom();
    this.rooms$.subscribe(rooms => console.log(rooms));
  }
}
