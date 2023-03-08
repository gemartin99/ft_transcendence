import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CustomSocket } from '../sockets/custom-socket';


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

  // getCookieValue(cookieName: string): string {
  //   const cookieString = document.cookie;
  //   const cookieArray = cookieString.split(';');
  //   for (const cookie of cookieArray) {
  //     const cookieParts = cookie.split('=');
  //     const name = cookieParts[0].trim();
  //     if (name === cookieName) {
  //       return cookieParts[1];
  //     }
  //   }
  //   return '';
  // }
}