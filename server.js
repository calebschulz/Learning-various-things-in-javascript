
var express = require('express');
var socket = require('socket.io');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));
var io = socket(server);
io.sockets.on('connection', newConnection);



function newConnection(socket){
	console.log('new connection: '+ socket.id);

	//socket.on('shipPosition', shipPosition);
	socket.on('keypressed', keypressedMsg);
	socket.on('keyreleased', keyreleasedMsg);
	socket.on('newAsteroidReq', newAsteroidReq);

	// function shipPosition(data){
	// 	//Broadcasts to everyone except the client who sent initial msg
	// 	socket.broadcast.emit('shipPosition', data);
	// 	//console.log(data);
	// }
	function keypressedMsg(data){
		//Broadcasts to everyone except the client who sent initial msg
		socket.broadcast.emit('keypressed', data);
		//console.log(data);
	}
	function keyreleasedMsg(data){
		//Broadcasts to everyone except the client who sent initial msg
		socket.broadcast.emit('keyreleased', data);
		//console.log(data);
	}
	function newAsteroidReq(data){
		//console.log("Received astroid data:"+data);
		//*** set to demo screen size
		let tempPos = data.position.pop();
		let tempVel = data.velocity.pop();
		let tempS = data.sides.pop();
		if(tempS){
			for(var i=0; i<data.number; i++){
				data.position.push(tempPos);//data.position[i] = tempPos;
				data.velocity.push(tempVel);//data.velocity[i] = tempVel;
				data.sides.push(tempS);//data.sides[i] = tempS;
			}
		}
		else{
			for(var i=0; i < data.number; i++){
				data.position.push([Math.random()*750,Math.random()*750,0]);
				data.velocity.push([Math.random()*(Math.round(Math.random()) * 2 - 1),Math.random()*(Math.round(Math.random()) * 2 - 1), 0]);
				data.sides.push(Math.random()*(30-15)+15);
			}

		}
		console.log(data.number);
		io.sockets.emit('newAsteroids', data);
	}

}

console.log("Server is now running...");  