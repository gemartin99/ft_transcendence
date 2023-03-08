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
import { UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { RoomService } from './rooms/room.service';
import { RoomI } from './rooms/room.interface';
import { PageI } from '../pagination/page.interface';
import { OnlineUserEntity } from '../onlineuser/onlineuser.entity';
import { OnlineUserI } from '../onlineuser/onlineuser.interface';
import { OnlineUserService } from '../onlineuser/onlineuser.service';
import { JoinedRoomService } from './joined-room/joined-room.service';
import { MessageService } from './message/message.service';
import { MessageI } from './message/message.interface';
import { JoinedRoomI } from './joined-room/joined-room.interface';


@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit{
  @WebSocketServer()
  server;

  title: string[] = [];

  constructor(
      private authService: AuthService,
      private userService: UserService,
      private roomService: RoomService,
      private onlineUserService: OnlineUserService,
      private joinedRoomService: JoinedRoomService,
      private messageService: MessageService
  ){}

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload:any): string{
  //   this.server.emit('message', 'test');
  // }

  async onModuleInit() {
    const general_room = await this.roomService.getRoomByName("General");
    if(!general_room)
    {
      await this.roomService.createGeneralRoom();
    }
    await this.onlineUserService.deleteAll();
    await this.joinedRoomService.deleteAll();
  }

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
        await this.roomService.JoinUserToGeneralRoom(user, socket);
        const rooms = await this.roomService.getRoomsForUser(user.id, {page: 1, limit: 10});
        //const rooms = await this.roomService.getAllRooms({page: 1, limit: 10});
        console.log('In Api trying to getRoomsForUser');
        //console.log('In Api trying to getAllRooms');
        console.log(rooms);
        // this.title.push('Value ' + Math.random().toString());
        // this.server.emit('message', this.title);
        rooms.meta.currentPage = rooms.meta.currentPage - 1;
        // Save connection to DB
        await this.onlineUserService.create({ socketId: socket.id, user });
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }
   
  async handleDisconnect(socket: Socket) {
    // remove connection from DB
    await this.onlineUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI)
  {
    // console.log('creator: ' + socket.data.user);
    // console.log('room: ' + room);
    await this.roomService.createRoom(room, socket.data.user);
    await this.joinedRoomService.join({ socketId: socket.id, user: socket.data.user, room });
    const rooms = await this.roomService.getRoomsForUser(socket.data.user.id, { page: 1, limit: 10 });
    // console.log('room for user: ' + rooms);    
    await this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('paginateRooms')
   async onPaginateRoom(socket: Socket, page: PageI) {
     const rooms = await this.roomService.getRoomsForUser(socket.data.user.id, this.handleIncomingPageRequest(page));
     rooms.meta.currentPage = rooms.meta.currentPage - 1;
     return this.server.to(socket.id).emit('rooms', rooms);
   }

   @SubscribeMessage('joinRoom')
   async onJoinRoom(socket: Socket, room: RoomI) {
     console.log('chat gateway i enter to joinRoom');
     console.log('room is:');
     console.log(room);
     console.log('user id es:');
     console.log(socket.data.user)
     room = await this.roomService.joinRoom(room, socket.data.user);
     const messages = await this.messageService.findMessagesForRoom(room, { limit: 10, page: 1 });
     console.log('I take room messajes');
     console.log(messages);
     messages.meta.currentPage = messages.meta.currentPage - 1;
     // Save Connection to Room
     console.log('Before this.joinedRoomService.create');
     await this.joinedRoomService.join({ socketId: socket.id, user: socket.data.user, room });
     console.log('After this.joinedRoomService.create');

     const rooms = await this.roomService.getRoomsForUser(socket.data.user.id, { page: 1, limit: 10 });
     // console.log('room for user: ' + rooms);    
     await this.server.to(socket.id).emit('rooms', rooms);
     // Send last messages from Room to User
     await this.server.to(socket.id).emit('messages', messages);
   }

   @SubscribeMessage('leaveRoom')
   async onLeaveRoom(socket: Socket) {
     // remove connection from JoinedRooms
     await this.joinedRoomService.deleteBySocketId(socket.id);
   }

   @SubscribeMessage('addMessage')
   async onAddMessage(socket: Socket, message: MessageI) {
     const createdMessage: MessageI = await this.messageService.create({...message, user: socket.data.user});
     if(!createdMessage)
        return null;
     const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
     const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room);
     console.log('joined users to send message:');
     console.log(joinedUsers);
     // TODO: Send new Message to all joined Users of the room (currently online)
     for(const user of joinedUsers) {
       console.log('Inside the for');
       await this.server.to(user.socketId).emit('messageAdded', createdMessage);
     }
   }

   private handleIncomingPageRequest(page: PageI) {
     page.limit = page.limit > 100 ? 100 : page.limit;
     // add page +1 to match angular material paginator
     page.page = page.page + 1;
     return page;
   }
}
