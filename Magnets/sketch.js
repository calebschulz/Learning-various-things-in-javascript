// based on Coding Challenge #56: Attraction and Repulsion Forces. Mathematical Rose Patterns https://www.youtube.com/watch?v=OAcXnzRNiCY
var Magnet;
var particles = [];
var magnets = [];
var roff = 6; //ofsetting the origin of my particles

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(100);
    for (var i = 0; i < 50; i++) {
        //particles.push(new Particle(width/2, height/2));
        //particles.push(new Particle(width/2 + random(-roff , roff ), height/2 + random(-roff , roff )));
        particles.push(new Particle(random(width), random(height)));
    }
    /*
    for (var i = 0; i < 10; i++) {
        magnets.push(new Magnet(random(width), random(height)));
    }
    */
}


function draw() {
    background(41);

    for (var i = 0; i < particles.length; i++) {
        for (var j = 0; j < magnets.length; j++) {
            magnets[j].show();
            particles[i].attracted(magnets[j]);
        }
        particles[i].update();
        particles[i].show();
    }
}

function mousePressed() {
  if(keyIsPressed === true){
    magnets.push(new Magnet(mouseX, mouseY, true));
  } else {
    magnets.push(new Magnet(mouseX, mouseY, false));
  }
}
