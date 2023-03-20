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
import { MatchChallange } from '../game/match/match-challange/match-challange.interface';
import { MatchService } from '../game/match/match.service';
import { MatchEntity } from '../game/match/match.entity';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit{
  @WebSocketServer()
  server;

  title: string[] = [];
  challanges: MatchChallange[] = [];

  constructor(
      @InjectRepository(MatchEntity)
      private readonly matchRepository: Repository<MatchEntity>,
      private authService: AuthService,
      private userService: UserService,
      private roomService: RoomService,
      private onlineUserService: OnlineUserService,
      private joinedRoomService: JoinedRoomService,
      private matchService: MatchService,
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
        await this.userService.setUserOnlineById(user.id);
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }
   
  async handleDisconnect(socket: Socket) {
    // remove connection from DB
    this.userService.setUserOfflineById(socket.data.user.id);
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

     // Replace text of messages sent by blocked users with "Blocked"
     const blockedUsers = await this.userService.findBlockedUsers(socket.data.user.id);
     messages.items.forEach(message => {
       const isBlocked = blockedUsers.some(user => user.id === message.user.id);
       if (isBlocked) {
         message.text = "Blocked";
       }
     });

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


   //this.server.to(client.id).emit('chat_error', "can't challanege: challanged user not found");
   @SubscribeMessage('joinRoomById')
   async onJoinRoomById(socket: Socket, room: RoomI) {
     //Check if is num
     if(!isNaN(room.id))
     {
        //Check Password
        const target_room = await this.roomService.getRoomByIdWhitNoUsersRelation(room.id);
        if(target_room.password)
        {
            const is_valid = await this.roomService.checkRoomPassword(target_room.password, room.password)
            if(!is_valid)
            {
              this.server.to(socket.id).emit('chat_error', "can't join: invalid password");
              return;
            }
        }
       //All correct lets join and emit needed info =)
       room = await this.roomService.joinRoomById(room, socket.data.user);
       //get messages for this room
       const messages = await this.messageService.findMessagesForRoom(room, { limit: 10, page: 1 });
       messages.meta.currentPage = messages.meta.currentPage - 1;
       // Replace text of messages sent by blocked users with "Blocked"
       const blockedUsers = await this.userService.findBlockedUsers(socket.data.user.id);
       messages.items.forEach(message => {
         const isBlocked = blockedUsers.some(user => user.id === message.user.id);
         if (isBlocked) {
           message.text = "Blocked";
         }
       });
       // Save Connection to Room
       await this.joinedRoomService.join({ socketId: socket.id, user: socket.data.user, room });
       // Get User Rooms
       const rooms = await this.roomService.getRoomsForUser(socket.data.user.id, { page: 1, limit: 10 });
       //emit to user
       await this.server.to(socket.id).emit('rooms', rooms);
       await this.server.to(socket.id).emit('messages', messages);
     }
   }

   @SubscribeMessage('leaveRoom')
   async onLeaveRoom(socket: Socket) {
     // remove connection from JoinedRooms
     await this.joinedRoomService.deleteBySocketId(socket.id);
   }

   //TODO maybe close joined user too?
   @SubscribeMessage('closeChatRoom')
   async onCloseChatRoom(socket: Socket, roomID: number) {
     console.log('Backend: user pressed close channel-room ' + roomID);
     await this.roomService.userCloseChannel(socket.data.user, roomID); 
     const rooms = await this.roomService.getRoomsForUser(socket.data.user.id, { page: 1, limit: 10 });
     await this.server.to(socket.id).emit('rooms', rooms);
   }


   @SubscribeMessage('addMessage')
   async onAddMessage(socket: Socket, message: MessageI) {
     if (message.text.startsWith('/')) {
       this.processCommand(socket, message);
       return null;
     }
     const createdMessage: MessageI = await this.messageService.create({...message, user: socket.data.user});
     if(!createdMessage)
        return null;
     const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
     const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoomExcludingBlockedUser(room, socket.data.user.id);
     console.log('joined users to send message:');
     console.log(joinedUsers);

     const filteredJoinedUsers = joinedUsers.filter(
       (user) => !user.user.blocked_users.find((blockedUser) => blockedUser.id === socket.data.user.id)
     );
     for(const user of filteredJoinedUsers) {
       console.log('Inside the for');
       await this.server.to(user.socketId).emit('messageAdded', createdMessage);
     }
   }

   // @SubscribeMessage('addMessage')
   // async onAddMessage(socket: Socket, message: MessageI) {
   //   const createdMessage: MessageI = await this.messageService.create({...message, user: socket.data.user});
   //   if(!createdMessage)
   //      return null;
   //   const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
   //   const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room);
   //   console.log('joined users to send message:');
   //   console.log(joinedUsers);
   //   //TODO: Send new Message to all joined Users of the room (currently online)
   //   for(const user of joinedUsers) {
   //     console.log('Inside the for');
   //     await this.server.to(user.socketId).emit('messageAdded', createdMessage);
   //   }
   // }
   
  @SubscribeMessage('pvtMessage')
   async onPvtMessage(socket: Socket, id: number) {
      console.log('pvtMessage');
      console.log('Target user id is: + id');
      const target_user = await this.userService.getById(id);
      if(!target_user)
      {
          //Error target user not found;
          console.log("Target user not exist");
          return null;
      }
      if(target_user.id == socket.data.user.id)
      {
          console.log("You can t send private messages to yourself");
          return null;
      }
      //Create de pvtmsg channel if need: 
      const room = await this.roomService.preparePvtMessageRoom(socket.data.user, target_user);
      await this.joinedRoomService.join({ socketId: socket.id, user: socket.data.user, room });
      const messages = await this.messageService.findMessagesForRoom(room, { limit: 10, page: 1 });
      const rooms = await this.roomService.getRoomsForUser(socket.data.user.id, { page: 1, limit: 10 });
      await this.server.to(socket.id).emit('rooms', rooms);
      await this.server.to(socket.id).emit('messages', messages);


      // const joined_target_user = await this.joinedRoomService.findByUser(target_user);
      // if(joined_target_user)
      // {

      // }
      // console.log("User is not logged, and can t receive the private message");
  }
  

   private handleIncomingPageRequest(page: PageI) {
     page.limit = page.limit > 100 ? 100 : page.limit;
     // add page +1 to match angular material paginator
     page.page = page.page + 1;
     return page;
   }

   @SubscribeMessage('getPublicRooms')
   async onGetPublicRooms(socket: Socket) {
      console.log('getPublicRooms');
      const rooms = await this.roomService.getPublicRooms();
      console.log(rooms);
      await this.server.to(socket.id).emit('pub_rooms', rooms);
   }

   async processCommand(socket: Socket, message: MessageI) {
     console.log('IN processCommand: message is:');
     console.log(message);
     if (message.text.startsWith('/')) {
       const [command, ...args] = message.text.split(' ');
       switch (command) {
         case '/msg':
           console.log('The message is a CMD (private msj)');
           break;
         case '/ban':
           if (args.length == 1) {
             await this.roomService.opBanUserFromRoom(message.room, message.user, args[0]);
             return;
           }
           break;
         case '/mute':
           if (args.length == 1) {
             await this.roomService.opMuteUserFromRoom(message.room, args[0]);
             return;
           }
           break;
         case '/setpwd':
           if (args.length == 1) {
             await this.processCommandSetPwd(socket, message, args[0]);
             return;
           }
           break;
         case '/unsetpwd':
             await this.roomService.owUnsetPasswordRoom(message.room, message.user);
             return;
           break;
         case '/setop':
           if (args.length == 1) {
             await this.roomService.owSetUserAsOperator(message.room, message.user, args[0]);
             return;
           }
           break;
         case '/unsetop':
           if (args.length == 1) {
             await this.roomService.owUnsetUserAsOperator(message.room, message.user, args[0]);
             return;
           }
           break;
         case '/join':
           if (args.length == 1) {
             await this.roomService.usJoinRoom(message.user, args[0], "");
             return;
           }
           if (args.length == 2) {
             await this.roomService.usJoinRoom(message.user, args[0], args[1]);
             return;
           }
           break;
         default:
           // handle unknown command
           break;
       }
     }
   }

   async processCommandSetPwd(socket: Socket, message: MessageI, password: string) {
     const result = await this.roomService.owChangePasswordRoom(message.room, socket.data.user, password);
     if (result == 1) {
       this.server.to(socket.id).emit('chat_error', "You are not owner, you can't change the password");
       return;
     }
     if (result == 2) {
       this.server.to(socket.id).emit('chat_error', "Password format is incorrect");
       return;
     }

   }
}
