const utils = require('../utils/utils.js');
const Gifs = require('../collections/gifCollection.json');
const Phrases = require('../collections/phrasesCollection.json');
const { SlashCommandBuilder } = require('@discordjs/builders');  

module.exports = {
    data: new SlashCommandBuilder()
    .setName('chocolate')
    .setDescription('Reparte chocolates para todos o regala uno a tu amigo.')
	.addUserOption(option =>
	    option
        .setName('user')
		.setDescription('El usuario a mencionar')
		.setRequired(false)),
    aliases: ['chocolate'],
    description: 'Reparte chocolates para todos o regala uno a tu amigo. \n\n_¡A mi me encantan mucho los chocolates, dame chocolate please!_',
    category: '🤗 Comandos de Interacción',
    args : '[Mención de usuario]',
    async execute(interaction) {

        const command = interaction.commandName;

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

        utils.interaction(interaction, gifToUse, PhraseToUse, PhrasesDuo, mentionNeeded);
    },
};