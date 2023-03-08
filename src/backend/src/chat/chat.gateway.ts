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
import { RoomService } from './rooms/room.service';
import { RoomI } from './rooms/room.interface';
import { PageI } from '../pagination/page.interface';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server;

  title: string[] = [];

  constructor(private authService: AuthService, private userService: UserService, private roomService: RoomService){}

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
        socket.data.user = user;
        const rooms = await this.roomService.getRoomsForUser(user.id, {page: 1, limit: 10});
        //const rooms = await this.roomService.getAllRooms({page: 1, limit: 10});
        console.log('In Api trying to getRoomsForUser');
        //console.log('In Api trying to getAllRooms');
        console.log(rooms);
        // this.title.push('Value ' + Math.random().toString());
        // this.server.emit('message', this.title);
        rooms.meta.currentPage = rooms.meta.currentPage - 1;
        return this.server.to(socket.id).emit('rooms', rooms);
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

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI): Promise<RoomI>
  {
    console.log('creator: ' + socket.data.user);
    console.log('room: ' + room);
    return this.roomService.createRoom(room, socket.data.user);
  }

  @SubscribeMessage('paginateRooms')
   async onPaginateRoom(socket: Socket, page: PageI) {
     page.limit = page.limit > 100 ? 100 : page.limit;
     // add page +1 to match angular material paginator
     page.page = page.page + 1;
     const rooms = await this.roomService.getRoomsForUser(socket.data.user.id, page);
     // substract page -1 to match the angular material paginator
     rooms.meta.currentPage = rooms.meta.currentPage - 1;
     return this.server.to(socket.id).emit('rooms', rooms);
   }
}
