GameState = function(game) {
    this.NUMBER_OF_SHAPES = 3;
    this.TOP_SCORE = 5;
};

GameState.prototype = {
    create: function() {
        this.score = 0;
        this.scoreNode = this.add.text(this.game.width / 2, 20,
                "Score: " + this.score,
                {font: '100px', fill: '#fff', align: 'center'}); 
        this.scoreNode.anchor.setTo(0.5, 0.5);

        this.shapes = []
        this.createShapes();
        this.selectRandomShape();

    },

    createShapes: function() {
        var shapeNames = ["TRIANGLE", "RECTANGLE", "CIRCLE", "SQUARE"];
        var height = this.game.height * 0.5;

        var shapeNamesUsed = this.getRandomElements(shapeNames, 
                this.NUMBER_OF_SHAPES);

        for (var i = 0; i < shapeNamesUsed.length; i++) {
            var shape = this.add.text(this.game.width * 0.1 + i * 200, height, 
                    shapeNamesUsed[i],
                    {font: '50px', fill: '#fff', align: 'center'}); 
            shape.inputEnabled = true;
            shape.events.onInputDown.add(this.shapeClicked, this);
            this.shapes.push(shape);
        }
    },

    selectRandomShape: function() {
        var index = Math.floor(Math.random() * this.shapes.length);
        this.correctShape = this.shapes[index];

        this.directions = this.add.text(this.game.width / 2, this.game.height * 0.3,
                "Please click on the " + this.correctShape.text,
                {font: '100px', fill: '#fff', align: 'center'}); 
        this.directions.anchor.setTo(0.5, 0.5);
    },

    getRandomElements: function(array, n) {
        sourceArray = array.slice(0);
        var result = [];

        for (var i = 0; i < n; i++) {
            var index = Math.floor(Math.random() * sourceArray.length);
            result.push(sourceArray[index]);
            sourceArray.splice(index, 1);
        }
        return result;
    },

    shapeClicked: function(sprite, event) {
        if (sprite == this.correctShape) {
            this.score++;

            if (this.score === this.TOP_SCORE) {
                this.scoreNode.destroy();
                this.directions.destroy();

                while (this.shapes.length != 0) {
                    this.shapes.pop().destroy();
                }

                this.add.text(this.game.width / 2, this.game.height / 2,
                        "YOU WIN!",
                        {font: '100px', fill: '#fff', align: 'center'}); 
                return;
            }
        }
        else {
            this.score = 0;
        }

        this.scoreNode.text = "Score: " + this.score;
        this.directions.destroy();
        while (this.shapes.length != 0) {
            this.shapes.pop().destroy();
        }
        this.createShapes();
        this.selectRandomShape();

    },
};

var game = new Phaser.Game(640, 480, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
