import { Socket, Server } from 'socket.io';

export interface MatchUsers {
  idMatch: number;
  player1: Socket;
  player2: Socket;
  spectators: Socket[];
}