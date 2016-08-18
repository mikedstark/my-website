/*
*	@author: Michael Stark
*	tennisGame.js
*
*/

// Canvas
const WIDTH = 800; //Canvas Size
const HEIGHT = 600;
const FPS = 30; //Frames Per Second

var canvas;
var canvasContext;

// Paddles
const PADDLE_LEN = 90;
const PADDLE_WIDTH = 10;
const DIST_FROM_WALL = 5;

var paddle1X = DIST_FROM_WALL;
var paddle2X = WIDTH - DIST_FROM_WALL - PADDLE_WIDTH;
var paddle1Y = HEIGHT/2 - PADDLE_LEN/2;
var paddle2Y = HEIGHT/2 - PADDLE_LEN/2;

// Ball
const BALL_WIDTH = 27;
const BALL_HEIGHT = 27;
var ballX = WIDTH/2 - BALL_WIDTH/2;
var ballY = HEIGHT/2 - BALL_HEIGHT/2;
var ballXSpeed = 4;
var ballYSpeed = 4;

window.onload = function(){

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	setInterval(function (){
				update()
				draw()
				}, 1000/FPS);

	canvas.addEventListener('mousemove', 
			function(evt){
				var mousePos = calculateMousePos(evt);
				paddle1Y = mousePos.y - PADDLE_LEN/2;
	});
		

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

	ballX += ballXSpeed;
	ballY += ballYSpeed

	if (ballX > WIDTH - BALL_WIDTH || ballX < 0){
		ballXSpeed *= -1;
	}

	if (ballY > HEIGHT - BALL_HEIGHT || ballY < 0) {
		ballYSpeed *= -1;
	}
	
}

function draw(){

	// Black Background
	colorRect(0,0,WIDTH,HEIGHT,'black');

	// Player one
	colorRect(paddle1X,paddle1Y,PADDLE_WIDTH,PADDLE_LEN,'white');

	// Player two
	colorRect(paddle2X,paddle2Y,PADDLE_WIDTH,PADDLE_LEN,'white');
	
	// Ball
	colorRect(ballX,ballY,BALL_WIDTH,BALL_HEIGHT,'white');

	drawNet();
}

function drawNet(){
	var netStart = 10
	var distBetween = 30
	var widthOfNet = 3
	var lengthOfNet = 11
	for (i = 0; i < 20; i++) {
		// Center the net on x axis with WIDTH/2 - widthOfNet/2 
		colorRect(WIDTH/2 - widthOfNet/2, netStart + i * distBetween,
					 widthOfNet, lengthOfNet, 'white');
	}
}

function colorCir(x, y, radius, color){
}


function colorRect(x, y, width, height, color){

	canvasContext.fillStyle = color;
	canvasContext.fillRect(x,y,width,height);
}
