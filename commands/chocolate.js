const utils = require('../utils/utils.js');
const Gifs = require('../collections/gifCollection.json');
const Phrases = require('../collections/phrasesCollection.json'); 

module.exports = {
    aliases: ['chocolate', 'choco'],
    description: 'Reparte chocolates para todos o regala uno a tu amigo. \n\n_¡A mi me encantan mucho los chocolates, dame chocolate please!_',
    category: ':hugging: Comandos de Interacción',
    args : '<Mención de usuario>*',
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