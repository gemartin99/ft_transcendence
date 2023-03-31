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
import { MatchService } from './match/match.service';
import { User } from '../user/user.entity';
import { OnlineUserService } from '../onlineuser/onlineuser.service';
import { MatchChallange } from './match/match-challange/match-challange.interface';
import { MatchEntity } from './match/match.entity';




@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server;

  title: string[] = [];
  usersInQueue: Socket[] = [];
  challanges: MatchChallange[] = [];

  constructor(
      private authService: AuthService,
      private userService: UserService,
      private matchService: MatchService,
      private onlineUserService: OnlineUserService,
  ){}

  handleDisconnect(client: Socket) {
    //console.log(`Client disconnected: ${client.id}`);
    try{
        this.usersInQueue = this.usersInQueue.filter((socket) => socket.id != client.id);      
    }
    catch
    {
        //console.log('handleDisconect from game 1');
    }
    try{
        this.userService.setUserOfflineById(client.data.user.id);
    }
    catch
    {
        //console.log('handleDisconect from game 3');
    }
    // this.challanges = this.challanges.filter((socket) => socket.id != userId && c.player2 != userId);
  }

  @SubscribeMessage('joinMatchMaking')
  async joinMatchMaking(client: Socket, payload: any) {
    //console.log('Game Gateway!!!! joinMatchMaking');
    //console.log(client);
    //console.log(payload);

    // const isAlreadyInQueue = this.usersInQueue.some(user => user.id === client.id);
    // if (isAlreadyInQueue) {
    //   console.log(`Client ${client.id} is already in the queue`);
    //   return;
    // }
    const user_client = await this.userService.getById(client.data.user.id);
    if(user_client.is_playing == 0)
      return;

    this.usersInQueue.push(client);
    // Check if there are enough users in queue to start a match
    if (this.usersInQueue.length >= 2) {
      // Remove users from queue
      const player1 = this.usersInQueue.shift();
      const player2 = this.usersInQueue.shift();

      const match = await this.matchService.createMatch(player1.data.user as User, player2.data.user as User);
      // TODO: Start matchmaking process
      //console.log(`Starting match between ${player1.id} and ${player2.id}`);
      
      const user1 = await this.userService.getById(player1.data.user.id);
      const user2 = await this.userService.getById(player2.data.user.id);
      await this.userService.setUserOnline(user1);
      await this.userService.setUserOnline(user2);
      const message = 'You have been paired for a match';
      player1.emit('matchmakingPair', match.id);
      player2.emit('matchmakingPair', match.id);
      await this.matchService.initMatch(match.id, player1, player2);
      this.matchService.gameLoop(match.id);
    }
  }

  @SubscribeMessage('leaveMatchMaking')
  async leaveMatchmaking(client: Socket) {
    const index = this.usersInQueue.findIndex(user => user.id === client.id);
    if (index === -1) {
      //console.log(`Client ${client.id} is not in the queue`);
      return;
    }

    this.usersInQueue.splice(index, 1);
    //console.log(`Client ${client.id} has left the matchmaking queue`);
  }

  @SubscribeMessage('joinClientToMatch')
  async joinClientToMatch(client: Socket, matchId: number) {
    //console.log('In Game Gateway!!!! joinClientToMatch');
    //console.log('matchID joinClientToMatch ' + matchId);
    this.matchService.joinClientToMatch(client, matchId);
  }

  @SubscribeMessage('playerInput')
  async playerInput(client: Socket, input: { input: number[] }) { 
    //console.log('Game Gateway!!!! PlayerInput');
    //console.log(client.data);
    //console.log('Data array:', input.input);
    //this.matchService.updatePlayerInput(input.input[0], input.input[1], input.input[2]);
    this.matchService.updatePlayerInput(input.input[0],  input.input[1], client.data.user.id);
  }

  @SubscribeMessage('inviteGame')
   async onInviteGame(client: Socket, id_other: number) {
      console.log('inviteGame');
      const user2 = await this.userService.getById(id_other);
      if(!user2){
        this.server.to(client.id).emit('chat_error', "can't challanege: challanged user not found");
         return
      }
      const other_online = await this.onlineUserService.findByUser(user2);
      //console.log('other_online');
      //console.log(other_online);
      if(other_online.length === 0){
        this.server.to(client.id).emit('chat_error', "can't challanege: challanged user not online in chat");
        return
      }
      if (this.checkClientInChallange(client)){
         this.server.to(client.id).emit('chat_error', "can't challanege: you have a open challange yet");
         return
      }
      if(this.checkUserInChallange(user2.id)){
         this.server.to(client.id).emit('chat_error', "can't challanege: target user is in a challange");
         return
      }
      // this.server.to(client.id).emit('chat_error', "on invite game  3 steeps passeds");
      this.openChallenge(client, user2, other_online[0]);
  }

  @SubscribeMessage('acceptChallange')
   async onAcceptChallange(client: Socket) {
      console.log('acceptChallange');
      const challange_data = this.challanges.find(
        challenge =>
          challenge.id_player1 === client.data.user.id || challenge.id_player2 === client.data.user.id,
      );
      if (!challange_data) {
        return; // no challenge found for the user
      }

      //console.log("in acceptChallange challange_data is:");
      //console.log(challange_data);
      

      this.removeChallangesByUserId(challange_data.id_player1);
      // const player1 = await this.userService.getById(challange_data.id_player1);

      //console.log("in acceptChallange challange_data.socketChallanger.data.user:");
      //console.log(challange_data.socketChallanger.data.user);
      //console.log("in acceptChallange client.data.user:");
      //console.log(client.data.user);

      // console.log(`Starting match between ${player1.id} and ${client.data.user.id}`);
      const match = await this.matchService.createMatch(challange_data.socketChallanger.data.user as User, client.data.user as User);
      const message = 'You have been paired for a match';
      // this.server.to(player1).emit('matchmakingPair', match.id);
      client.emit('matchmakingPair', match.id);
      challange_data.socketChallanger.emit('matchmakingPair', match.id);
      await this.matchService.initMatch(match.id, challange_data.socketChallanger, client);
      this.matchService.gameLoop(match.id);
  }

  @SubscribeMessage('cancelChallange')
   async onCancelChallange(client: Socket, id: number) {
      //console.log('cancelChallange');
      const challange_data = this.challanges.find(
        challenge =>
          challenge.id_player1 === client.data.user.id || challenge.id_player2 === client.data.user.id,
      );
      if (!challange_data) {
        return; // no challenge found for the user
      }

      if(challange_data.id_player1 === client.data.user.id)
      {
        this.server.to(challange_data.player2).emit('gameChallange', null);
      }
      else if(challange_data.id_player2 === client.data.user.id)
      {
        this.server.to(challange_data.player1).emit('gameChallange', null);
      }
      this.removeChallangesByUserId(client.data.user.id);
  }

  @SubscribeMessage('haveOpenChallange')
   async onHaveOpenChallange(client: Socket) {
      //console.log('haveOpenChallange');
      const challange_data = this.challanges.some(
        challenge =>
          challenge.id_player1 === client.data.user.id || challenge.id_player2 === client.data.user.id,
      );
      this.server.to(client.id).emit('gameChallange', challange_data);
  }

  removeChallangesByUserId(userId: number): void {
   this.challanges = this.challanges.filter((c) => c.id_player1 != userId && c.id_player2 != userId);
  }

  checkUserInChallange(userId: number): boolean {
     return this.challanges.some(
       challenge =>
         challenge.id_player1 === userId || challenge.id_player2 === userId,
     );
  }

  checkClientInChallange(client: Socket): boolean {
     for (const challenge of this.challanges) {
       if (challenge.player1 === client.id || challenge.player2 === client.id) {
         return true;
       }
     }
     return false;
  }

  openChallenge(client: Socket, other_user: User, other_online: any) {
     // Create new challenge
     const challenge: MatchChallange = {
       id_player1: client.data.user.id,
       id_player2: other_user.id,
       player1: client.id,
       player2: other_online.socketId,
       name1: client.data.user.name,
       name2: other_user.name,
       accept1: 1,
       accept2: 0,
       type: 1,
       socketChallanger: client,
     };

     this.challanges.push(challenge);
     challenge.socketChallanger = null;
     this.server.to(client.id).emit('gameChallange', challenge);
     //console.log('In open Challange the other socket is ' + other_online.socketId)
     this.server.to(other_online.socketId).emit('gameChallange', challenge);
     challenge.socketChallanger = client;
   }
}

