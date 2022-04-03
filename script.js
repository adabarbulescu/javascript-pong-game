var canvas;
var canvasContext;

var ballX = 50;
var ballY = 50;
var ballspeedX = 15;
var ballspeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

function calculateMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return{
        x:mouseX,
        y:mouseY
    }
}

function handleMouseClick(evt){
  if(showingWinScreen){
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(function(){
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', function(evt){
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
  })
}

function computerMovement(){
  var paddle2ycenter = paddle2Y + (PADDLE_HEIGHT/2);
  if(paddle2ycenter < ballY - 35){
    paddle2Y = paddle2Y + 6;
  } else if(paddle2ycenter > ballY + 35) {
    paddle2Y = paddle2Y-6;
  }
}

function ballReset(){

  if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){

    showingWinScreen = true;

  }
  ballspeedX = - ballspeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function moveEverything(){
  if(showingWinScreen === true){
    return;
  }

 computerMovement();

  ballX = ballX + ballspeedX;
  ballY = ballY + ballspeedY;

  if(ballX < 0){
    if(ballY > paddle1Y &&
    ballY < paddle1Y+PADDLE_HEIGHT){
      ballspeedX = -ballspeedX;

      var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
      ballspeedY = deltaY * 0.35;

    } else{
      player2Score+=1;
      ballReset();
    }
  }





  if(ballX > canvas.width){
    if(ballY > paddle2Y &&
    ballY < paddle2Y+PADDLE_HEIGHT){
      ballspeedX = -ballspeedX;
      var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
      ballspeedY = deltaY * 0.35;
    } else{
      player1Score +=1;
      ballReset();

    }
  }

  if(ballY < 0){
    ballspeedY = - ballspeedY;
  }

  if(ballY > canvas.height){
    ballspeedY = -ballspeedY
  }
}


function drawNet(){
  for(var i = 0; i < canvas.height; i+=36.25){
    colorRect(canvas.width/2-1, i, 2, 20, 'white');

  }
}

function drawEverything(){
  //the background screen
  colorRect(0,0,canvas.width, canvas.height, 'black');

  if(showingWinScreen === true){
    canvasContext.fillStyle = 'white';
    if(player1Score >= WINNING_SCORE){
        canvasContext.fillText('Left player won!', 350, 200);
    }else if(player2Score>= WINNING_SCORE){
        canvasContext.fillText('Right player won!', 350, 200);

    }




    canvasContext.fillText('Click to continue', 350, 500);
    return;
  }

  //the net
  drawNet();
  //left paddle
  colorRect(0,paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT,'white');
  //right computer paddle
  colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT,'white');
  //the ball
  colorCircle(ballX, ballY, 10, 'white');
  //scores
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width-100, 100);
}


function colorCircle(centerX, centerY, radius, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true );
  canvasContext.fill();

}

function colorRect(leftX, topY, width, height, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);

}
