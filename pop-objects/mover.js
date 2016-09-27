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
            var tween= this.game.add.tween(sprite).to( 
                    {y: sprite.y - 100}, 1500, null, true, 0);
            tween.onComplete.add(function() { this.control(sprite);}, this);
            break;
        case "zigzag":
            var oldX = sprite.x;

            var tweenA = this.game.add.tween(sprite).to( 
                    {x: sprite.x - 100, y: sprite.y - 100}, 1500);
            var tweenB = this.game.add.tween(sprite).to( 
                    {x: oldX, y: sprite.y - 200}, 1500);

            tweenB.onComplete.add(function() { this.control(sprite);}, this);

            tweenA.chain(tweenB);
            tweenA.start();

            break;
        default:
            throw new Error("move " + move + " not supported");
    }
}
