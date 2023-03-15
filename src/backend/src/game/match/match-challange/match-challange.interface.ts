import { Socket, Server } from 'socket.io';

export interface MatchChallange {
  id_player1: number;
  id_player2: number;
  player1: Socket;
  player2: Socket;
  accept1: number;
  accept2: number;
  type: number;
}