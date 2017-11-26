function Asteroid(pos, vel, s) {
  console.log(s);
  // if (pos) {
  //   this.pos = pos.copy();
  // } else {
  //   this.pos = createVector(random(width), random(height));


  //   //Example [618.4054341695382, 150.3956591558591, 0]
  // }
  //console.log('position:'+pos+' velocity:'+vel);
  this.pos = createVector(pos[0],pos[1]);

  this.vel = createVector(vel[0],vel[1]);

  //this.vel = p5.Vector.random2D();
  
  //Example[0.9464429443608051, -0.32287110906621863, 0]
  //this.sides = 5;//floor(random(15, 30)) ;
  if (s) {
    this.sides = floor(s * 0.5);
  } else {
    this.sides = s;//floor(random(15, 30));
  }
console.log('sides: '+this.sides);
  this.rmin = 20;
  this.rmax = 40;
  this.r = map(this.sides, 15, 30, this.rmin, this.rmax);
console.log('radius: '+this.r);
  this.offset = [];
  for (var i = 0; i < this.sides; i++) {
    this.offset[i] = random(-5, 5); // alternative // -this.r/8, this.r/8
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
      var number= astnum;
       var position=[];
       position.push(pos);
       var velocity=[];
       velocity.push(vel);
       var sides=[];
       sides.push(s);
  // var data = {
  //      number: astnum,
  //      position: pos,
  //      velocity: vel,
  //      sides: s
  //   }
    //console.log('Requesting new Asteroid: ' + data);
    socket.emit('newAsteroidReq',{number,position,velocity,sides});
}

Asteroid.prototype.explode = function() {
  //var debrisVel = p5.Vector.random2D().mult(random(0.5, 1.5));
  var debrisVel = this.vel.copy();
  var debrisNum = this.r * 5;
  generateDebris(this.pos, debrisVel, debrisNum); // handeling ship explosion
}

Asteroid.prototype.breakup = function() {
  var newA = [];
  if (this.sides > 5) {
    newAsteroidReq(2, this.pos, 0, this.sides);
    newA = [1,2];//Dummy array
    //newA[0] = new Asteroid(this.pos, this.sides);
    //newA[1] = new Asteroid(this.pos, this.sides);
  }
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
  //ellipse(0, 0, this.r*2, this.r*2);
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