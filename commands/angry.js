const utils = require('../utils/utils.js');
const Gifs = require('../collections/gifCollection.json');
const Phrases = require('../collections/phrasesCollection.json');
const { SlashCommandBuilder } = require('@discordjs/builders'); 

module.exports = {
    data: new SlashCommandBuilder()
    .setName('angry')
    .setDescription('Haz saber tu molestia o enojo.'),
    aliases: ['angry'],
    description: 'Haz saber tu molestia o enojo, \n\n_¡Pero no te enojes conmigo please!_',
    category: '😡 Comandos de Reacción',
    args : false,
    async execute(interaction) {
        const command = interaction.commandName;
        
        let gifToUse = utils.getRanValueArray(Gifs.reactions[`${command}Gifs`]);
        let PhraseToUse = Phrases.reactions[command][`${command}Phrases`];
        let PhrasesDuo = null;
        let mentionNeeded = false;

        if (Phrases.reactions[command].isDuo) {
            PhrasesDuo = Phrases.reactions[command][`${command}DuoPhrases`];
        }

        if (Phrases.reactions[command].requiresMention) {
            mentionNeeded = true;
        }

        utils.interaction(interaction, gifToUse, PhraseToUse, PhrasesDuo, mentionNeeded);
    },
};