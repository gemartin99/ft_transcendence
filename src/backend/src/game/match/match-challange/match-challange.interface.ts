import { Socket, Server } from 'socket.io';

export interface MatchChallange {
  id_player1: number;
  id_player2: number;
  name1: string;
  name2: string;
  player1: string;
  player2: string;
  accept1: number;
  accept2: number;
  type: number;
  socketChallanger: Socket;
}