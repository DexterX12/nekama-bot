const utils = require('../utils/utils.js');
const Gifs = require('../collections/gifCollection.json');
const Phrases = require('../collections/phrasesCollection.json'); 

module.exports = {
    aliases: ['cuddle'],
    description: 'Sientete agusto estando cerca y acurrucado con tu amigo. \n\n_¡Me gusta cuando estás cerca de mi!_',
    category: ':hugging: Comandos de Interacción',
    args : '<Mención de usuario>*',
    execute(msg, client, args, command="", mention) {
        let gifToUse = utils.getRanValueArray(Gifs.interactions[`${command}Gifs`]);
        let PhraseToUse = Phrases.interactions[command][`${command}Phrases`];
        let PhrasesDuo = null;
        let mentionNeeded = false;

        if (Phrases.interactions[command].isDuo) {
            PhrasesDuo = Phrases.interactions[command][`${command}DuoPhrases`];
        }

        if (Phrases.interactions[command].requiresMention) {
            mentionNeeded = true;
        }

        utils.interaction(msg, mention, gifToUse, PhraseToUse, PhrasesDuo, mentionNeeded);
    },
};