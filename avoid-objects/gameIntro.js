var gameIntro = function(game) {
}

gameIntro.prototype = {
    preload: function() {
        // load images
        var imagePath = 'images/' + settings.assetsDirectory + '/';
        game.load.image('background', imagePath + settings.background + '.png');

        game.load.image('goalImage', imagePath + settings.goalImage + '.png');
        game.load.image('playButton', imagePath + settings.playButton + '.png');

        // load sounds
        var soundsPath = 'sounds/' + settings.assetsDirectory + '/';
        game.load.audio('directions', soundsPath + settings.directions + '.mp3');
    },

    create: function() {
        var background = game.add.image(0,0, 'background');
        background.width = game.width;
        background.height = game.height;

        var directions = this.add.audio('directions');
        directions.play();

        var goalImage = game.add.image(game.width / 2, 0.3 * game.height, 'goalImage');
        goalImage.anchor.setTo(0.5, 0.5);
        goalImage.inputEnabled = true;
        goalImage.events.onInputDown.add(this.startGame, this);

        var playbutton = game.add.image(game.width / 2, 0.7 * game.height, 'playButton');
        playbutton.anchor.setTo(0.5, 0.5);
        playbutton.inputEnabled = true;
        playbutton.events.onInputDown.add(this.startGame, this);

        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", 
                    boundsAlignV: "middle" };


        settings.level = this.getLevel();
        var levelTextNode = game.add.text(game.width / 2, 0.9 * game.height, 
                "Level " + settings.level, style);
        levelTextNode.anchor.setTo(0.5, 0.5);
    },

    startGame: function() {
        game.state.start("GameState");
    },

    getLevel: function() {
        var key = location.href + "velocity";
        var velocity = Number(localStorage[key]);
        if (velocity) {
            var diff = velocity - settings.velocity;
            return 1 + diff / settings.velocityIncrease;
        }
        return 1;
    }
}

var game = new Phaser.Game(950, 525, Phaser.AUTO);
game.state.add("GameIntro", gameIntro);
game.state.start("GameIntro");
