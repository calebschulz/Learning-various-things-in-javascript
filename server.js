
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
	socket.on('newAsteroidVector', newAsteroidVectorMsg);

	// function shipPosition(data){
	// 	//Broadcasts to everyone except the client who sent initial msg
	// 	socket.broadcast.emit('shipPosition', data);
	// 	//console.log(data);
	// }
	function keypressedMsg(data){
		//Broadcasts to everyone except the client who sent initial msg
		socket.broadcast.emit('keypressed', data);
		console.log(data);
	}
	function keyreleasedMsg(data){
		//Broadcasts to everyone except the client who sent initial msg
		socket.broadcast.emit('keyreleased', data);
		//console.log(data);
	}
	function newAsteroidVectorMsg(data){
		console.log("Received astroid data:"+data)
		//socket.broadcast.emit('newAsteroidVector', data);
	}

}

console.log("Server is now running...");  