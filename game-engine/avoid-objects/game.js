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

        // load sounds
        var soundsPath = 'sounds/' + settings.assetsDirectory + '/';
        game.load.audio('popSound', soundsPath + settings.popSound + '.mp3');
        game.load.audio('winSound', soundsPath + settings.winSound + '.mp3');
    },

    create: function() {
        var background = game.add.image(0,0, 'background');
        background.width = game.width;
        background.height = game.height;

        this.setupPlayer();

        // group for falling objects
        this.enemyGroup = game.add.group();

        this.nextThingAt = 0;

        this.score = settings.goal;
        this.scoreNode = this.add.text(20, 20, this.score,
                {font: '30px KidsClub' , fill: '#fff', align: 'center'}); 

    },

    setupPlayer: function() {
        this.player = game.add.sprite(game.width / 2, game.height / 2, 'playerImage');
        this.player.inputEnabled = true;
        this.player.input.enableDrag();

        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.anchor.setTo(0.5, 0.5);
    },

    update: function() {
        if (this.score == 0) {
            return;
        }

        this.physics.arcade.overlap(
                this.player, this.enemyGroup, this.playerHit, null, this);

        if (this.nextThingAt < this.time.now) {
            this.nextThingAt += settings.delay; 

            var x = Math.floor(Math.random() * game.width);
            var y = 0;

            var index = Math.floor(Math.random() * settings.images.length);
            var imageToUse = settings.images[index];

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

    playerHit: function(player, enemy) {

        if (this.player.alpha < 1) 
            return;

        this.player.alpha = 0;
        var x = this.player.x;
        var y = this.player.y;

        enemy.kill();
        var pop = this.add.sprite(x, y, 'popImage');
        pop.anchor.setTo(0.5, 0.5);
        pop.lifespan = settings.popLifeSpan;

        this.score++;
        this.scoreNode.text = this.score;

        x = game.width / 2;
        y = game.height / 2;


    },

    spriteClicked: function(sprite, event) {
        if (sprite.key != settings.goalImage)
            return;

        if (this.score == settings.goal) 
            return;

        this.popSound.play();
        var x = sprite.x;
        var y = sprite.y;
        var pop = this.add.sprite(x, y, 'popImage');
        pop.scale.setTo(0.5, 0.5);
        pop.anchor.setTo(0.5, 0.5);
        pop.lifespan = settings.popLifeSpan;

        this.score++;
        this.scoreNode.text = this.score;

        if (this.score == settings.goal) {
            // handle win situation
            this.add.text(game.width / 2, game.height / 2, settings.winMessage,
                    {font: '30px KidsClub' , fill: '#fff', align: 'center'}); 

            var winSound = this.add.audio('winSound');
            winSound.play();
        }

        sprite.destroy();
    },

};

var game = new Phaser.Game(950, 525, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
