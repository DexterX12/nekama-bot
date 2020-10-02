const Interactions = require('./interactions.js'),
Reactions = require('./reactions.js');

class Socials {
    constructor (msg, client, userMention) {
        this.interaction = new Interactions(msg, client, userMention);
        this.reaction = new Reactions(msg, client, userMention);
    }
}

module.exports = Socials;

//mira el Estructura.txt//