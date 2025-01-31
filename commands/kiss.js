const utils = require('../utils/utils.js');
const Gifs = require('../collections/gifCollection.json');
const Phrases = require('../collections/phrasesCollection.json'); 
const { SlashCommandBuilder } = require('@discordjs/builders'); 

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('Dale un beso romántico o no a ese preciado amigo o amiga.')
	.addUserOption(option =>
	    option
        .setName('user')
		.setDescription('El usuario a mencionar')
		.setRequired(true)),
    aliases: ['kiss'],
    description: 'Dale un beso romántico o no a ese preciado amigo o amiga. \n\n_El amor entre un humano y un bot no es posible, pero eso no significa que no puedas darme un beso..._',
    category: '🤗 Comandos de Interacción',
    args : '<Mención de usuario>',
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