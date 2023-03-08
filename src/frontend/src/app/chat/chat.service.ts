import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CustomSocket } from '../sockets/custom-socket';
import { UserI } from "../user/user.interface";
import { RoomI, RoomPaginateI } from "./rooms/room.interface";
import { Observable } from 'rxjs';
//import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private socket: CustomSocket) {
    // const jwtToken = this.getCookieValue('crazy-pong');
    // console.log('The cookie valie in angular chat-service is:' + jwtToken);
    // this.socket.ioSocket.io.opts.query = { authorization: `Bearer ${jwtToken}` };
    // console.log('this.socket.ioSocket.io.opts.query:' + this.socket.ioSocket.io.opts.query);
  }
  // sendChat(message){
  //   this.socket.emit('chat', message);
  // }

  sendMessage() {

  }

  getMessage() {
    return this.socket.fromEvent('message');
  }

  getMyRooms(): Observable<RoomPaginateI> {
     return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms', {limit, page});
  }

  createRoom(room: RoomI) {
    this.socket.emit('createRoom', room);
  }
}