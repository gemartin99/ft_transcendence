import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

class NewScene extends Phaser.Scene {
  green: any;
  blue: any;
  greenKeys: any;
  blueKeys: any;

  constructor() {
    super({ key: 'new' });
  }

  preload() {
    this.load.setBaseURL('');
    this.load.image('blueBox', 'assets/ball.png');
    this.load.image('greenBox', 'assets/ball.png');
  }

  create() {
    this.blue = this.physics.add.image(100, 100, 'blueBox').setCollideWorldBounds(true);
    this.green = this.physics.add.image(300, 340, 'greenBox').setCollideWorldBounds(true);

    this.greenKeys = this.input.keyboard.createCursorKeys();
    this.blueKeys = this.input.keyboard.addKeys('a,s,d,w');

    this.physics.add.collider(this.green, this.blue, null);
  }

  override update() {
    if (this.blueKeys.a.isDown) {
      this.blue.setVelocityX(-200);
    } else if (this.blueKeys.d.isDown) {
      this.blue.setVelocityX(200);
    } else if (this.blueKeys.w.isDown) {
      this.blue.setVelocityY(-200);
    } else if (this.blueKeys.s.isDown) {
      this.blue.setVelocityY(200);
    } else if (!this.blue.triggered) {
      this.blue.setVelocity(0);
    }

    if (this.greenKeys.left.isDown) {
      this.green.setVelocityX(-200);
    } else if (this.greenKeys.right.isDown) {
      this.green.setVelocityX(200);
    } else if (this.greenKeys.up.isDown) {
      this.green.setVelocityY(-200);
    } else if (this.greenKeys.down.isDown) {
      this.green.setVelocityY(200);
    } else if (!this.green.triggered) {
      this.green.setVelocity(0);
    }
  }
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      scene: [ NewScene ],
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gameCanvas',
        height: 600,
        width: 600
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }
        }
      }
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }

}

// import { Component, OnInit } from '@angular/core';
// import * as Phaser from 'phaser';

// @Component({
//   selector: 'app-game',
//   templateUrl: './game.component.html',
//   styleUrls: ['./game.component.css']
// })
// export class GameComponent implements OnInit {
//   phaserGame: Phaser.Game;
//   config: Phaser.Types.Core.GameConfig;
//   constructor() {
//     this.config = {
//       type: Phaser.AUTO,
//       height: 600,
//       width: 800,
//       parent: 'gameContainer',
//       physics: {
//         default: 'arcade',
//         arcade: {
//           gravity: { y: 100 }
//         }
//       }
//     };
//   }
//   ngOnInit() {
//     this.phaserGame = new Phaser.Game(this.config);
//   }
// }






// import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
// import * as Phaser from 'phaser';
// // import * as Phaser from 'phaser/dist/phaser.js';


// @Component({
//   selector: 'app-game',
//   templateUrl: './game.component.html',
//   styleUrls: ['./game.component.css']
// })

// export class GameComponent implements OnInit {
//   game: Phaser.Game;
  
//   constructor() { }

//   ngOnInit() {
//     this.game = new Phaser.Game({
//       type: Phaser.AUTO,
//       width: 800,
//       height: 600,
//       parent: 'game',
//       physics: {
//         default: 'arcade',
//         arcade: {
//           gravity: false
//         }
//       },
//       scene: new GameScene(),
//     });
//   }
// }

// class GameScene extends Phaser.Scene {
//   constructor() {
//     super({
//       key: 'game',
//     });
//   }

//   preload() {
//     this.load.image('ball', 'assets/ball.png');
//     this.load.image('paddle', 'assets/paddle.png');
//   }

//   create() {
//     this.add.image(400, 300, 'ball');
//     this.physics.world.setBoundsCollision(true, true, true, true);
//     const paddle1 = this.physics.add.image(30, 300, 'paddle').setImmovable(true);
//     const paddle2 = this.physics.add.image(770, 300, 'paddle').setImmovable(true);
//     this.physics.add.collider(paddle1, paddle2);
//     this.physics.add.collider(paddle1, this.children.getByName('ball'), this.hitPaddle, null, this);
//     this.physics.add.collider(paddle2, this.children.getByName('ball'), this.hitPaddle, null, this);
//     this.physics.world.on('worldbounds', this.hitWall, this);
//     this.children.getByName('ball').setVelocityX(200).setVelocityY(200);
//   }

//   update() {
//     const ball = this.children.getByName('ball');
//     if (ball.x < 0 || ball.x > 800) {
//       ball.setPosition(400, 300);
//     }
//   }

//   hitPaddle(paddle, ball) {
//     const diff = ball.y - paddle.y;
//     ball.setVelocityY(diff * 10);
//   }

//   hitWall() {
//     const ball = this.children.getByName('ball');
//     ball.setVelocityY(-ball.body.velocity.y);
//   }
// }

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-game',
//   templateUrl: './game.component.html',
//   styleUrls: ['./game.component.css']
// })
// export class GameComponent {

// }

// component.ts

// import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

// @Component({
//   selector: 'app-game',
//   templateUrl: './game.component.html',
//   styleUrls: ['./game.component.css']
// })

// export class GameComponent implements AfterViewInit {
//   @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
//   ballX = 250;
//   ballY = 250;
//   ballSpeedX = 5;
//   ballSpeedY = 5;
//   player1Y = 250;
//   player2Y = 250;
//   playerHeight = 50;
//   playerWidth = 10;
//   score1 = 0;
//   score2 = 0;
//   canvasWidth = 500;
//   canvasHeight = 500;

//   ngAfterViewInit() {
//     this.resizeCanvas();
//     window.addEventListener('resize', this.resizeCanvas);
//     this.canvas.nativeElement.style.backgroundColor = 'black';
//     requestAnimationFrame(() => this.animate());
//   }

//   resizeCanvas = () => {
//     this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
//     this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
//     this.canvasWidth = this.canvas.nativeElement.width;
//     this.canvasHeight = this.canvas.nativeElement.height;
//   }

//   animate = () => {
//     this.moveBall();
//     this.draw();
//     requestAnimationFrame(this.animate);
//   }

//   moveBall = () => {
//     this.ballX += this.ballSpeedX;
//     this.ballY += this.ballSpeedY;
//     if (this.ballY < 0 || this.ballY > this.canvasHeight) this.ballSpeedY = -this.ballSpeedY;
//     if (this.ballX < 20 && this.ballY > this.player1Y && this.ballY < this.player1Y + this.playerHeight) this.ballSpeedX = -this.ballSpeedX;
//     if (this.ballX > this.canvasWidth - 20 && this.ballY > this.player2Y && this.ballY < this.player2Y + this.playerHeight) this.ballSpeedX = -this.ballSpeedX;
//     if (this.ballX < 0) { this.score2++; this.resetBall(); }
//     if (this.ballX > this.canvasWidth) { this.score1++; this.resetBall(); }
//   }

//   resetBall = () => {
//     this.ballX = this.canvasWidth / 2;
//     this.ballY = this.canvasHeight / 2;
//     this.ballSpeedX = -this.ballSpeedX;
//   }

//   draw = () => {
//     const ctx = this.canvas.nativeElement.getContext('2d');
//     ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
//     ctx.fillStyle = 'white';
//     ctx.beginPath();
//     ctx.arc(this.ballX, this.ballY, 10, 0, 2 * Math.PI);
//     ctx.fill();
//     ctx.fillRect(0, this.player1Y, this.playerWidth, this.playerHeight);
//     ctx.fillRect(this.canvasWidth - this.playerWidth, this.player2Y, this.playerWidth, this.playerHeight);
//     ctx.font = '20px Arial';
//     ctx.fillText(this.score1.toString(), this.canvasWidth / 4, 20);
//     ctx.fillText(this.score2.toString(), this.canvasWidth * 3 / 4, 20);
//   }
// }