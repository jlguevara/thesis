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

        // load game images
        for (var i = 0; i < settings.images.length; i++) {
            var image = settings.images[i];
            game.load.image(image, imagePath + image + '.png');
        }

        // load goal images, override any image with same name
        for (var i = 0; i < settings.goalImage.length; i++) {
            var image = settings.goalImage[i];
            game.load.image(image, imagePath + image + '.png', true);
        }

        game.load.image('rewardImage', imagePath + settings.rewardImage + '.png');
        game.load.image('popImage', imagePath + settings.popImage + '.png');
        game.load.image('backButton', imagePath + settings.backButton + '.png');
        game.load.image('playAgainButton', imagePath + settings.playAgainButton + '.png');

        // load sounds
        var soundsPath = 'sounds/' + settings.assetsDirectory + '/';
        for (var i = 0; i < settings.goalSound.length; i++) {
            game.load.audio(settings.goalSound[i], 
                    soundsPath + settings.goalSound[i] + '.mp3');
        }
        game.load.audio('targetScoreSound', soundsPath + settings.goal + '.mp3');
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
        this.goalIndex = 0; // index of the goal image

        this.stars = game.add.group();
        this.setupStars();

        // set up level text
         var style = { font: "bold 32px Arial", fill: "#0f0", boundsAlignH: "center", 
                    boundsAlignV: "middle" };

        var levelTextNode = game.add.text(game.width * 0.9, game.height * 0.9, 
                "Level " + settings.level, style);
        levelTextNode.anchor.setTo(0.5, 0.5);

        // set up the mover object
        this.mover = new Mover(game, settings.moves);
    },

    setupStars: function() {
        this.stars.forEach(function (s) { s.kill(); });

        this.rewardImageStep = 0.9 * game.cache.getImage('rewardImage').width; 
        this.rewardImageX = game.cache.getImage('rewardImage').width / 2; 
        this.rewardImageY = game.cache.getImage('rewardImage').height / 2; 
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

            if (sprite.key != settings.goalImage[this.goalIndex]) {
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
            var sprite = game.add.sprite(x, y, settings.goalImage[this.goalIndex]);
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
                imageToUse = settings.goalImage[this.goalIndex];
            }
            else {
                imageToUse = settings.goalImage[this.goalIndex];
                while (imageToUse == settings.goalImage[this.goalIndex]) {
                    var index = Math.floor(Math.random() * settings.images.length);
                    imageToUse = settings.images[index];
                }
            }
            var sprite = game.add.sprite(x, y, imageToUse);
            sprite.anchor.setTo(0.5, 0.5);

            if (imageToUse == settings.goalImage[this.goalIndex]) {
                this.mover.control(sprite);
            }
            return sprite;
        }
    },

    render: function() {
        //this.game.debug.body(this.triangle);
    },

    spriteClicked: function(sprite, event) {
        if (sprite.key != settings.goalImage[this.goalIndex]) {
            this.wrongSound.play();
            return;
        }

        // stop player from clicking on images once level is over
        if (this.score == settings.goal && this.goalIndex == settings.goalImage.length) 
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
        this.stars.add(reward);
        reward.anchor.setTo(0.5, 0.5);
        reward.alpha = 0;
        var tween = game.add.tween(reward).to( 
                {x: this.rewardImageX, y: this.rewardImageY, alpha : 1}, 4000, null, 
                true, settings.popLifespan + 1000);

        this.rewardImageX += this.rewardImageStep;

        var currentScore = this.score;
        tween.onComplete.add(function() { this.checkIfPlayerWon(currentScore);}, this);
    },

    /* Have to pass in the score to avoid race conditions */
    checkIfPlayerWon: function(score) {
        if (score == settings.goal) {
            if (this.goalIndex == settings.goalImage.length - 1) 
                this.playerWon();
            else {
                this.moveToNextGoal();
            }
        }
    },

    moveToNextGoal: function() {
        this.goalIndex++;

        this.setupStars();
        this.score = 0;

        var goalSound = this.add.audio(settings.goalSound[this.goalIndex]);
        goalSound.play();
        goalSound.onStop.add(function() { this.add.audio('targetScoreSound').play(); },
            this);
    },

    playerWon: function() {
        // handle win situation
       console.log('player won'); 
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
