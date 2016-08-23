/*
*	@author: Michael Stark
*	tennisGame.js
*
*/

// Canvas
const WIDTH = 800; //Canvas Size
const HEIGHT = 600;
const FPS = 60; //Frames Per Second

var canvas;
var canvasContext;

// Paddles
const PADDLE_HEIGHT = 90;
const PADDLE_WIDTH = 10;
const DIST_FROM_WALL = 5;

var paddle1X = DIST_FROM_WALL;
var paddle2X = WIDTH - DIST_FROM_WALL - PADDLE_WIDTH;
var paddle1Y = HEIGHT/2 - PADDLE_HEIGHT/2;
var paddle2Y = HEIGHT/2 - PADDLE_HEIGHT/2;

// Ball
const BALL_RADIUS = 12;
const AI_SPEED = 3;
const WINNING_SCORE = 2;

var ballX = WIDTH/2 //- BALL_WIDTH/2;
var ballY = HEIGHT/2 //- BALL_HEIGHT/2;
var ballXSpeed = -5;
var ballYSpeed = 5;

var scoreP1 = 0;
var scoreP2 = 0;

var endGame = false;
var clickToStart = true;



function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        //console.log("up key pressed")
        paddle1Y-= 20;
    }
    else if (e.keyCode == '40') {
        // down arrow
        paddle1Y+=20;
    }
    else if (e.keyCode == '37') {
       // left arrow
    }
    else if (e.keyCode == '39') {
       // right arrow
    }

}

function mouseClicked(evt){

	if(clickToStart){
		clickToStart = false;
	}


	if (endGame){
		endGame = false;
		scoreP2 = 0;
		scoreP1 = 0;
	}
}

window.onload = function(){


	// canvas2 = document.getElementById('headerCanvas');
	// canvasContextHeader = canvas2.getContext('2d');


	// canvasContextHeader.fillStyle = color;
	// canvasContextHeader.fillRect(leftX,topY,width,height);

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	setInterval(function (){
				update()
				draw()
				}, 1000/FPS);

	canvas.addEventListener('mousedown', mouseClicked);

	canvas.addEventListener('mousemove', 
			function(evt){
				var mousePos = calculateMousePos(evt);
				var movement = mousePos.y - PADDLE_HEIGHT/2;

				//constrain Paddle to screen
				if (movement > 0 && movement < HEIGHT - PADDLE_HEIGHT)
					paddle1Y = movement; //paddle2Y to control left paddle instead
	});

	document.onkeydown = checkKey;	






}


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

function update(){

	if(clickToStart){
		return;
	}

	if(endGame){
		return;
	}


	computerAI();

	ballX += ballXSpeed;
	ballY += ballYSpeed

	// Player scores
	if (ballX + BALL_RADIUS > WIDTH){//} - BALL_WIDTH){ 
		scoreP1++;  //score must be above
		resetBall(); //winning cond is in resetBall();
		//ballXSpeed *= -1;
		return;
	}

	//ComputerScores
	if(ballX + BALL_RADIUS < 0){
		scoreP2++;  //score must be above
		resetBall(); //winning cond is in resetBall();
		return;	
	}


	//Bounce off top or bottom
	if (ballY > HEIGHT - BALL_RADIUS || ballY < 0 + BALL_RADIUS) {  ///////
		ballYSpeed *= -1;
	}

	//Bounce off P1 paddle
	//Reminder paddle1Y is top of paddle
	if (ballY > paddle1Y - BALL_RADIUS*2 && //ball below topY of paddle
 		ballY < paddle1Y + PADDLE_HEIGHT + BALL_RADIUS && //ball above bottomY of paddle
 		ballX < DIST_FROM_WALL + PADDLE_WIDTH/2 + BALL_RADIUS &&// ball at proper x
 		ballX > DIST_FROM_WALL + BALL_RADIUS){ 

		ballXSpeed *= -1
		//changeY(1); //paddle 1
	}

	//BOUNCE OFF P2 paddle
	
	if (ballY > paddle2Y - BALL_RADIUS*2 && //ball below topY of paddle
 		ballY < paddle2Y + PADDLE_HEIGHT + BALL_RADIUS && //ball above bottomY of paddle
 		ballX + BALL_RADIUS > WIDTH - DIST_FROM_WALL - PADDLE_WIDTH/2 &&// ball at proper x
 		ballX + BALL_RADIUS < WIDTH - DIST_FROM_WALL){ 

		ballXSpeed *= -1
		//changeY(2); //paddle 2
	}
	


	//console.log("ballX: " + ballX);
	//console.log("ballY: " + ballY);
	//console.log("paddle1Y: " + paddle1Y);
	
}

//Not good....
function changeY(paddle){
	var tempPaddle = paddle1Y;
	if(paddle == 2){
		tempPaddle = paddle2Y;
	}
		var deltaY = ballY -(tempPaddle + PADDLE_HEIGHT/2);
		ballYSpeed = deltaY * .10;
		if(ballYSpeed < 2){ ballYSpeed = 2;}

}
////////////////

function computerAI(){
	//Computer AI
	var center = paddle2Y + PADDLE_HEIGHT/2;
	if(center < ballY - PADDLE_HEIGHT/4){//&& paddle2Y > PADDLE_HEIGHT + AI_SPEED){
			paddle2Y += AI_SPEED
	}
	else if(center > ballY + PADDLE_WIDTH/4){//} && paddle2Y > PADDLE_HEIGHT){
		paddle2Y -= AI_SPEED
	}

	//Keep AI inBounds...
	if(paddle2Y < 0){
		paddle2Y = 0;
	}

	if(paddle2Y > HEIGHT - PADDLE_HEIGHT){
		paddle2Y = HEIGHT - PADDLE_HEIGHT;
	}
}

function resetBall(){
	if(scoreP1 >= WINNING_SCORE || scoreP2 >= WINNING_SCORE){
		endGame = true;
	}


	ballXSpeed *= -1;
	ballYSpeed *= -1;
	ballX = WIDTH/2;// - BALL_WIDTH/2;
	ballY = HEIGHT/2;// - BALL_HEIGHT/2;
}

function draw(){

	// Black Background
	colorRect(0,0,WIDTH,HEIGHT,'black');

	if(clickToStart){
		startGame()
		return;
	}

	// check win condition if/then display Winning Screen
	if(endGame){
		winScreen();
		return;
	}
	// Player one
	colorRect(paddle1X,paddle1Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');

	// Player two
	colorRect(paddle2X,paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');
	
	// Ball
	colorCircle(ballX, ballY, BALL_RADIUS, 'white');
	//colorRect(ballX,ballY,BALL_WIDTH,BALL_HEIGHT,'white');

	drawNet();

	drawScores();
}

function startGame(){

	var start = canvas.getContext('2d');
	canvasContext.fillStyle = 'white';
	start.textAlign='center';
	canvasContext.fillText("CLICK TO START",WIDTH/2, HEIGHT/2);

}

function winScreen(){

	var winner = "Player 1 wins!!!"
	var clickMe = canvas.getContext('2d');
	var click = "Click to play again"
	//clickMe.font="30px Georgia"

	if(scoreP2 >= WINNING_SCORE){
		winner = "The Cake is a lie..."
	}

	canvasContext.fillStyle = 'white';
	//clickMe.textAlign='center';
	clickMe.fillText(click, WIDTH/2 , HEIGHT/4);

	canvasContext.fillText(winner, WIDTH/2, HEIGHT/2);

	

}

function drawScores(){

	var placement = WIDTH/4
	canvasContext.fillText(scoreP1, placement, HEIGHT/9);
	canvasContext.fillText(scoreP2, placement*3, HEIGHT/9);


}

function drawNet(){
	var netStart = 10
	var distBetween = 30
	var widthOfNet = 3
	var lengthOfNet = 11
	//Draws 20 rect's
	//Will need to adjust if HEIGHT is changed...
	for (i = 0; i < 20; i++) {
		// Center the net on x axis with WIDTH/2 - widthOfNet/2 
		colorRect(WIDTH/2 - widthOfNet/2, netStart + i * distBetween,
					 widthOfNet, lengthOfNet, 'white');
	}
}

function colorCircle(x, y, radius, color){

	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(x, y, radius, 0, Math.PI*2, true);
	canvasContext.fill();

}


function colorRect(leftX, topY, width, height, color){

	canvasContext.fillStyle = color;
	canvasContext.fillRect(leftX,topY,width,height);
}
