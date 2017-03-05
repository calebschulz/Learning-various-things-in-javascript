function Particle(x, y) {
    this.pos = createVector(x, y);
    this.prev = createVector(x, y); // for previous positions
    this.vel = createVector();
    //this.vel = p5.Vector.random2D(); // randomize direction of initil velocity
    //this.vel.setMag(random(2, 5)); // randomize magnitude of initil velocity
    this.acc = createVector();

    this.update = function() {
        this.vel.add(this.acc);
        this.vel.limit(5);
        this.pos.add(this.vel);

        this.acc.mult(0); // resetting acc value to zero each time
    }

    this.show = function() {
        stroke(0, 255, 0);
        strokeWeight(1);
        line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);

        //saving the last positions
        this.prev.x = this.pos.x;
        this.prev.y = this.pos.y;
    }

    this.attracted = function(obj) {
        var force = p5.Vector.sub(obj.pos, this.pos); // getting the direction of the force; vector pointing from the obj to the attractor (obj)
        var d = force.mag();
        if(d < 10 && obj.repeller === false){
          force.mult(-1); // ivert the polarity of the magnets if distance is too close
        }
        d = constrain(d, 5, 25);
        var G = 3; // 6.67408 totally arbitrary value
        var forceStrength = G / (d * d); // if we assume masses = 1; //THIS IS THE FORCE MAGNITUDE
        force.setMag(forceStrength); // setting the magnitude of the force according to the grav/attrac formula
        if (obj.repeller === true) {
            force.mult(-1); // REPULSION is just the OPPOSITE OF ATTRACTION
        }
        this.acc.add(force); // adding all the forces deriving from all the multiple attractors
    }

}
