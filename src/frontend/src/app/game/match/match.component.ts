import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements AfterViewInit {

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  ballSize = 10;
  paddleWidth = 10;
  paddleHeight = 50;
  id: number = -1;

  ngAfterViewInit() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');
    this.resizeCanvas();

    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });

    //Send Inputs to server Room ID has been recieved
    function handleMovement(e){
      console.log('handleMovement');
      if (this.id > -1)
      {
        if (e.key === "ArrowUp")
          console.log('Key DOWN ArrowUp');//chatService.emitInput([1,id, type]);
        else if (e.key === "ArrowDown") {
          console.log('Key DOWN ArrowDown');//chatService.emitInput([-1,id, type]);
        }
      }
    }
    // listen to keyboard events to stop the paddle if key is released
    function handleMovementStop(e){
      console.log('handleMovementStop');
      if (this.id > -1)
      {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          console.log('Key UP');//chatService.emitInput([0,id, type]);
        }
      }
    }
    //Keyboard event listeners
    document.addEventListener('keydown', handleMovement);
    document.addEventListener('keyup', handleMovementStop);
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
    this.context.fillStyle = 'black';
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

}
