import { Component, AfterViewInit, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements AfterViewInit, OnInit {

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  ballSize = 10;
  paddleWidth = 10;
  paddleHeight = 50;
  id: number = 1;
  key_pressed = 0;
  player: number = 1;
  matchId: number = 0;
  court_color: string = 'black'
  // set_player_num: number = 0;

  constructor(private gameService: GameService, private route: ActivatedRoute) {
  }

  //Send Inputs to server Room ID has been recieved
  handleMovement = (e) => {
    if (this.id > -1 && !this.key_pressed )
    {
      this.key_pressed = 1;
      console.log('handleMovement');
      if (e.key === "ArrowUp"){
        console.log('Key DOWN ArrowUp');//chatService.emitInput([1,id, type]);
        this.gameService.playerInput([this.matchId, 1, this.id]);
      }
      else if (e.key === "ArrowDown") {
        console.log('Key DOWN ArrowDown');
        this.gameService.playerInput([this.matchId, -1, this.id]);
      }
    }
  }
  // listen to keyboard events to stop the paddle if key is released
  handleMovementStop = (e) => {
    if (this.id > -1 && this.key_pressed)
    {
      this.key_pressed = 0;
      console.log('handleMovementStop');
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        console.log('Key UP');
        this.gameService.playerInput([this.matchId, 0, this.id]);
      }
    }
  }

  ngOnInit(): void {
    this.gameService.getGameColorOption().subscribe((result)=>{
        this.court_color = result;
    });
    this.route.paramMap.subscribe(params => {
      this.matchId = +params.get('id');
      console.log('Match ID:', this.matchId);
    });
    this.gameService.joinClientToMatch(this.matchId);
    this.gameService.gameState.subscribe((gameState) => {
      this.redrawCanvas(gameState);
    });
  }

  ngAfterViewInit() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');
    this.resizeCanvas();

    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });

    //Keyboard event listeners
    // this.player = await this.gameService.witchPlayerIam(this.matchId).toPromise();
    document.addEventListener('keydown', this.handleMovement);
    document.addEventListener('keyup', this.handleMovementStop);
    this.draw();
  }

  private resizeCanvas() {
    const canvasContainer = document.getElementById('gameContainer');
    const containerWidth = canvasContainer.offsetWidth;
    const containerHeight = canvasContainer.offsetHeight;
    const ratio = 1200 / 750;

    // Calculate canvas dimensions
    let canvasWidth = containerWidth;
    let canvasHeight = containerHeight;

    if (containerWidth / ratio > containerHeight) {
      canvasWidth = containerHeight * ratio;
    } else {
      canvasHeight = containerWidth / ratio;
    }

    // Adjust canvas size
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    // Calculate new ball and paddle sizes
    const newSize = Math.min(canvasWidth, canvasHeight) * 0.04;
    this.ballSize = newSize;
    this.paddleWidth = newSize;
    this.paddleHeight = newSize * 5;

    // Redraw canvas
    this.draw();
  }

  draw() {
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw something on the canvas
    this.context.fillStyle = this.court_color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw ball
    this.context.beginPath();
    this.context.arc(this.canvas.width / 2, this.canvas.height / 2, this.ballSize, 0, Math.PI * 2);
    this.context.fillStyle = 'white';
    this.context.fill();

    // Draw paddles
    this.context.fillStyle = 'white';
    this.context.fillRect(0, (this.canvas.height - this.paddleHeight) / 2, this.paddleWidth, this.paddleHeight);
    this.context.fillRect(this.canvas.width - this.paddleWidth, (this.canvas.height - this.paddleHeight) / 2, this.paddleWidth, this.paddleHeight);
  }

  redrawCanvas(gameState: any): void {
    // if(!this.set_player_num)
    //   setPlayerNum(gameState);
    // Get game state data
    const paddle1Y = (gameState.paddle1.y / 750) * this.canvas.height;
    const paddle2Y = (gameState.paddle2.y / 750) * this.canvas.height;
    const ballX = (gameState.ball.x / 1200) * this.canvas.width;
    const ballY = (gameState.ball.y / 750) * this.canvas.height;
    const ballRadius = (gameState.ball.radius / 750) * this.canvas.height;
    const fontScale = this.canvas.width / 1200;

    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw something on the canvas
    this.context.fillStyle = this.court_color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw ball
    this.context.beginPath();
    this.context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    this.context.fillStyle = 'white';
    this.context.fill();

    // Draw paddlesxw
    const paddleWidth = (gameState.paddle1.width / 1200) * this.canvas.width;
    const paddleHeight = (gameState.paddle1.height / 750) * this.canvas.height;
    const paddle1X = (gameState.paddle1.x / 1200) * this.canvas.width;
    const paddle2X = (gameState.paddle2.x / 1200) * this.canvas.width;
    this.context.fillStyle = 'white';
    this.context.fillRect(paddle1X, paddle1Y, paddleWidth, paddleHeight);
    this.context.fillRect(paddle2X, paddle2Y, paddleWidth, paddleHeight);

    //Draw score and names
    this.context.fillStyle = 'white';
    this.context.font = `${20 * fontScale}px Arial`;
    this.context.fillText(`${gameState.player1.name}: ${gameState.score1}`, 50 * fontScale, 50 * fontScale);
    this.context.fillText(`${gameState.player2.name}: ${gameState.score2}`, this.canvas.width - 200 * fontScale, 50 * fontScale);

    if(gameState.isGameOver)
      this.drawMatchResult(gameState);
  }

  drawMatchResult(gameState: any): void {
    const fontScale = this.canvas.width / 1200;

    // Set text properties
    this.context.fillStyle = 'white';
    this.context.font = `${50 * fontScale}px Arial`;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';

    // Draw text
    const winnerName = gameState.score1 > gameState.score2 ? gameState.player1.name : gameState.player2.name;
    const text = `${winnerName} wins!`;
    this.context.fillText(text, this.canvas.width / 2, this.canvas.height / 2);

  }
}
