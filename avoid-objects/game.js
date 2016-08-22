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

        game.load.image('playerImage', imagePath + settings.playerImage + '.png');
        game.load.image('popImage', imagePath + settings.popImage + '.png');
        game.load.image('rewardImage', imagePath + settings.rewardImage + '.png');
        game.load.image('goalImage', imagePath + settings.goalImage + '.png');
        game.load.image('lifeImage', imagePath + settings.lifeImage + '.png');
        game.load.image('backButton', imagePath + settings.backButton + '.png');
        game.load.image('playButton', imagePath + settings.playButton + '.png');
        game.load.image('playAgainButton', imagePath + settings.playAgainButton + '.png');

        // load sounds
        var soundsPath = 'sounds/' + settings.assetsDirectory + '/';
        game.load.audio('popSound', soundsPath + settings.popSound + '.mp3');
        game.load.audio('winSound', soundsPath + settings.winSound + '.mp3');
        game.load.audio('gameOverSound', soundsPath + settings.gameOverSound + '.mp3');
    },

    create: function() {
        var background = game.add.image(0,0, 'background');
        background.width = game.width;
        background.height = game.height;

        this.setupPlayer();

        // group for falling objects
        this.enemyGroup = game.add.group();

        this.nextThingAt = 0;

        this.score = 0;

        this.rewardImageStep = 0.9 * game.cache.getImage('rewardImage').width; 
        this.rewardImageX = game.cache.getImage('rewardImage').width / 2; 
        this.rewardImageY = game.cache.getImage('rewardImage').height / 2; 

        this.setupLives();

    },

    setupLives: function() {
        this.lives = settings.lives;
        this.livesArray = []

        var step = game.cache.getImage('lifeImage').width; 
        var x = game.width - game.cache.getImage('lifeImage').width / 2; 
        var y = game.cache.getImage('lifeImage').height / 2; 

        for (var i = 0; i < this.lives; i++) {
            var lifeSprite = game.add.sprite(x - step * i, y, 'lifeImage');
            lifeSprite.anchor.setTo(0.5, 0.5);
            this.livesArray.push(lifeSprite);
        }
    },

    setupPlayer: function() {
        this.player = game.add.sprite(game.width / 2, game.height / 2, 'playerImage');
        this.player.inputEnabled = true;
        this.player.input.enableDrag();

        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.anchor.setTo(0.5, 0.5);
    },

    update: function() {
        if (this.score == settings.goal || this.lives == 0) {
            return;
        }

        this.physics.arcade.overlap(
                this.player, this.enemyGroup, this.playerHit, null, this);

        if (this.nextThingAt < this.time.now) {
            this.nextThingAt += settings.delay; 

            var x = Math.floor(Math.random() * game.width);
            var y = 0;

            var imageToUse;
            if (Math.random() <= settings.goalImageProbability) {      
                imageToUse = 'goalImage';
            }
            else {
                var index = Math.floor(Math.random() * settings.images.length);
                imageToUse = settings.images[index];
            }
            
            var sprite = game.add.sprite(x, y, imageToUse);
            sprite.anchor.setTo(0.5, 0.5);
            this.enemyGroup.add(sprite);

            this.physics.enable(sprite, Phaser.Physics.ARCADE);
            sprite.body.velocity.y = settings.velocity;

            sprite.checkWorldBounds = true;
            sprite.outOfBoundsKill = true;
        }

    },

    render: function() {
        /*
        this.game.debug.body(this.player, '#00ff00');
        this.game.debug.spriteInfo(this.player, 32, 32);
        */
    },

    playerHit: function(player, fallingObject) {

        if (this.player.alpha < 1) 
            return;

        fallingObject.kill();

        // we caught the goal image
        if (fallingObject.key == 'goalImage') {
            this.score++;

            var x = player.x;
            var y = player.y;
            var reward = game.add.image(x, y, 'rewardImage');
            reward.anchor.setTo(0.5, 0.5);
            reward.alpha = 0;
            var tween = game.add.tween(reward).to( 
                    {x: this.rewardImageX, y: this.rewardImageY, alpha : 1}, 4000, null, 
                    true, settings.popLifespan + 1000);

            var currentScore = this.score;
            tween.onComplete.add(function() { this.checkIfPlayerWon(currentScore);}, this);
            this.rewardImageX += this.rewardImageStep;
        }
        else {
            this.lives--;
            this.livesArray[this.lives].kill();
            this.player.alpha = 0;
            var x = this.player.x;
            var y = this.player.y;

            var pop = this.add.sprite(x, y, 'popImage');
            pop.anchor.setTo(0.5, 0.5);
            pop.lifespan = settings.popLifeSpan;

            if (this.lives > 0) {
                x = game.width / 2;
                y = game.height / 2;
                game.add.tween(player).to( {x: x, y: y, alpha : 1}, 4000, null, true, 
                        settings.popLifespan + 1000)
            }
            else {
                var gameOverSound = this.add.audio('gameOverSound');
                gameOverSound.play();
                this.displayEndMenu();
            }
        }
    },

    /* Have to pass in the score to avoid race conditions */
    checkIfPlayerWon: function(score) {
        if (score == settings.goal) {
            var winSound = this.add.audio('winSound');
            winSound.play();
            this.displayEndMenu();
        }
        
    },

    displayEndMenu: function() {

        var backButton = 
            game.add.image(0.35 * game.width,0.6 * game.height, 'backButton');
        backButton.anchor.setTo(0.5, 0.5);
        backButton.inputEnabled = true;
        backButton.events.onInputDown.add(this.backButtonClicked, this);

        var playButton = 
            game.add.image(0.65 * game.width,0.6 * game.height, 'playAgainButton');
        playButton.anchor.setTo(0.5, 0.5);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(this.playButtonClicked, this);
    },

    backButtonClicked: function() {
        console.log(location);
        location = "..";
    },

    playButtonClicked: function() {
        location = location;
    },
    
};

game.state.add('GameState', GameState);
