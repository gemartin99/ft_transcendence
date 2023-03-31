import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { MatchEntity } from './match.entity';
import { MatchData } from './match-data/match-data.interface';
import { MatchUsers } from './match-users/match-users.interface';
import { Socket, Server } from 'socket.io';
import { ArchivementsService } from '../../archivements/archivements.service';

@Injectable()
export class MatchService {
  private games: Map<number, MatchData> = new Map<number, MatchData>();
  private games_users: Map<number, MatchUsers> = new Map<number, MatchUsers>();

  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
    private userService: UserService,
    private archivementsService: ArchivementsService,
  ) {}

  async createMatch(player1: User, player2: User): Promise<MatchEntity> {
    console.log("INSIDE CREATE MATCH!!!!!!!!!:");
    const newMatch = new MatchEntity();
    newMatch.status = 0;
    newMatch.player1 = player1;
    newMatch.player2 = player2;
    newMatch.player1Score = 0;
    newMatch.player2Score = 0;
    newMatch.winner = null;
    return await this.matchRepository.save(newMatch);
  }

  async saveMatchResult(game: MatchData)
  {
    console.log('IN SAVING MATCH DATA');
    console.log(game);
    // Retrieve the match entity from the database
    const match = await this.matchRepository.findOne({
      where: { id: game.idMatch }
    });

    if (match) {
      //Get players
      const player1 = await this.userService.getById(parseInt(game.player1.id));
      const player2 = await this.userService.getById(parseInt(game.player2.id));
      
      // Update the match entity with the new scores and winner
      match.player1Score = game.score1;
      match.player2Score = game.score2;
      if(match.player1Score > match.player2Score)
      {
         console.log('Player1 has won: ' + game.player1.name);
         match.winner = parseInt(game.player1.id);
         player1.score += (100 + game.score1);
         player2.score += 10;
         player1.wins += 1;
         player2.losses += 1;
      }
      else if(match.player2Score > match.player1Score)
      {
         console.log('Player2 has won: ' + game.player2.name);
         match.winner = parseInt(game.player2.id);
         player2.score += (100 + game.score2);
         player1.score += (10 + game.score1);
         player2.wins += 1;
         player1.losses += 1;
      }
      else
        match.winner = 0;
      match.status = 1;
      // Save the updated match entity back to the database
      await this.matchRepository.save(match);

      player1.is_playing = 0;
      player2.is_playing = 0;
      player1.played += 1;
      player2.played += 1;
      await this.userService.save(player1);
      await this.userService.save(player2);
      await this.archivementsService.updateArchivements(game, player1, player2);
    }
  }

  async joinClientToMatch(client: Socket, matchId: number) {
    // Check if the match exists in the games map
    if (this.games.has(matchId)) {
      const game = this.games.get(matchId);

      // Check if the client is one of the players
      if (game.player1.id === client.id || game.player2.id === client.id) {
        // If the client is a player, update the corresponding player socket in the games_users map
        const matchUsers = this.games_users.get(matchId);
        if (game.player1.id === client.id) {
          
          matchUsers.player1 = client;
        } else {
          matchUsers.player2 = client;
        }
        this.games_users.set(matchId, matchUsers);
      } else {
        // If the client is not a player, add the socket to the spectators array in the games_users map
        const matchUsers = this.games_users.get(matchId);
        matchUsers.spectators.push(client);
        this.games_users.set(matchId, matchUsers);
      }
    }
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
        radius: 6,
      },
      paddle1: {
        x: 10,
        y: 0,
        width: 10,
        height: 100,
        vy: 0,
      },
      paddle2: {
        x: 1180,
        y: 0,
        width: 10,
        height: 100,
        vy: 0,
      },
      score1: 0,
      score2: 0,
      speed: 5.83,
      isPaused: true,
      isGameOver: false,
      winner: 0,
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

    // console.log("Inside gameLoop idmatch gameobj: ")
    // console.log(game);
    // console.log("Inside gameLoop idmatch users obj: ")
    // console.log(users);



    game.isPaused = false;
    this.resetBall(game);
    while (!game.isGameOver) {
      if (!game.isPaused) {
        game = this.games.get(idMatch);
        users = this.games_users.get(idMatch);
        // Update game state
        this.updateGameState(game);
        this.updateBallPosition(game);
        
        // Send game state to players
        // const gameState = this.getGameState(game);
        users.player1.emit('gameState', game);
        users.player2.emit('gameState', game);
        //console.log("Inside gameLoop socket player 1: " + users.player1.id)
        //console.log("Inside gameLoop socket player 2: " + users.player2.id)
        for (const spectator of users.spectators) {
          spectator.emit('gameState', game);
          //console.log("Inside gameLoop socket spectator : " + spectator.id)
        }
        //console.log(game)
        // console.log('inside game loop of match: ' + game.idMatch)
      }

      // Wait for next frame
      await new Promise(resolve => setTimeout(resolve, FRAME_RATE));
    }

    //Game is over, clean up
    this.saveMatchResult(game);
    await this.userService.setUserOfflineById(users.player1.data.user.id);
    await this.userService.setUserOfflineById(users.player2.data.user.id);
    this.games.delete(idMatch);
    this.games_users.delete(idMatch);
    // users.player1.leave(matchId);
    // users.player2.leave(matchId);
    // for (const spectator of users.spectators) {
    //   spectator.leave(matchId);
    // }
    // server.to(matchId).emit('gameOver', game);
  }

  updatePlayerInput(matchId: number, input: number, player: number)
  {
    //console.log('Entering to updatePlayerInput');
    //console.log('matchId:' + matchId + 'player:' + player);
    const matchData = this.games.get(matchId);
    if (matchData) {
      if(player == parseInt(matchData.player1.id))
      {
        //console.log('Entering to updatePlayerInput PLAYER1');
        const playerData = matchData.player1;
        playerData.input = input;
      }
      else
      {
        if(player == parseInt(matchData.player2.id))
        {
          //console.log('Entering to updatePlayerInput PLAYER2');
          const playerData = matchData.player2;
          playerData.input = input;
        }
          //console.log('Entering to updatePlayerInput NO PLAYER');
      }
    }
    else
    {
      //console.log('NO MATCH DATA!!!!!!!');
    }
  }

  // updatePlayerInput(matchId: number, input: number, player: number)
  // {
  //   console.log('Entering to updatePlayerInput');
  //   const matchData = this.games.get(matchId);
  //   if (matchData) {
  //     const playerData = player === 1 ? matchData.player1 : matchData.player2;
  //     playerData.input = input;
  //     console.log('The input has been modified in game ' + matchId + ' for player ' + player + ' whit value  ' + input);
  //   }
  // }

  updateGameState(game: MatchData) {
    //console.log('Entering to updateGameState');
    // Move paddle1 up
    if (game.player1.input == 1 && game.paddle1.y - 3 >= 0) {
      //console.log('Entering to updateGameState MOVIENDO!!!!');
      game.paddle1.y -= 3;
    }

    // Move paddle2 up
    if (game.player2.input == 1 && game.paddle2.y - 3 >= 0) {
      //console.log('Entering to updateGameState MOVIENDO!!!!');
      game.paddle2.y -= 3;
    }

    // Move paddle1 down
    if (game.player1.input == -1 && game.paddle1.y + game.paddle1.height + 3 <= 750) {
      //console.log('Entering to updateGameState MOVIENDO!!!!');
      game.paddle1.y += 3;
    }

    // Move paddle2 down
    if (game.player2.input == -1 && game.paddle2.y + game.paddle2.height + 3 <= 750) {
      //console.log('Entering to updateGameState MOVIENDO!!!!');
      game.paddle2.y += 3;
    }
  }

  // updateBallPosition(matchData: MatchData): MatchData {
  //   const ball = matchData.ball;

  //   // Update ball position based on velocity
  //   ball.x += ball.vx;
  //   ball.y += ball.vy;

  //   // Check if ball hits top or bottom wall
  //   if (ball.y - ball.radius < 0 || ball.y + ball.radius > 750) {
  //     ball.vy = -ball.vy;
  //   }

  //   // Check if ball hits left or right wall
  //   if (ball.x - ball.radius < 0 || ball.x + ball.radius > 1200) {
  //     ball.vx = -ball.vx;
  //   }

  //   // Check if ball hits paddle1
  //   if (
  //     ball.y + ball.radius > matchData.paddle1.y &&
  //     ball.y - ball.radius < matchData.paddle1.y + matchData.paddle1.height &&
  //     ball.x - ball.radius <= matchData.paddle1.x + matchData.paddle1.width &&
  //     ball.vx < 0
  //   ) {
  //     ball.vx = Math.abs(ball.vx);
  //   }

  //   // Check if ball hits paddle2
  //   if (
  //     ball.y + ball.radius > matchData.paddle2.y &&
  //     ball.y - ball.radius < matchData.paddle2.y + matchData.paddle2.height &&
  //     ball.x + ball.radius >= matchData.paddle2.x &&
  //     ball.vx > 0
  //   ) {
  //     ball.vx = -Math.abs(ball.vx);
  //   }

  //   return matchData;
  // }

updateBallPosition(matchData: MatchData): MatchData {
    const ball = matchData.ball;
    //let speed = 5;

    // ball.vx *= 1.1;
    // ball.vy *= 1.1;

    // Update ball position based on velocity
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Check if ball hits top or bottom wall
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.vy = -ball.vy;
    } else if (ball.y + ball.radius > 750) {
      ball.y = 750 - ball.radius;
      ball.vy = -ball.vy;
    }

    // Check if ball hits left or right wall
    if (ball.x - ball.radius < 0) {
      // ball.x = ball.radius;
      // ball.vx = -ball.vx;
      matchData.score2 += 1;
      if(matchData.score2 == 12)
      {
        matchData.isGameOver = true;
        return matchData;
      } 
      else
      {
        this.resetBall(matchData);
        return matchData;
      } 
    } else if (ball.x + ball.radius > 1200) {
      // ball.x = 1200 - ball.radius;
      // ball.vx = -ball.vx;
      matchData.score1 += 1;
      if(matchData.score1 == 12)
      {
        matchData.isGameOver = true;
        return matchData;
      } 
      else
      {
        this.resetBall(matchData);
        return matchData;
      } 
    }

    // Check if ball hits paddle1
    if (
      ball.x - ball.radius <= matchData.paddle1.x + matchData.paddle1.width &&
      ball.y + ball.radius >= matchData.paddle1.y &&
      ball.y - ball.radius <= matchData.paddle1.y + matchData.paddle1.height &&
      ball.vx < 0
    ) {
      matchData.speed += 0.01;
      const relativeIntersectY = (matchData.paddle1.y + matchData.paddle1.height / 2) - ball.y;
      const normalizedRelativeIntersectionY = relativeIntersectY / (matchData.paddle1.height / 2);
      const bounceAngle = normalizedRelativeIntersectionY * Math.PI / 4;
      //speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      console.log('SPEED IS:' + matchData.speed);
      ball.vx = (matchData.speed * Math.sign(ball.vx) * Math.cos(bounceAngle)) * -1;
      ball.vy = -matchData.speed * Math.sin(bounceAngle);
      // ball.vx = (Math.abs(ball.vx) * Math.cos(bounceAngle));
      // ball.vy = (-Math.abs(ball.vx) * Math.sin(bounceAngle));
      ball.x = matchData.paddle1.x + matchData.paddle1.width + ball.radius;
    }

    // Check if ball hits paddle2
    if (
      ball.x + ball.radius >= matchData.paddle2.x &&
      ball.y + ball.radius >= matchData.paddle2.y &&
      ball.y - ball.radius <= matchData.paddle2.y + matchData.paddle2.height &&
      ball.vx > 0
    ) {
      matchData.speed += 0.01;
      const relativeIntersectY = (matchData.paddle2.y + matchData.paddle2.height / 2) - ball.y;
      const normalizedRelativeIntersectionY = relativeIntersectY / (matchData.paddle2.height / 2);
      const bounceAngle = normalizedRelativeIntersectionY * Math.PI / 4;
      //speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      ball.vx = -matchData.speed * Math.cos(bounceAngle);
      ball.vy = -matchData.speed * Math.sin(bounceAngle);
      // ball.vx = (-Math.abs(ball.vx) * Math.cos(bounceAngle));
      // ball.vy = (-Math.abs(ball.vx) * Math.sin(bounceAngle));
      ball.x = matchData.paddle2.x - ball.radius;
    }

    return matchData;
  }


  resetBall(matchData: MatchData): void {
    const ball = matchData.ball;
    matchData.speed = 5.83;
    ball.x = 600;
    ball.y = 375;
    ball.vx = Math.random() < 0.5 ? -5 : 5;
    ball.vy = Math.random() < 0.5 ? -3 : 3;
  }
}



