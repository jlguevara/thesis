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
        game.load.audio('goalSound', soundsPath + settings.goalSound + '.mp3');
    },

    create: function() {
        var background = game.add.image(0,0, 'background');
        background.width = game.width;
        background.height = game.height;

        var goalSound = this.add.audio('goalSound');
        goalSound.play();

        var goalImage = game.add.image(game.width / 2, game.height / 2, 'goalImage');
        goalImage.anchor.setTo(0.5, 0.5);
        goalImage.inputEnabled = true;
        goalImage.events.onInputDown.add(this.startGame, this);

    },

    startGame: function() {
        game.state.start("GameState");
    }

}

var game = new Phaser.Game(950, 525, Phaser.AUTO);
game.state.add("GameIntro", gameIntro);
game.state.start("GameIntro");
