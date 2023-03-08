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



@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server;

  title: string[] = [];
  usersInQueue: Socket[] = [];

  constructor(
      private authService: AuthService,
      private userService: UserService,
      private matchService: MatchService,
  ){}

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.usersInQueue = this.usersInQueue.filter((socket) => socket.id !== client.id);
  }

  @SubscribeMessage('joinMatchMaking')
  async joinMatchMaking(client: Socket, payload: any) {
    console.log('Game Gateway!!!! joinMatchMaking');
    console.log(client);
    console.log(payload);

    // const isAlreadyInQueue = this.usersInQueue.some(user => user.id === client.id);
    // if (isAlreadyInQueue) {
    //   console.log(`Client ${client.id} is already in the queue`);
    //   return;
    // }

    this.usersInQueue.push(client);
    // Check if there are enough users in queue to start a match
    if (this.usersInQueue.length >= 2) {
      // Remove users from queue
      const player1 = this.usersInQueue.shift();
      const player2 = this.usersInQueue.shift();

      const match = await this.matchService.createMatch(player1.data.user as User, player2.data.user as User);
      // TODO: Start matchmaking process
      console.log(`Starting match between ${player1.id} and ${player2.id}`);
      const message = 'You have been paired for a match';
      player1.emit('matchmakingPair', match.id);
      player2.emit('matchmakingPair', match.id);
      await this.matchService.initMatch(match.id, player1, player2);
      this.matchService.gameLoop(match.id);
    }
  }

  @SubscribeMessage('playerInput')
  async playerInput(client: Socket, input: { input: number[] }) { 
    console.log('Game Gateway!!!! PlayerInput');
    //console.log(client.data);
    console.log('Data array:', input.input);
    this.matchService.updatePlayerInput(input.input[0], input.input[1], input.input[2]);
  }
}

