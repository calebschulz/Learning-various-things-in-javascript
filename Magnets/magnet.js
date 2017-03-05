function Magnet(x, y, t) {
    this.pos = createVector(x, y);
    this.repeller = t; // type of attractor


    this.show = function() {
        if (this.repeller === true) { // it's a repeller
            stroke(255, 0, 0);
            strokeWeight(4);
        } else { // it is an attractor
            stroke(255);
            strokeWeight(4);
        }
        point(this.pos.x, this.pos.y);
    }
}
