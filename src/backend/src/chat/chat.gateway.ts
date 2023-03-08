// import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Socket, Server } from 'socket.io';


// @WebSocketGateway({ cors: true })
// export class ChatGateway
// {

//   @WebSocketServer()
//   server: Server;

//   @SubscribeMessage('sendMessage')
//   async handleSendMessage(client: Socket, payload: string): Promise<string> {
//       return 'hello world!!!!';
//   }
// }

// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// @WebSocketGateway({ cors: true })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server;
//   users: number = 0;
//   async handleConnection() {
//     // A client has connected
//     this.users++;
//     // Notify connected clients of current users
//     this.server.emit('users', this.users);
//   }
//   async handleDisconnect() {
//     // A client has disconnected
//     this.users--;
//     // Notify connected clients of current users
//     this.server.emit('users', this.users);
//   }
//   @SubscribeMessage('chat')
//   async onChat(client, message) {
//     client.broadcast.emit('chat', message);
//   }
// }

// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';

// @WebSocketGateway({ cors: true })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server;
//   users: number = 0;
//   messages: any[] = [];

//   async handleConnection() {
//     // A client has connected
//     this.users++;
//     // Notify connected clients of current users
//     this.server.emit('users', this.users);
//   }
//   async handleDisconnect() {
//     // A client has disconnected
//     this.users--;
//     // Notify connected clients of current users
//     this.server.emit('users', this.users);
//   }
//   @SubscribeMessage('chat')
//   async onChat(client, message) {
//     this.messages.push(message);
//     client.broadcast.emit('chat', message);
//   }
//   @SubscribeMessage('getMessages')
//   async getMessages(client) {
//     client.emit('previousMessages', this.messages);
//   }
// }

// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';

// @WebSocketGateway({ cors: true })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server;
//   users: number = 0;
//   messages: any[] = [];
//   userIds: any[] = [];

//   async handleConnection(client) {
//     // A client has connected
//     this.users++;
//     this.userIds.push(client.id);
//     // Notify connected clients of current users
//     this.server.emit('users', this.users);
//   }
//   async handleDisconnect(client) {
//     // A client has disconnected
//     this.users--;
//     const index = this.userIds.indexOf(client.id);
//     if (index !== -1) {
//       this.userIds.splice(index, 1);
//     }
//     // Notify connected clients of current users
//     this.server.emit('users', this.users);
//   }
//   @SubscribeMessage('chat')
//   async onChat(client, message) {
//     this.messages.push(message);
//     client.broadcast.emit('chat', message);
//   }
//   @SubscribeMessage('getMessages')
//   async getMessages(client) {
//     client.emit('previousMessages', this.messages);
//   }
// }


import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { AuthService } from '../auth/auth.service';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server;

  title: string[] = [];

  constructor(private authService: AuthService, private userService: UserService){}

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload:any): string{
  //   this.server.emit('message', 'test');
  // }

  async handleConnection(socket: Socket) {
    try {
      console.log('socket.handshake.headers.authorization es' + socket.handshake.headers.authorization);
      const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
      console.log('decoded token es' + decodedToken);
      const user = await this.userService.getBy42Id(decodedToken.thirdPartyId);
      console.log('user is found?' + user);
      if (!user) {
        return this.disconnect(socket);
      } else {
        this.title.push('Value ' + Math.random().toString());
        this.server.emit('message', this.title);
      }
    } catch {
      return this.disconnect(socket);
    }
  }
  
  async handleDisconnect() {
    console.log('On Disconnect');
    // // A client has disconnected
    // this.users--;
    // // Notify connected clients of current users
    // this.server.emit('users', this.users);
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
