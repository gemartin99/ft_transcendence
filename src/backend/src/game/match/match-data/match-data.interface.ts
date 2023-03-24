import { Socket, Server } from 'socket.io';

export interface MatchData {
  idMatch: number;
  type: number;
  player1: {
    id: string;
    name: string;
    input: number;
  };
  player2: {
    id: string;
    name: string;
    input: number;
  };
  ball: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
  };
  paddle1: {
    x: number;
    y: number;
    width: number;
    height: number;
    vy: number;
  };
  paddle2: {
    x: number;
    y: number;
    width: number;
    height: number;
    vy: number;
  };
  score1: number;
  score2: number;
  speed: number;
  isPaused: boolean;
  isGameOver: boolean;
  winner: number;
}