/**
 * Settings for floating shapes game, where the goal is to click on the right shape 
 */

var settings = {
    goal: 5,

    assetsDirectory: 'shapes',

    background: 'background',

    images: [   'arrow', 
                'circle', 
                'flippedSquare', 
                'pentagon', 
                'rectangle',
                'square',
                'star',
                'trapezoid',
                'triangle'
    ],

    goalImage: 'star',

    goalImageProbability: 0.3,

    popImage : 'balloon-pop',

    popSound : 'pop',

    popLifeSpan: 800,

    delay : 1500,

    velocity: -100,

    winMessage: 'You win!',

    winSound : 'youWin',
}
