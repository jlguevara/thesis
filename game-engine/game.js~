GameState = function(game) {
    // new stuff
};

GameState.prototype = {
    preload: function() {
        // load images
        var imagePath = 'images/' + settings.assetsDirectory + '/';
        game.load.image('background', imagePath + settings.background + '.png');

        for (var i = 0; i < settings.images.length; i++) {
            var image = settings.images[i];
            game.load.image(image, imagePath + image + '.png');
        }

        game.load.image('popImage', imagePath + settings.popImage + '.png');
        game.load.image('rewardImage', imagePath + settings.rewardImage + '.png');
        game.load.image('backButton', imagePath + settings.backButton + '.png');
        game.load.image('playButton', imagePath + settings.playButton + '.png');

        // load sounds
        var soundsPath = 'sounds/' + settings.assetsDirectory + '/';
        game.load.audio('popSound', soundsPath + settings.popSound + '.mp3');
        game.load.audio('winSound', soundsPath + settings.winSound + '.mp3');
    },

    create: function() {
        var background = game.add.image(0,0, 'background');
        background.width = game.width;
        background.height = game.height;

        this.nextThingAt = 0;

        this.popSound = this.add.audio('popSound');

        this.score = 0;

        this.rewardImageStep = 0.9 * game.cache.getImage('rewardImage').width; 
        this.rewardImageX = game.cache.getImage('rewardImage').width / 2; 
        this.rewardImageY = game.cache.getImage('rewardImage').height / 2; 
    },

    update: function() {
        if (this.score == settings.goal) {
            return;
        }

        if (this.nextThingAt < this.time.now) {
            this.nextThingAt += settings.delay; 

            /*
            var balloonWidth = game.cache.getImage('balloon').width * 0.25;
            var x = Math.floor(Math.random() * (game.width - balloonWidth) + 
                    balloonWidth / 2) 
            */
            var x = Math.floor(Math.random() * game.width);
            var y = game.height;

            var imageToUse;
            if (Math.random() <= settings.goalImageProbability) {      
                imageToUse = settings.goalImage;
            }
            else {
                var index = Math.floor(Math.random() * settings.images.length);
                imageToUse = settings.images[index];
            }

            var sprite = game.add.sprite(x, y, imageToUse);
            sprite.anchor.setTo(0.5, 0.5);
            //balloon.scale.setTo(0.25, 0.25);

            this.physics.enable(sprite, Phaser.Physics.ARCADE);
            sprite.body.velocity.y = settings.velocity;

            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(this.spriteClicked, this);

            sprite.checkWorldBounds = true;
            sprite.outOfBoundsKill = true;
        }

    },

    render: function() {
        //this.game.debug.body(this.triangle);
    },

    spriteClicked: function(sprite, event) {
        if (sprite.key != settings.goalImage)
            return;

        if (this.score == settings.goal) 
            return;

        this.popSound.play();
        var x = sprite.x;
        var y = sprite.y;
        sprite.destroy();
        var pop = this.add.sprite(x, y, 'popImage');
        pop.scale.setTo(0.5, 0.5);
        pop.anchor.setTo(0.5, 0.5);
        pop.lifespan = settings.popLifeSpan;

        this.score++;

        var reward = game.add.image(x, y, 'rewardImage');
        reward.anchor.setTo(0.5, 0.5);
        reward.alpha = 0;
        var tween = game.add.tween(reward).to( 
                {x: this.rewardImageX, y: this.rewardImageY, alpha : 1}, 4000, null, 
                true, settings.popLifespan + 1000);

        var currentScore = this.score;
        tween.onComplete.add(function() { this.checkIfPlayerWon(currentScore);}, this);

        this.rewardImageX += this.rewardImageStep;

    },

    /* Have to pass in the score to avoid race conditions */
    checkIfPlayerWon: function(score) {
        if (score == settings.goal) {
            this.playerWon();
        }
        
    },

    playerWon: function() {
        // handle win situation
        /*
        this.add.text(game.width / 2, game.height / 2, settings.winMessage,
                {font: '30px KidsClub' , fill: '#fff', align: 'center'}); 
        */

        var winSound = this.add.audio('winSound');
        winSound.play();

        var backButton = game.add.image(0.35 * game.width,0.6 * game.height, 'backButton');
        backButton.anchor.setTo(0.5, 0.5);
        backButton.inputEnabled = true;
        backButton.events.onInputDown.add(this.backButtonClicked, this);

        var playButton = game.add.image(0.65 * game.width,0.6 * game.height, 'playButton');
        playButton.anchor.setTo(0.5, 0.5);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(this.playButtonClicked, this);
    },

    backButtonClicked: function() {
        console.log(location);
        location = ".";
    },

    playButtonClicked: function() {
        location = location;
    },

};


game.state.add('GameState', GameState);
