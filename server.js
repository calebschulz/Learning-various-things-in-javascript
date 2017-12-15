
var express = require('express');
var socket = require('socket.io');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

var io = socket(server);
io.sockets.on('connection', newConnection);

var currentPlayers = [];
var gameStarted = false;
var resetGame = true;

function newConnection(socket){
	console.log('new connection: '+ socket.id);

	//If connection is the first or second client, tell them which player they are
	if(currentPlayers.length < 2){
		currentPlayers.push(socket.id);
		console.log('Player '+currentPlayers.length+' connected.')
		var data = {
			//Tell cliente if they are player 1 or 2
			playerId: currentPlayers.length
		}
		socket.emit('playerInitialize', data);
	}
	else{
		console.log('More than 2 players connected');
	}
	console.log('player number:' + currentPlayers.length);

	//If there is now 2 players, tell clients to start game
	if(currentPlayers.length === 2 && gameStarted === false){
	  console.log('Initializing game');
	  var data = {
	    messageText: "let's play!",
	    newastnum: 2,
	    firstInit: true,
	    resetGame: true
	  }
	  console.log('initial init**'+data.resetGame);
		io.sockets.emit('initialize',data);
	}
	
	socket.on('keypressed', keypressedMsg);
	socket.on('keyreleased', keyreleasedMsg);
	socket.on('newAsteroidReq', newAsteroidReq);
	socket.on('initialize', initialize);
	socket.on('disconnect', userDisconnect);

	//Used for initializing a new level
	function initialize(data){
		if(gameStarted === false){
			if(currentPlayers.length === 1){
				data.playerNumber = 1;
			}
			if(currentPlayers.length === 2){ 
				data.playerNumber = 2;
				gameStarted = true;				
			}
		}
		io.sockets.emit('initialize',data);
	}

	//Removes players when they disconnect
	function userDisconnect(){
		console.log('User Disconnected: ' + this.id);
		if(this.id === currentPlayers[0]){
			if(currentPlayers.length === 2){
				currentPlayers.splice(0,1);
			}
			else{
				currentPlayers.length = 0;	
			}
			gameStarted = false;	
		}
		else if(this.id === currentPlayers[1]){
			currentPlayers.pop();
			gameStarted = false;
		}

	}

	//Forwards key press/release events to other player
	function keypressedMsg(data){
		//Broadcasts to everyone except the client who sent initial msg
		socket.broadcast.emit('keypressed', data);
		//console.log(this.id);
	}
	function keyreleasedMsg(data){
		//Broadcasts to everyone except the client who sent initial msg
		socket.broadcast.emit('keyreleased', data);
		//console.log(data);
	}

	//Generate info for new asteroids
	function newAsteroidReq(data){
		if(gameStarted === true){
			console.log("Received astroid data:"+data);

			if(this.id === currentPlayers[0]){ //only first player controls asteroid creation
				let tempPosX = data.positionX.pop();
				let tempPosY = data.positionY.pop();
				let tempVel = data.velocity.pop();
				let tempS = data.sides.pop();
				if(tempS){
					for(var i=0; i<data.number; i++){
						data.positionX.push(tempPosX);//data.position[i] = tempPos;
						data.positionY.push(tempPosY);//data.position[i] = tempPos;
						data.velocity.push([Math.random()*(Math.round(Math.random()) * 2 - 1),Math.random()*(Math.round(Math.random()) * 2 - 1), 0]);//data.velocity[i] = tempVel;
						data.sides.push(tempS);//data.sides[i] = tempS;
					}
				}
				else{
					for(var i=0; i < data.number; i++){
						data.positionX.push(Math.random()*750);
						data.positionY.push(Math.random()*750);
						data.velocity.push([Math.random()*(Math.round(Math.random()) * 2 - 1),Math.random()*(Math.round(Math.random()) * 2 - 1), 0]);
						data.sides.push(Math.floor(Math.random()*(30-15)+15));
					}
				}
				console.log('number'+data.number);
				io.sockets.emit('newAsteroids', data);
			}
		}
	}
}

console.log("Server is now running...");  