GameState = function(game) {
    this.LETTERS = 'abcdefghijklmnopqrstuvwxyz';
    this.NUMBER_OF_LETTERS = 26;
    
    // the probability to get the current letter
    this.CURRENT_LETTER_PROBABILITY = 0.5;      

    this.GOAL = 5;

    this.BALLOON_DELAY = 1500;

    this.letterNodes = [];      // used to access the progress nodes
};

GameState.prototype = {
    preload: function() {
        // load images
        game.load.image('background', 'images/deepblue.png');
        game.load.image('balloon', 'images/balloon2.png');
        game.load.image('balloonPop', 'images/balloon-pop.png');

        // load sounds
        game.load.audio('pop', 'sounds/pop.mp3');
    },

    create: function() {
        var background = game.add.image(0,0, 'background');
        background.width = game.width;
        background.height = game.height;

        this.nextBalloonAt = 0;

        this.popSound = this.add.audio('pop');

        // check what letter we should start with
        var index = localStorage['currentLowerCaseLetter'];
        this.currentLetter = index ? this.LETTERS[parseInt(index)] : 'a'; 

        this.balloonGroup = this.add.group();

        this.score = 0;
        this.scoreNode = this.add.text(20, 20, this.score,
                {font: '30px KidsClub' , fill: '#fff', align: 'center'}); 


        this.createLetterNodes();

    },

    createLetterNodes : function() {
        // add progress letters
        for (var i = 0; i < this.NUMBER_OF_LETTERS; i++) {
            var x = 20 + i * 30;
            var y = game.height - 60;
            var letter = this.LETTERS[i];

            var fillColor;

            if (letter == this.currentLetter) {
                fillColor = '#000';
            }
            else if (letter < this.currentLetter) {
                fillColor = '#0f0';
            }
            else {
                fillColor = '#f00';
            }

            var letterNode = this.add.text(x, y, letter, 
                    {font: '30px Helvetica' , fill: fillColor, align: 'center'}); 
            this.letterNodes.push(letterNode);

            letterNode.inputEnabled = true;
            letterNode.events.onInputDown.add(this.letterNodeClicked, this);
        }
    },

    update: function() {
        if (this.nextBalloonAt < this.time.now) {
            this.nextBalloonAt += this.BALLOON_DELAY;

            var balloonWidth = game.cache.getImage('balloon').width * 0.25;
            var x = Math.floor(Math.random() * (game.width - balloonWidth) + 
                    balloonWidth / 2) 
            var y = game.height;

            var balloon = game.add.sprite(x, y, 'balloon');
            balloon.scale.setTo(0.25, 0.25);
            balloon.anchor.setTo(0.5, 0.5);

            this.physics.enable(balloon, Phaser.Physics.ARCADE);
            balloon.body.velocity.y = -100;

            balloon.inputEnabled = true;
            balloon.events.onInputDown.add(this.balloonClicked, this);

            balloon.checkWorldBounds = true;
            balloon.events.onOutOfBounds.add(this.removeBalloon,this);


            var letter;
            if (Math.random() <= this.CURRENT_LETTER_PROBABILITY) {      
                letter = this.currentLetter;
            }
            else {
                var index = Math.floor(Math.random() * this.NUMBER_OF_LETTERS);
                letter = this.LETTERS[index];
            }

            var letter = this.add.text(0, -10, letter,
                    {font: '300px Helvetica' , fill: '#fff', align: 'center'}); 
            letter.anchor.setTo(0.5, 0.5);
            balloon.addChild(letter);

            this.balloonGroup.add(balloon);
        }

    },

    render: function() {
        //this.game.debug.body(this.triangle);
    },

    letterNodeClicked: function(sprite, event) {
        var letterClicked = sprite.text;
        if (letterClicked < this.currentLetter) {
            this.currentLetter = letterClicked;

            this.score = 0;
            this.scoreNode.text = this.score;
        }
    },

    balloonClicked: function(sprite, event) {
        var letter = sprite.children[0].text;
        if (letter != this.currentLetter)
            return;

        this.popSound.play();
        var x = sprite.x;
        var y = sprite.y;
        var pop = this.add.sprite(x, y, 'balloonPop');
        pop.scale.setTo(0.5, 0.5);
        pop.anchor.setTo(0.5, 0.5);
        pop.lifespan = 800;

        this.score++;
        this.scoreNode.text = this.score;

        if (this.score == this.GOAL) {
            this.score = 0;
            this.scoreNode.text = 0;

            // get the saved index, if it exists
            var index = localStorage['currentLowerCaseLetter'];
            if (index) {
                index = parseInt(index);
            }
            else {
                index = 0;
            }

            // make progress if this is the letter we are learning about
            if (this.LETTERS.indexOf(this.currentLetter) == index ) {

                this.letterNodes[index].fill = '#0f0';
                index++;
                this.letterNodes[index].fill = '#000';

                this.currentLetter = this.LETTERS[index]; 
                localStorage['currentLowerCaseLetter'] = index; 
            }
            else {
                // if we were repeating a previously learned letter, go to the new 
                // letter to learn
                this.currentLetter = this.LETTERS[index];
            }
        }

        sprite.destroy();
    },

    removeBalloon: function(sprite) {
        sprite.destroy();
    }
};

var game = new Phaser.Game(900, 480, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
