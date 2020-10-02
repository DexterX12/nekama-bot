const say = require('./say.js'),
choose = require('./choose.js'),
rate = require('./rate.js'),
eight_ball = require('./eight_ball.js');

class Miscs {
    constructor (msg, client, msgcontent){
        this.eight_ball = eight_ball.bind(undefined, msg, msgcontent);
        this.say = say.bind(undefined, msg, msgcontent);
        this.rate = rate.bind(undefined, msg, msgcontent);
        this.choose = choose.bind(undefined, msg, msgcontent);
    }
}

module.exports = Miscs;