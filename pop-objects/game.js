GameState = function(game) {
    // new stuff
    this.LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
                    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    this.NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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

        game.load.image('goalImage', imagePath + settings.goalImage + '.png');
        game.load.image('rewardImage', imagePath + settings.rewardImage + '.png');
        game.load.image('popImage', imagePath + settings.popImage + '.png');
        game.load.image('rewardImage', imagePath + settings.rewardImage + '.png');
        game.load.image('backButton', imagePath + settings.backButton + '.png');
        game.load.image('playAgainButton', imagePath + settings.playAgainButton + '.png');

        // load sounds
        var soundsPath = 'sounds/' + settings.assetsDirectory + '/';
        game.load.audio('popSound', soundsPath + settings.popSound + '.mp3');
        game.load.audio('winSound', soundsPath + settings.winSound + '.mp3');
        game.load.audio('wrongChoiceSound', 
                soundsPath + settings.wrongChoiceSound + '.mp3');
    },

    create: function() {
        var background = game.add.image(0,0, 'background');
        background.width = game.width;
        background.height = game.height;

        this.nextThingAt = 0;

        this.popSound = this.add.audio('popSound');
        this.wrongSound = this.add.audio('wrongChoiceSound');

        this.score = 0;

        this.rewardImageStep = 0.9 * game.cache.getImage('rewardImage').width; 
        this.rewardImageX = game.cache.getImage('rewardImage').width / 2; 
        this.rewardImageY = game.cache.getImage('rewardImage').height / 2; 

        // set up the mover object
        this.mover = new Mover(game, settings.moves);
    },

    update: function() {
        if (this.score == settings.goal) {
            return;
        }

        if (this.nextThingAt < this.time.now) {
            this.nextThingAt = this.time.now + settings.delay; 

            /*
            var balloonWidth = game.cache.getImage('balloon').width * 0.25;
            var x = Math.floor(Math.random() * (game.width - balloonWidth) + 
                    balloonWidth / 2) 
            */

            var sprite = this.generateSprite(); 

            this.physics.enable(sprite, Phaser.Physics.ARCADE);

            if (sprite.key != 'goalImage') {
                sprite.body.velocity.y = -settings.currentVelocity;
            }

            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(this.spriteClicked, this);

            sprite.checkWorldBounds = true;
            sprite.outOfBoundsKill = true;
        }

    },

    generateSprite: function() {
        var x = Math.floor(Math.random() * game.width);
        var y = game.height;

        if (settings.goalText) {
            var sprite = game.add.sprite(x, y, 'goalImage');
            sprite.anchor.setTo(0.5, 0.5);

            var context;
            switch (settings.context) {
                case "letters":
                    context = this.LETTERS;
                    break;
                case "numbers":
                    context = this.NUMBERS;
                    break;
                default:
                    context = settings.context;
            } 

            // remove the goal from the context to simplify the probabily calculation
            var index = context.indexOf(settings.goalText);
            if (index != -1)
                context.splice(index, 1);
            
            var textToUse;
            if (Math.random() <= settings.goalImageProbability) {
                textToUse = settings.goalText;
            }
            else {
                var index = Math.floor(Math.random() * context.length);
                textToUse = context[index];
            }

            var textNode = this.add.text(0, -10, textToUse,
                    {font: '100px Helvetica' , fill: '#fff', align: 'center'}); 
            textNode.anchor.setTo(0.5, 0.5);
            sprite.addChild(textNode);

            return sprite;
        }
        else {
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

            if (imageToUse == 'goalImage') {
                this.mover.control(sprite);
            }
            return sprite;
        }
    },

    render: function() {
        //this.game.debug.body(this.triangle);
    },

    spriteClicked: function(sprite, event) {
        if (sprite.key != 'goalImage') {
            this.wrongSound.play();
            return;
        }

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

        var playButton = 
            game.add.image(0.65 * game.width,0.6 * game.height, 'playAgainButton');
        playButton.anchor.setTo(0.5, 0.5);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(this.playButtonClicked, this);

        var key = location.href + "velocity";
        var velocity = settings.currentVelocity + settings.velocityIncrease;
        localStorage[key] = velocity;

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
