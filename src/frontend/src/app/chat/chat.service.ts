import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CustomSocket } from '../sockets/custom-socket';
import { UserI } from "../user/user.interface";
import { RoomI, RoomPaginateI } from "./rooms/room.interface";


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

  getMyRooms() {
     return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  createRoom() {
    const user2: UserI = {
      id: 1
    }

    const room: RoomI = {
      name: 'testroom2',
      users: [user2]
    }

    this.socket.emit('createRoom', room);
  }
}