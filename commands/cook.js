const utils = require('../utils/utils.js');
const Gifs = require('../collections/gifCollection.json');
const Phrases = require('../collections/phrasesCollection.json');
const { SlashCommandBuilder } = require('@discordjs/builders'); 

module.exports = {
    data: new SlashCommandBuilder()
    .setName('cook')
    .setDescription('Haz ricas comidas y prepara algo delicioso solo o con tu amigo.')
	.addUserOption(option =>
	    option
        .setName('user')
		.setDescription('El usuario a mencionar')
		.setRequired(false)),
    aliases: ['cook'],
    description: 'Haz ricas comidas y prepara algo delicioso solo o con tu amigo. \n\n_¡La verdad me gusta cocinar y comer bastante!_',
    category: '🤗 Comandos de Interacción',
    args : '[Mención de usuario]',
    async execute(interaction) {

        const command = interaction.commandName;

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

        utils.interaction(interaction, gifToUse, PhraseToUse, PhrasesDuo, mentionNeeded);
    },
};