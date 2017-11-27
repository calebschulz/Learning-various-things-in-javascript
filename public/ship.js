function Ship() {
  this.pos = createVector(width / 2, height / 2 + 50);
  this.vel = createVector(0, 0);
  this.r = 10;
  this.heading = 0;
  this.rotation = 0;
  this.boosting = false;
  this.lasers = [];
  this.shieldLevel = 100;
  this.shieldMax = 200;
  this.alive = true;
  this.danger = false;
  this.safe = true;
  this.score = 0;
  this.red = random(255);
  this.green = random(255);
  this.blue = random(255);

}
Ship.prototype.interface = function(offset) {
  textSize(14);
  fill(this.red,this.green,this.blue);
  noStroke();
  if(offset){
    text("Player 2", 50 + offset, 35);
  }
  else{
    text("Player 1", 50, 35)
  }
  text("Score = " + this.score, 50+offset, 50);
  //text("Shield = " + constrain(round(ship.shieldLevel), 0, 100), 50, 65);
  if (this.shieldLevel >= this.shieldMax) {
    text("Shield = Max!", 50+offset, 65);
  } else {
    text("Shield = " + constrain(round(this.shieldLevel), 0, round(this.shieldLevel)), 50+offset, 65);
  }
  text("Level = " + gameLevel, 50+offset, 80);
  if (message) {
    textSize(32);
    text(message, width / 2 - message.length * 10, height / 2);
  }
}

Ship.prototype.init = function() {
  this.pos = createVector(width / 2, height / 2 + 50);
  this.vel = createVector(0, 0);
  ship.alive = true;
  ship.score = 0;
  ship.shieldLevel = 100;
}

Ship.prototype.hit = function(obj) {
  var d = dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
  if (d < this.r + obj.r) {
    return true;
  } else {
    return false;
  }
}

Ship.prototype.getDamage = function(obj) {
  var damount = obj.r; // the bigger the object hitting the ship the heavier the damage amount
  this.shieldLevel -= damount;
  if (this.shieldLevel <= 0) {
    this.explode();
  }
}

Ship.prototype.getBonus = function() {
  this.shieldLevel += 30;
  this.score += 20;
  this.shieldLevel = constrain(this.shieldLevel, 0, this.shieldMax);
}

Ship.prototype.explode = function() {
  var debrisVel = p5.Vector.random2D().mult(random(0.5, 1.5));
  //var debrisVel = p5.Vector.add(this.lasers[i].vel.mult(0.2), asteroids[j].vel);
  var debrisNum = 50;
  generateDebris(this.pos, debrisVel, debrisNum); // handeling ship explosion
  this.alive = false;
}

Ship.prototype.update = function() {
  this.pos.add(this.vel);
  this.vel.mult(0.99); // simulating friction
  this.turn();
  if (this.boosting) {
    this.boost();
  }
  for (var i = this.lasers.length - 1; i >= 0; i--) {
    this.lasers[i].render();
    this.lasers[i].update();
    //console.log(this.lasers.length);
    if (this.lasers[i].offscreen()) { // cleaning up my laser beam array when beams are out off the screen
      this.lasers.splice(i, 1);
      //console.log(this.lasers.length);
    } else {
      for (var j = asteroids.length - 1; j >= 0; j--) {
        if (this.lasers[i].hits(asteroids[j])) {
          console.log("asteroid number " + j + " has been hitted! " + asteroids.length);
          var debrisVel = p5.Vector.add(this.lasers[i].vel.mult(0.2), asteroids[j].vel);
          var debrisNum = (asteroids[j].r) * 5;
          generateDebris(asteroids[j].pos, debrisVel, debrisNum); // handeling asteroids explosions
          var newAsteroids = asteroids[j].breakup(); // returns an array of two smaller asteroids
          if (newAsteroids.length > 0) {
            //console.log(newAsteroids);
            //asteroids.push(newAsteroids[0]); //asteroids.push(newAsteroids[1]);
            var probability = random() * 100;
            if (probability > 80) {
              //console.log("Shupershield!!!!");
              generateEnergy(asteroids[j].pos, debrisVel);
            }

            //asteroids = asteroids.concat(newAsteroids); // concatenating (merging) arrays // https://www.w3schools.com/js/js_array_methods.asp
          } else {
            //update the score and do something else
            this.score += 10;
            //console.log(this.score);
          }
          asteroids.splice(j, 1); // removing the hitted asteroid
          this.lasers.splice(i, 1); // removing the laser beam that hitted the target to prevent hitting the newly created smaller asteroids
          waitForServerResponse = true;
          break; // exiting the loop to be safe not checking already removed stuff
        }
      }
    }
  }
}

Ship.prototype.boost = function() {
  var boostForce = p5.Vector.fromAngle(this.heading);
  boostForce.mult(0.1);
  this.vel.add(boostForce);
}

Ship.prototype.render = function() {
  push();
  translate(this.pos.x, this.pos.y);
  rotate(this.heading + PI / 2);
  fill(0);
  if (this.boosting) {
    //console.log("bosting");
    stroke(255, 0, 0);
    line(-this.r + 3, this.r + 3, this.r - 3, this.r + 3);
  }
  if (this.danger) {
    stroke(255, 0, 0);
  } else if (this.safe) {
    stroke(0, 255, 0);
  } else {
    stroke(this.red,this.green,this.blue);
  }

  triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
  pop();
}

Ship.prototype.edges = function() {
  if (this.pos.x > width + this.r) {
    this.pos.x = -this.r;
  } else if (this.pos.x < -this.r) {
    this.pos.x = width + this.r;
  }
  if (this.pos.y > height + this.r) {
    this.pos.y = -this.r;
  } else if (this.pos.y < -this.r) {
    this.pos.y = height + this.r;
  }
}

Ship.prototype.setRotation = function(angle) {
  this.rotation = angle;
}

Ship.prototype.turn = function(angle) {
  this.heading += this.rotation;
}