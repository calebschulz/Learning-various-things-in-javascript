// window.requestAnimationFrame = (function(){
//     return  window.requestAnimationFrame       ||
//             window.webkitRequestAnimationFrame ||
//             window.mozRequestAnimationFrame    ||
//             window.oRequestAnimationFrame      ||
//             window.msRequestAnimationFrame     ||
//             function (callback) {
//                 window.setTimeout(callback, 1000/60);
//             };
// })();

var ship;
var ship2;
var asteroids = [];
var astnum;
var initastnum = 2;
var debris = [];
var energy = [];
var gameLevel = 0;
var message;
var socket;// = io.connect('http://localhost:3000');

function setup() {
  //1500, 750
  createCanvas(750, 750);//windowWidth, windowHeight);
  textFont("Courier");
  ship = new Ship();
  ship2 = new Ship();
  initialize("let's play!", initastnum);

  socket = io.connect('http://localhost:3000');

  //socket.on('shipPosition',drawSecondPlayer);
  socket.on('keypressed',secondPlayerKeypressed);
  socket.on('keyreleased',secondPlayerKeyreleased);
}
 
// function drawSecondPlayer(data){
//   //console.log('Receiving: ' + data);
//     ship2.pos.x = data.x;
//     ship2.pos.y = data.y;
//     ship2.heading = data.heading;
//     ship2.boosting = data.boosting;

//     // ship2.update();
//     // ship2.render();
//     // ship2.edges();
//     if (data.keycode == 32) {
//       ship2.lasers.push(new Laser(ship2.pos, ship2.heading));
//     } else if (data.keycode == RIGHT_ARROW) {
//       //ship2.setRotation(0.1);
      
//     } else if (data.keycode == LEFT_ARROW) {
//       //ship2.setRotation(-0.1);
      
//     } else if (data.keycode == UP_ARROW) {
//       ship2.boosting = true;
//     } 
// }

function secondPlayerKeypressed(data){
  if(ship2.pos.x !== data.x){
    ship2.pos.x = data.x; 
  }
  if(ship2.pos.y !== data.y){
    ship2.pos.y = data.y;
  }
  if(ship2.heading !== data.heading){
    ship2.heading = data.heading;
  }
  if (data.keycode == 32) {
      ship2.lasers.push(new Laser(ship2.pos, ship2.heading));
  } 
  else if (data.keycode == RIGHT_ARROW) {
      ship2.setRotation(0.1);
      //ship2.heading += 0.8;
  } 
  else if (data.keycode == LEFT_ARROW) {
      ship2.setRotation(-0.1);
      //ship2.heading -= 0.8;
  } 
  else if (data.keycode == UP_ARROW) {
      ship2.boosting = true;
  } 
}
function secondPlayerKeyreleased(data){
  console.log('key realeased' + data)
  if(ship2.pos.x !== data.x){
    ship2.pos.x = data.x; 
  }
  if(ship2.pos.y !== data.y){
    ship2.pos.y = data.y;
  }
  if(ship2.heading !== data.heading){
    ship2.heading = data.heading;
  }
  if (data.keycode == RIGHT_ARROW || data.keycode == LEFT_ARROW) {
        ship2.setRotation(0);
      } else if (data.keycode == UP_ARROW) {
        ship2.boosting = false;
      }
}

function draw() {
  background(0);
  for (var i = debris.length - 1; i >= 0; i--) {
    debris[i].update();
    debris[i].render();
    if (debris[i].transparency <= 0) {
      debris.splice(i, 1);
    }
  }

  for (var i = energy.length - 1; i >= 0; i--) {
    energy[i].update();
    energy[i].render();
    energy[i].edges();
    if (ship.hit(energy[i]) && !ship.safe) {
      ship.safe = true;
      setTimeout(function() {
        ship.safe = !ship.safe;
      }, 2000);
      ship.getBonus();
      energy[i].alive = false;
    };
    if (ship2.hit(energy[i]) && !ship2.safe) {
      ship2.safe = true;
      setTimeout(function() {
        ship2.safe = !ship2.safe;
      }, 2000);
      ship2.getBonus();
      energy[i].alive = false;
    };
    if (energy[i].life <= 20) {
      energy[i].alive = false;
    };
    if (!energy[i].alive) {
      energy.splice(i, 1);
    };
  }
//***
if (ship2.alive) {
    ship2.update();
    ship2.render();
    ship2.edges();
  }  


  if (ship.alive) {
    ship.update();
    ship.render();
    ship.edges();
  } else {
    console.log("Game Over");
    message = "Game Over";
    //restart();
  };

  if (asteroids.length == 0) { // player cleared the level
    astnum += 3;
    initialize("You Win! Level up!", astnum);
  }

  for (var i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
    if (ship.hit(asteroids[i]) && !ship.safe) {
      ship.danger = true;
      setTimeout(function() {
        ship.danger = !ship.danger;
      }, 100);
      ship.getDamage(asteroids[i]);
      console.log("Damaging the shield " + ship.shieldLevel);
      asteroids[i].explode();
      asteroids.splice(i, 1);
      console.log(asteroids.length);
      //ship.explode();
    }
    else if(ship2.hit(asteroids[i]) && !ship2.safe) {
      ship2.danger = true;
      setTimeout(function() {
        ship2.danger = !ship2.danger;
      }, 100);
      ship2.getDamage(asteroids[i]);
      console.log("Damaging the shield " + ship2.shieldLevel);
      asteroids[i].explode();
      asteroids.splice(i, 1);
      console.log(asteroids.length);
      //ship2.explode();
    }
  }

  //interface info
  ship.interface(0);
  ship2.interface(500);
  }


  function initialize(messageText, newastnum) {
    message = messageText;
    gameLevel += 1;
    astnum = newastnum;
    basicinit();
  }

  function restart(messageText, newastnum) {
    ship.init();
    gameLevel = 1;
    asteroids = [];
    energy = [];
    message = messageText;
    astnum = newastnum;
    basicinit();
  }

  function basicinit() {
    for (var i = 0; i < astnum; i++) {
      asteroids.push(new Asteroid());
    }
    ship.shieldLevel == 100;
    ship.safe = true;
    //***
    ship2.shieldLevel == 100;
    ship2.safe = true;

    setTimeout(function() {
      ship.safe = false;
      //***
      ship2.safe = false;
      message = "";
    }, 4000);

  }


  function keyReleased() {
    if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
      ship.setRotation(0);
    } else if (keyCode == UP_ARROW) {
      ship.boosting = false;
    }

    else if (key == 'D' || key == 'A') {
      ship2.setRotation(0);
    } else if (key == 'W') {
      ship2.boosting = false;
    }

    var data = {
      //Key codes: left 37, up 38, right 39, down 40, spacebar 32
      keycode: keyCode,
      x: ship.pos.x,
      y: ship.pos.y,
      heading: ship.heading

    }

    socket.emit('keyreleased',data);

  }


  function keyPressed() {
    // var key_press = String.fromCharCode(event.keyCode);
    // alert(event.keyCode+" | "+key_press);

    if (key == ' ') {
      ship.lasers.push(new Laser(ship.pos, ship.heading));
    } else if (keyCode == RIGHT_ARROW) {
      ship.setRotation(0.1);
    } else if (keyCode == LEFT_ARROW) {
      ship.setRotation(-0.1);
    } else if (keyCode == UP_ARROW) {
      ship.boosting = true;
    } 
    else if (key == 'À') {
      ship2.lasers.push(new Laser(ship2.pos, ship2.heading));
    } else if (key == 'D') {
      ship2.setRotation(0.1);
    } else if (key == 'A') {
      ship2.setRotation(-0.1);
    } else if (key == 'W') {
      ship2.boosting = true;
    }else if (keyCode == ENTER && message == "Game Over") {
      console.log("DAMN!!");
      restart("let's play again!", initastnum);
    }
    var data = {
      //Key codes: left 37, up 38, right 39, down 40, spacebar 32
       keycode: keyCode,
       x: ship.pos.x,
       y: ship.pos.y,
       heading: ship.heading

    }
    console.log('Sending: ' + data);
    socket.emit('keypressed',data);
  }

// function mainLoop(){
//   //console.log('timestamp: '+timestamp);
//   // Throttle the frame rate.    
//     // if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
//     //     requestAnimationFrame(mainLoop);
//     //     return;
//     // }
//     // lastFrameTimeMs = timestamp;

//   var data = {
//       //Key codes: left 37, up 38, right 39, down 40, spacebar 32
//       x: ship.pos.x,
//       y: ship.pos.y,
//       heading: ship.heading,
//       boosting: ship.boosting

//     }
//     socket.emit('shipPosition',data);
// requestAnimationFrame(mainLoop);
// }

