import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit{

  rooms$ = this.chatService.getMyRooms();
  selectedRoom = null;

  constructor(private chatService: ChatService){
  }

  ngOnInit()
  {
    // this.chatService.createRoom();
    this.rooms$.subscribe(rooms => console.log(rooms));
  }

  ngAfterViewInit() {
    this.chatService.emitPaginateRooms(10, 0);
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }
}
