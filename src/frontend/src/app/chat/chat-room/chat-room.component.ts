import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MessagePaginateI } from '../message/message.interface';
import { RoomI } from '../rooms/room.interface';
import { ChatService } from '../chat.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomSocket } from '../../sockets/custom-socket';



@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnChanges, OnDestroy, AfterViewInit {

  @Input() chatRoom: RoomI;
  error_string = null;
  @ViewChild('messages') private messagesScroller: ElementRef;

  // messages$: Observable<MessagePaginateI> = this.chatService.getMessages().pipe(
  //   map((messagePaginate: MessagePaginateI) => {
  //     const items = messagePaginate.items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  //     messagePaginate.items = items;
  //     return messagePaginate;
  //   })
  // );
  messagesPaginate$: Observable<MessagePaginateI> = combineLatest([this.chatService.getMessages(), this.chatService.getAddedMessage().pipe(startWith(null))]).pipe(
    map(([messagePaginate, message]) => {
      if (message && message.room.id === this.chatRoom.id && !messagePaginate.items.some(m => m.id === message.id)) {
        messagePaginate.items.push(message);
      }
      const items = messagePaginate.items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      messagePaginate.items = items;
      return messagePaginate;
    }),
    tap(() => this.scrollToBottom())
  )

  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  constructor(private chatService: ChatService,
              private socket: CustomSocket) { }

  ngOnInit() {
    this.socket.on('chat_error', (errorMessage: string) => {
      console.log('chat error received');
      this.error_string = errorMessage;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.chatService.leaveRoom(changes['chatRoom'].previousValue);
    if(this.chatRoom) {
      this.chatService.joinRoom(this.chatRoom);
    }
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }


  ngOnDestroy() {
    this.chatService.leaveRoom(this.chatRoom);
  }

  sendMessage() {
    this.error_string = null;
    this.chatService.sendMessage({text: this.chatMessage.value, room: this.chatRoom});
    this.chatMessage.reset();
  }

  closeRoom(roomID: number) {
    console.log("User want to close channel");
    this.chatService.closeChatRoom(roomID);
  }

  // scrollToBottom(): void {
  //   setTimeout(() => {this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight}, 1);
  // }
  scrollToBottom(): void {
    if (this.messagesScroller) {
      setTimeout(() => {
        this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight
      }, 1);
    }
  }
}