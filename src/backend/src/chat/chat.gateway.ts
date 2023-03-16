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

   @SubscribeMessage('joinRoomById')
   async onJoinRoomById(socket: Socket, room: RoomI) {
     console.log('chat gateway i enter to joinRoom');
     console.log('room is:');
     console.log(room);
     console.log('user id es:');
     console.log(socket.data.user)
     room = await this.roomService.joinRoomById(room, socket.data.user);
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

     //TODO: Send new Message to all joined Users of the room (currently online)
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

  // @SubscribeMessage('inviteGame')
  //  async onInviteGame(client: Socket, id_other: number) {
  //     console.log('inviteGame');
  //     const user2 = await this.userService.getById(id_other);
  //     if(!user2){
  //       this.server.to(client.id).emit('chat_error', "can't challanege: challanged user not found");
  //        return
  //     }
  //     const other_online = await this.onlineUserService.findByUser(user2);
  //     console.log('other_online');
  //     console.log(other_online);
  //     // if(other_online.length === 0){
  //     //   this.server.to(client.id).emit('chat_error', "can't challanege: challanged user not online in chat");
  //     //   return
  //     // }
  //     // if (this.checkClientInChallange(client)){
  //     //    this.server.to(client.id).emit('chat_error', "can't challanege: you have a open challange yet");
  //     //    return
  //     // }
  //     // if(this.checkUserInChallange(user2.id)){
  //     //    this.server.to(client.id).emit('chat_error', "can't challanege: target user is in a challange");
  //     //    return
  //     // }
  //     // this.server.to(client.id).emit('chat_error', "on invite game  3 steeps passeds");
  //     this.openChallenge(client, user2, other_online[0]);
  // }

  // @SubscribeMessage('acceptChallange')
  //  async onAcceptChallange(client: Socket) {
  //     console.log('acceptChallange');
  //     const challange_data = this.challanges.find(
  //       challenge =>
  //         challenge.id_player1 === client.data.user.id || challenge.id_player2 === client.data.user.id,
  //     );
  //     if (!challange_data) {
  //       return; // no challenge found for the user
  //     }

  //     console.log("in acceptChallange challange_data is:");
  //     console.log(challange_data);
      

  //     this.removeChallangesByUserId(challange_data.id_player1);
  //     // const player1 = await this.userService.getById(challange_data.id_player1);

  //     console.log("in acceptChallange challange_data.socketChallanger.data.user:");
  //     console.log(challange_data.socketChallanger.data.user);
  //     console.log("in acceptChallange client.data.user:");
  //     console.log(client.data.user);

  //     // console.log(`Starting match between ${player1.id} and ${client.data.user.id}`);
  //     const match = await this.matchService.createMatch(challange_data.socketChallanger.data.user as User, client.data.user as User);
  //     const message = 'You have been paired for a match';
  //     // this.server.to(player1).emit('matchmakingPair', match.id);
  //     client.emit('matchmakingPair', match.id);
  //     challange_data.socketChallanger.emit('matchmakingPair', match.id);
  //     await this.matchService.initMatch(match.id, challange_data.socketChallanger, client);
  //     this.matchService.gameLoop(match.id);
  // }

  // @SubscribeMessage('cancelChallange')
  //  async onCancelChallange(client: Socket, id: number) {
  //     console.log('cancelChallange');
  //     this.removeChallangesByUserId(client.data.user.id);
  // }

  // @SubscribeMessage('haveOpenChallange')
  //  async onHaveOpenChallange(client: Socket) {
  //     console.log('haveOpenChallange');
  //     const challange_data = this.challanges.some(
  //       challenge =>
  //         challenge.id_player1 === client.data.user.id || challenge.id_player2 === client.data.user.id,
  //     );
  //     this.server.to(client.id).emit('gameChallange', challange_data);
  // }

  // removeChallangesByUserId(userId: number): void {
  //  this.challanges = this.challanges.filter((c) => c.id_player1 != userId && c.id_player2 != userId);
  // }

  // checkUserInChallange(userId: number): boolean {
  //    return this.challanges.some(
  //      challenge =>
  //        challenge.id_player1 === userId || challenge.id_player2 === userId,
  //    );
  // }

  // checkClientInChallange(client: Socket): boolean {
  //    for (const challenge of this.challanges) {
  //      if (challenge.player1 === client.id || challenge.player2 === client.id) {
  //        return true;
  //      }
  //    }
  //    return false;
  // }

  // openChallenge(client: Socket, other_user: User, other_online: any) {
  //    // Create new challenge
  //    const challenge: MatchChallange = {
  //      id_player1: client.data.user.id,
  //      id_player2: other_user.id,
  //      player1: client.id,
  //      player2: other_online.socketId,
  //      name1: client.data.user.name,
  //      name2: other_user.name,
  //      accept1: 1,
  //      accept2: 0,
  //      type: 1,
  //      socketChallanger: client,
  //    };

  //    this.challanges.push(challenge);
  //    challenge.socketChallanger = null;
  //    this.server.to(client.id).emit('gameChallange', challenge);
  //    console.log('In open Challange the other socket is ' + other_online.socketId)
  //    this.server.to(other_online.socketId).emit('gameChallange', challenge);
  //    challenge.socketChallanger = client;
  //  }
}
