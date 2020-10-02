const utils = require('../utils/utils.js');
const Gifs = require('../collections/gifCollection.json');
const Phrases = require('../collections/phrasesCollection.json');

class Reactions {

    constructor(msg, client){
        this.msg = msg;
        this.client = client;
    }

    async angry () {
        const gifToUse = utils.getRanValueArray(Gifs.reactions.angryGifs);
        const phraseToUse = utils.getRanValueArray(Phrases.reactions.angryPhrases);
        utils.actionReactionBase(this.msg, null, phraseToUse, gifToUse, true);  
    }
    async cry () {
        const gifToUse = utils.getRanValueArray(Gifs.reactions.cryGifs);
        const phraseToUse = utils.getRanValueArray(Phrases.reactions.cryPhrases);
        utils.actionReactionBase(this.msg, null, phraseToUse, gifToUse, true);     
    }

    async happy () {
        const gifToUse = utils.getRanValueArray(Gifs.reactions.happyGifs);
        const phraseToUse = utils.getRanValueArray(Phrases.reactions.happyPhrases);
        utils.actionReactionBase(this.msg, null, phraseToUse, gifToUse, true);  
    }

    async nope () {
        const gifToUse = utils.getRanValueArray(Gifs.reactions.nopeGifs);
        const phraseToUse = utils.getRanValueArray(Phrases.reactions.nopePhrases);
        utils.actionReactionBase(this.msg, null, phraseToUse, gifToUse, true);  
    }
}

module.exports = Reactions;