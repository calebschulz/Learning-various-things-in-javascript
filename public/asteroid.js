function Asteroid(posX, posY, vel, s) {
  console.log('new astroid vel:'+vel);

  this.pos = createVector(posX,posY);

  this.vel = createVector(vel[0],vel[1]);

  if (s) {
    this.sides = floor(s * 0.5);
  } else {
    this.sides = s;
  }
console.log('sides: '+this.sides);
  this.rmin = 20;
  this.rmax = 40;
  this.r = map(this.sides, 15, 30, this.rmin, this.rmax);
console.log('radius: '+this.r);
  this.offset = [];
  for (var i = 0; i < this.sides; i++) {
    this.offset[i] = random(-5, 5); 
  }
  this.angle = 0;
  var increment = map(this.r, this.rmin, this.rmax, 0.1, 0.01);
  if (random() > 0.5) {
    this.increment = increment * -1;
  } else {
    this.increment = increment;
  }
}

function newAsteroidReq(astnum, pos, vel, s){
    var number = astnum;
    var positionX = [];
    var positionY = [];
    if(pos === 0){
      positionX = positionX.concat(pos);
      positionY = positionY.concat(pos);
    }
    else{
      positionX = positionX.concat(pos.x);
      positionY = positionY.concat(pos.y);
    }
    
    
    var velocity=[];
    velocity = velocity.concat(vel);
    var sides=[];
    sides.push(s);
    console.log('Build astroid data to send to server');

    console.log('Requesting new Asteroid: number:' + number +' position:' +positionX+positionY+' velocity:'+velocity+' Sides:'+sides);
    socket.emit('newAsteroidReq',{number,positionX,positionY,velocity,sides});
}

Asteroid.prototype.explode = function() {
  var debrisVel = this.vel.copy();
  var debrisNum = this.r * 5;
  generateDebris(this.pos, debrisVel, debrisNum); // handeling ship explosion
}

Asteroid.prototype.breakup = function() {
  console.log('Astroid breakup');
  var newA = [];
  if (this.sides > 5) {
    console.log('Big Astroid breakup');
    newAsteroidReq(2, this.pos, 0, this.sides);
    newA = [1,2];//Dummy array
    console.log('WaitforServer breakup f true');
    waitForServerResponse = true;
  }
  waitForServerResponse = false;
  return newA; // returning the array with my new asteroids
}
 
Asteroid.prototype.update = function() {
  this.pos.add(this.vel);
  this.angle += this.increment;
}

Asteroid.prototype.render = function() {
  push();
  translate(this.pos.x, this.pos.y);
  rotate(this.angle);
  noFill();
  stroke(255);
  beginShape();
  for (var i = 0; i < this.sides; i++) {
    var angle = map(i, 0, this.sides, 0, TWO_PI);
    var r = this.r + this.offset[i];
    var x = r * cos(angle);
    var y = r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
}

Asteroid.prototype.edges = function() {
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

Asteroid.prototype.setRotation = function(angle) {
  this.rotation = angle;
}

Asteroid.prototype.turn = function(angle) {
  this.heading += this.rotation;
}