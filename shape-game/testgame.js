GameState = function(game) {
    this.GOAL = 3;                          // score needed to win
    this.NUMBER_OF_SHAPES = 4;
    this.INDEX_OF_FIRST_SHAPE = 100;
    this.DISTANCE_BETWEEN_SHAPES = 200;       // distance between shapes

    this.shapeNames = ['triangle', 'star', 'square', 'circle'];
    this.shapesUsed = [];   // names of shapes currently being used in this iteration
    this.shapes = [];       // array of sprites

    this.score = 0;
    this.directions;    // directions for the user
    this.correctShape;  // the correct shape
};

GameState.prototype = {
    preload: function() {
        // load images
        game.load.image('background', 'images/background.png');
        game.load.image('triangle', 'images/triangle.png');
        game.load.image('star', 'images/star.png');
        game.load.image('square', 'images/square.png');
        game.load.image('circle', 'images/circle.png');

        // load sounds
        game.load.audio('goodJob', 'sounds/goodJob.m4a');
        game.load.audio('tryAgain', 'sounds/tryAgain.m4a');
        game.load.audio('congrats', 'sounds/congrats.m4a');
    },

    create: function() {

        this.goodJob = this.add.audio('goodJob');
        this.tryAgain = this.add.audio('tryAgain');
        this.congrats = this.add.audio('congrats');

        game.add.sprite(0, 0, 'background');
        this.createShapes();
        this.selectRandomShape();

        this.scoreNode = this.add.text(this.game.width / 2, 20,
                "Score: " + this.score,
                {font: '30px KidsClub' , fill: '#fff', align: 'center'}); 
    },

    createShapes: function() {
        this.shapesUsed = this.getRandomElements(this.shapeNames, 
                this.NUMBER_OF_SHAPES);

        for (var i = 0; i < this.NUMBER_OF_SHAPES; i++) {
            var shapeName = this.shapesUsed[i];
            var x = this.INDEX_OF_FIRST_SHAPE + i * this.DISTANCE_BETWEEN_SHAPES;
            var y = -game.cache.getImage(shapeName).height;

            var shape = game.add.sprite(x, y, shapeName);
            shape.name = shapeName;
            shape.anchor.setTo(0.5, 0.5);

            shape.angle = -20;
            shape.rotateLeft = false;

            shape.inputEnabled = true;
            shape.events.onInputDown.add(this.shapeClicked, this);
            this.shapes.push(shape);
        }
    },

    update: function() {

        for (var i = 0; i < this.shapes.length; i++) {
            var shape = this.shapes[i];

            if (shape.y < game.height / 2) { 
                shape.y += 1;
                if (shape.angle === 20) {
                    shape.rotateLeft = true;
                }
                else if (shape.angle == -20) {
                    shape.rotateLeft = false;
                }

                if (shape.rotateLeft) 
                    shape.angle -= 1;
                else
                    shape.angle += 1;
            }
        }

    },

    render: function() {
        //this.game.debug.body(this.triangle);
    },

    selectRandomShape: function() {
        var index = Math.floor(Math.random() * this.shapes.length);
        this.correctShape = this.shapes[index];

        this.directions = this.add.text(this.game.width / 2, this.game.height * 0.3,
                "Please touch the " + this.correctShape.name,
                {font: '30px KidsClub', fill: '#fff', align: 'center'}); 
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
        // make sure shape is ready
        if (sprite.y < game.height / 2) 
            return

        if (sprite == this.correctShape) {
            this.goodJob.play();
            this.score++;

            if (this.score === this.GOAL) {
                this.scoreNode.destroy();
                this.directions.destroy();

                while (this.shapes.length != 0) {
                    this.shapes.pop().destroy();
                }

                this.add.text(this.game.width / 2, this.game.height / 2,
                        "YOU WIN!",
                        {font: '20px KidsClub', fill: '#fff', align: 'center'}); 
                game.time.events.add(1000, this.playCongrats, this);
                return;
            }
        }
        else {
            this.tryAgain.play();
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

    playCongrats: function() {
        this.congrats.play();
    }
};

var game = new Phaser.Game(900, 480, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
