function Laser(spos, angle) {
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(10);
  this.r = 1;
}

// collision detection for asteroids and other eventual additional stuff
Laser.prototype.hits = function(target) {
  var d = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
  if(d < this.r + target.r){
    //console.log("hit!");
    return true;
  } else {
    return false;
  }
}

Laser.prototype.update = function() {
  this.pos.add(this.vel);
}

Laser.prototype.render = function() {
  push();
  strokeWeight(2);
  stroke(255);
  point(this.pos.x, this.pos.y);
  pop();
}

Laser.prototype.offscreen = function() {
  if (this.pos.x > width + this.r || this.pos.x < -this.r || this.pos.y > height + this.r || this.pos.y < -this.r) {
    return true;
  } else {
    return false;
  }
}
