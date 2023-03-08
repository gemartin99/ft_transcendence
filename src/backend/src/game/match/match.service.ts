import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import { MatchEntity } from './match.entity';
import { MatchData } from './match-data/match-data.interface';
import { MatchUsers } from './match-users/match-users.interface';
import { Socket, Server } from 'socket.io';

@Injectable()
export class MatchService {
  private games: Map<number, MatchData> = new Map<number, MatchData>();
  private games_users: Map<number, MatchUsers> = new Map<number, MatchUsers>();

  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
  ) {}

  async createMatch(player1: User, player2: User): Promise<MatchEntity> {
    const newMatch = new MatchEntity();
    newMatch.status = 0;
    newMatch.player1 = player1;
    newMatch.player2 = player2;
    newMatch.player1Score = 0;
    newMatch.player2Score = 0;
    newMatch.winner = null;
    return await this.matchRepository.save(newMatch);
  }

  async initMatch(idMatch: number, player1: Socket, player2: Socket) {
    console.log('inside initMatch: ' + idMatch)
    const matchData: MatchData = {
      idMatch: idMatch,
      type: 1,
      player1: {
        id: player1.data.user.id,
        name: player1.data.user.name,
        input: 0,
      },
      player2: {
        id: player2.data.user.id,
        name: player2.data.user.name,
        input: 0,
      },
      ball: {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: 10,
      },
      paddle1: {
        x: 0,
        y: 0,
        width: 100,
        height: 10,
        vy: 0,
      },
      paddle2: {
        x: 0,
        y: 0,
        width: 100,
        height: 10,
        vy: 0,
      },
      score1: 0,
      score2: 0,
      isPaused: true,
      isGameOver: false,
    };

    const matchUsers: MatchUsers = {
      idMatch: idMatch,
      player1: player1,
      player2: player2,
      spectators: [],
    };
    this.games.set(idMatch, matchData);
    this.games_users.set(idMatch, matchUsers);

    // start the game loop or perform any other actions needed to initialize the match
  }

  async gameLoop(idMatch: number) {
    console.log('inside gameLoop: ' +  idMatch)
    let game = this.games.get(idMatch);
    let users = this.games_users.get(idMatch);
    const FRAME_RATE = 1000 / 60; // 60 frames per second

    if (!game || !users) {
      throw new Error(`Match with id ${idMatch} not found`);
    }

    game.isPaused = false;

    while (!game.isGameOver) {
      if (!game.isPaused) {
        game = this.games.get(idMatch);
        users = this.games_users.get(idMatch);
        // Update game state
        this.updateGameState(game);
        
        // Send game state to players
        // const gameState = this.getGameState(game);
        // if()

        users.player1.emit('gameState', game);
        users.player2.emit('gameState', game);
        // for (const spectator of users.spectators) {
        //   spectator.emit('gameState', gameState);
        // }
        // console.log('inside game loop of match: ' + game.idMatch)
      }

      // Wait for next frame
      await new Promise(resolve => setTimeout(resolve, FRAME_RATE));
    }

    // // Game is over, clean up
    // this.games.delete(matchId);
    // this.games-users.delete(matchId);
    // users.player1.leave(matchId);
    // users.player2.leave(matchId);
    // for (const spectator of users.spectators) {
    //   spectator.leave(matchId);
    // }
    // server.to(matchId).emit('gameOver', game);
  }

  updatePlayerInput(matchId: number, input: number, player: number)
  {
    console.log('Entering to updatePlayerInput');
    const matchData = this.games.get(matchId);
    if (matchData) {
      const playerData = player === 1 ? matchData.player1 : matchData.player2;
      playerData.input = input;
      console.log('The input has been modified in game ' + matchId + ' for player ' + player + ' whit value  ' + input);
    }
  }

  updateGameState(game: MatchData)
  {
    if (game.player1.input == 1) {
      game.paddle1.y += 1;
    }
    if (game.player2.input == 1) {
      game.paddle2.y += 1;
    }
    if (game.player1.input == -1) {
      game.paddle1.y -= 1;
    }
    if (game.player2.input == -1) {
      game.paddle2.y -= 1;
    }
  }
}



