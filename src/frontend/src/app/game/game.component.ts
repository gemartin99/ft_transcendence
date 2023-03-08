// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-game',
//   templateUrl: './game.component.html',
//   styleUrls: ['./game.component.css']
// })
// export class GameComponent {

// }

// component.ts
// import { Component, ViewChild, ElementRef } from '@angular/core';
// import * as Phaser from 'phaser/dist/phaser.js';

// @Component({
//   selector: 'app-game',
//   templateUrl: './game.component.html',
//   styleUrls: ['./game.component.css']
// })
// export class GameComponent {
//   @ViewChild('gameContainer', { static: true }) gameContainer: ElementRef;

//   game: Phaser.Game;

//   config: Phaser.Types.Core.GameConfig = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     scene: {
//       preload: function () {
//         this.load.image('ball', 'assets/ball.png');
//       },
//       create: function () {
//         const ball = this.add.sprite(400, 300, 'ball');
//         ball.setBounce(1, 1);
//         ball.setCollideWorldBounds(true);
//         ball.setVelocity(Phaser.Math.Between(-200, 200), 20);
//       }
//     }
//   };

//   ngAfterViewInit() {
//     this.game = new Phaser.Game(this.config);
//     this.game.canvas.parentNode.style.width = '100%';
//     this.game.canvas.parentNode.style.height = '100%';
//   }
// }

import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ballX = 250;
  ballY = 250;
  ballSpeedX = 5;
  ballSpeedY = 5;
  player1Y = 250;
  player2Y = 250;
  playerHeight = 50;
  playerWidth = 10;
  score1 = 0;
  score2 = 0;
  canvasWidth = 500;
  canvasHeight = 500;

  ngAfterViewInit() {
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas);
    this.canvas.nativeElement.style.backgroundColor = 'black';
    requestAnimationFrame(() => this.animate());
  }

  resizeCanvas = () => {
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
    this.canvasWidth = this.canvas.nativeElement.width;
    this.canvasHeight = this.canvas.nativeElement.height;
  }

  animate = () => {
    this.moveBall();
    this.draw();
    requestAnimationFrame(this.animate);
  }

  moveBall = () => {
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;
    if (this.ballY < 0 || this.ballY > this.canvasHeight) this.ballSpeedY = -this.ballSpeedY;
    if (this.ballX < 20 && this.ballY > this.player1Y && this.ballY < this.player1Y + this.playerHeight) this.ballSpeedX = -this.ballSpeedX;
    if (this.ballX > this.canvasWidth - 20 && this.ballY > this.player2Y && this.ballY < this.player2Y + this.playerHeight) this.ballSpeedX = -this.ballSpeedX;
    if (this.ballX < 0) { this.score2++; this.resetBall(); }
    if (this.ballX > this.canvasWidth) { this.score1++; this.resetBall(); }
  }

  resetBall = () => {
    this.ballX = this.canvasWidth / 2;
    this.ballY = this.canvasHeight / 2;
    this.ballSpeedX = -this.ballSpeedX;
  }

  draw = () => {
    const ctx = this.canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.ballX, this.ballY, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillRect(0, this.player1Y, this.playerWidth, this.playerHeight);
    ctx.fillRect(this.canvasWidth - this.playerWidth, this.player2Y, this.playerWidth, this.playerHeight);
    ctx.font = '20px Arial';
    ctx.fillText(this.score1.toString(), this.canvasWidth / 4, 20);
    ctx.fillText(this.score2.toString(), this.canvasWidth * 3 / 4, 20);
  }
}