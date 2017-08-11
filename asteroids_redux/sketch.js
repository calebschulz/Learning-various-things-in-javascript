var ship;
var asteroids = [];
var astnum;
var initastnum = 2;
var debris = [];
var energy = [];
var gameLevel = 0;
var message;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Courier");
  ship = new Ship();
  initialize("let's play!", initastnum);
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
    if (energy[i].life <= 20) {
      energy[i].alive = false;
    };
    if (!energy[i].alive) {
      energy.splice(i, 1);
    };
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
      //console.log(asteroids.length);
      //ship.explode();
    }
  }

  //interface info
  ship.interface();
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
    setTimeout(function() {
      ship.safe = false;
      message = "";
    }, 4000);
  }


  function keyReleased() {
    if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
      ship.setRotation(0);
    } else if (keyCode == UP_ARROW) {
      ship.boosting = false;
    }
  }

  function keyPressed() {
    if (key == ' ') {
      ship.lasers.push(new Laser(ship.pos, ship.heading));
    } else if (keyCode == RIGHT_ARROW) {
      ship.setRotation(0.1);
    } else if (keyCode == LEFT_ARROW) {
      ship.setRotation(-0.1);
    } else if (keyCode == UP_ARROW) {
      ship.boosting = true;
    } else if (keyCode == ENTER && message == "Game Over") {
      console.log("DAMN!!");
      restart("let's play again!", initastnum);
    }
  }
