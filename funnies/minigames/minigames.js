const roll = require('./roll.js'),
rpsGame = require('./rps_game.js'),
coinFlip = require('./coin_flip.js');
fight = require('./fights.js');

class Minigames { // Core of minigames options of fun
    constructor (msg, client, msgcontent, userMention){
        this.roll = roll.bind(undefined, msg, msgcontent);
        this.rpsGame = rpsGame.bind(undefined, msg, client, msgcontent);
        this.coinFlip = coinFlip.bind(undefined, msg, msgcontent);
        this.fight = fight.bind(undefined, msg, client, userMention);
    }
}

module.exports = Minigames;
