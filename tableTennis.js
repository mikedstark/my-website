var canvas;
var canvasContext;
var ballX = 50;
var ballY = 0;

const WIDTH = 800; //Canvas Size
const HEIGHT = 600;
const FPS = 30; //Frames Per Second
const PADDLE_LEN = 50;
const PADDLE_WIDTH = 10;

window.onload = function(){

canvas = document.getElementById('gameCanvas');
canvasContext = canvas.getContext('2d');
setInterval(drawEverything, 1000/FPS);

}


function update(){
	ballX += 5;
}

function drawEverything(){

	// Black Background
	colorRect(0,0,WIDTH,HEIGHT,'black');

	// Player one
	colorRect(0,2,10,10,'white');

	// Player two
	colorRect(0,2,10,10,'white');
	
	// Ball
	colorRect(ballX,ballY,10,10,'white');
}

function colorCir(){
}


function colorRect(x, y, width, height, color){

	canvasContext.fillStyle = color;
	canvasContext.fillRect(x,y,width,height);
}
