
var ballSize = 10;
var paddleWidth = 10;
var paddleHeight = 50;
var courtColor = 'black';


// function printMap(jsonData) {
//     const canvas = document.getElementById('gameCanvas');
//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawBall(jsonData.ball);
//     drawPaddles(jsonData.paddle1, jsonData.paddle2);
//     printResult(jsonData);

//     ctx.font = "60px monospace";
//     ctx.fillStyle = "black";
//     ctx.textAlign = "center";
//     ctx.fillText(jsonData.player1.name, 250, 70);
//     ctx.fillText(jsonData.player2.name, canvas.width - 250, 70);
// }

function redrawCanvas(jsonData){
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  // Get game state data
  const paddle1Y = (jsonData.paddle1.y / 750) * canvas.height;
  const paddle2Y = (jsonData.paddle2.y / 750) * canvas.height;
  const ballX = (jsonData.ball.x / 1200) * canvas.width;
  const ballY = (jsonData.ball.y / 750) * canvas.height;
  const ballRadius = (jsonData.ball.radius / 750) * canvas.height;
  const fontScale = canvas.width / 1200;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw something on the canvas
  ctx.fillStyle = courtColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  // Draw paddles
  const paddleWidth = (jsonData.paddle1.width / 1200) * canvas.width;
  const paddleHeight = (jsonData.paddle1.height / 750) * canvas.height;
  const paddle1X = (jsonData.paddle1.x / 1200) * canvas.width;
  const paddle2X = (jsonData.paddle2.x / 1200) * canvas.width;
  ctx.fillStyle = 'white';
  ctx.fillRect(paddle1X, paddle1Y, paddleWidth, paddleHeight);
  ctx.fillRect(paddle2X, paddle2Y, paddleWidth, paddleHeight);

  // // Draw score and names
  // ctx.fillStyle = 'white';
  // ctx.font = `${20 * fontScale}px Arial`;
  // ctx.fillText(`${gameState.player1.name}: ${gameState.score1}`, 50 * fontScale, 50 * fontScale);
  // ctx.fillText(`${gameState.player2.name}: ${gameState.score2}`, canvas.width - 200 * fontScale, 50 * fontScale);

  // if (gameState.isGameOver)
  //   drawMatchResult(gameState);
}

function draw() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw something on the canvas
  ctx.fillStyle = courtColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw ball
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, ballSize, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  // Draw paddles
  ctx.fillStyle = 'white';
  ctx.fillRect(0, (canvas.height - paddleHeight) / 2, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, (canvas.height - paddleHeight) / 2, paddleWidth, paddleHeight);
}



function resizeCanvas() {
  const canvasContainer = document.getElementById('gameContainer');
  const canvas = document.getElementById('gameCanvas');

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
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Calculate new ball and paddle sizes
  const newSize = Math.min(canvasWidth, canvasHeight) * 0.04;
  ballSize = newSize;
  paddleWidth = newSize;
  paddleHeight = newSize * 5;

  // Redraw canvas (you should implement your own draw function)
  console.log("here i have to call the draw");
  draw();
}



  /*canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  ballSize = 10;
  paddleWidth = 10;
  paddleHeight = 50;
  id: number = 1;
  key_pressed = 0;
  player: number = 1;
  matchId: number = 0;
  court_color: string = 'black'
  





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

  }*/