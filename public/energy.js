function Energy(pos, vel) {
  this.pos = pos.copy();
  this.vel = vel.copy();
  this.vel.mult(-0.2);
  //this.vel.add(p5.Vector.random2D().mult(-0.5));
  this.r = 10;
  this.life = random(100, 300);
  this.alive = true;

  this.update = function() {
    this.pos.add(this.vel);
    this.life -= 0.2;
  }

  this.render = function() {
    if (this.life > 20) {
      noFill();
      stroke(0, this.life, 0);
      ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }
  }
}

Energy.prototype.edges = function() {
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

function generateEnergy(pos, vel) {
    energy.push(new Energy(pos, vel));
}