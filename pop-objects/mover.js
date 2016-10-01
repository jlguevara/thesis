/**
 * create a mover object that takes in the game object and a map of probabilities
 */

function Mover(game, probabilities) {
    this.game = game;
    this.values = [];
    this.labels = []; 
    this.total = 0;

    for (var key in probabilities) {
        var probability = probabilities[key];

        if (this.values.length === 0) {
            if (probability <= 0)
                throw new Error("illegal probability!");

            this.values.push(probability);
            this.labels.push(key);
        }
        else {
            var lastProb = this.values[this.values.length - 1];
            this.values.push(lastProb + probability);
            this.labels.push(key); 
        }

        this.total += probability;
    } 
};

Mover.prototype.nextMove = function() {
    var number = Math.random() * this.total;

    for (var i = 0; i < this.values.length; i++) {
        if (number < this.values[i])
            return this.labels[i];
    }
};

Mover.prototype.control = function(sprite) {
    // if sprite is dead, don't tween
    if (!sprite.alive)
        return;

    var move =  this.nextMove();

    switch (move) {
        case "up":
            var distance = 100;
            var moveTime = distance / settings.currentVelocity * 1000;
            var tween= this.game.add.tween(sprite).to( 
                    {y: sprite.y - distance}, moveTime, null, true, 0);
            tween.onComplete.add(function() { this.control(sprite);}, this);
            break;
        case "zigzag":
            var oldX = sprite.x;
            var xDistance = 150;
            var yDistance = 100;
            var verticalDistance = Math.sqrt(
                    Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
            var moveTime = verticalDistance / settings.currentVelocity * 1000;

            var tweenA = this.game.add.tween(sprite).to( 
                    {x: sprite.x - xDistance, y: sprite.y - yDistance}, moveTime);
            var tweenB = this.game.add.tween(sprite).to( 
                    {x: oldX, y: sprite.y - 2 * yDistance}, moveTime);

            tweenB.onComplete.add(function() { this.control(sprite);}, this);

            tweenA.chain(tweenB);
            tweenA.start();

            break;
        case "floatLeft":
            var newX = this.game.width * 0.1; // set the x mark at 10%
            if (sprite.x <= newX) {
                this.control(sprite);
                return;
            }

            var distance = sprite.x - newX;
            var moveTime = distance / settings.currentVelocity * 1000;
            var tween = this.game.add.tween(sprite).to({x: newX}, moveTime, null, true);
            tween.onComplete.add(function() { this.control(sprite);}, this);
            break;
        default:
            throw new Error("move " + move + " not supported");
    }
}
