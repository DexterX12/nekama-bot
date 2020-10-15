const utils = require('../utils/utils.js');
const Gifs = require('../collections/gifCollection.json');
const Phrases = require('../collections/phrasesCollection.json'); 

module.exports = {
    aliases: ['kickbutt', 'kb'],
    description: 'Dale una patada al trasero a tu amigo. \n\n_¡No le de patadas a mi trasero, que ni ya tengo!_',
    category: ':rage: Comandos de Reacción',
    args : '<Mención de usuario>**',
    execute(msg, client, args, command="", mention) {
        let gifToUse = utils.getRanValueArray(Gifs.interactions[`${this.aliases[0]}Gifs`]);
        let PhraseToUse = Phrases.interactions[this.aliases[0]][`${this.aliases[0]}Phrases`];
        let PhrasesDuo = null;
        let mentionNeeded = false;

        if (Phrases.interactions[this.aliases[0]].isDuo) {
            PhrasesDuo = Phrases.interactions[this.aliases[0]][`${this.aliases[0]}DuoPhrases`];
        }

        if (Phrases.interactions[this.aliases[0]].requiresMention) {
            mentionNeeded = true;
        }

        utils.interaction(msg, mention, gifToUse, PhraseToUse, PhrasesDuo, mentionNeeded);
    },
};