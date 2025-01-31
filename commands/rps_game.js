const Utils = require('../utils/utils.js');
const miscOptions = require('../collections/funniesCollection.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

async function rpsGame (interaction) {

    const embedBase = {
        title: "", description: "", image:{url:""}, thumbnail:{url:""}, footer:"", color:"#ff00ff", fields: [] 
    }

    const userOption = interaction.options.getString('input');
    const botOption = Utils.getRanValueArray(miscOptions.rpsBotOptions);
    const rpsPhrases = {
        win: `¡**${interaction.user.username}** me ha ganado con **${userOption}**!, que pena. <:triste:722547890823757925>`,
        lose: `¡Le he ganado a **${interaction.user.username}** con **${botOption}**!, ¡yupii! <:Yupii:722547848809414666>`
    };
    let winText = '';
    let winOption = '';
    
    switch(userOption){
        case botOption:
            await interaction.reply('¡Alto ahí!, esto ha sido un empate. <:XD:722547896628805692>');
            return;

        case 'piedra':
            if (botOption === 'tijera') {
                winText = rpsPhrases.win;
                winOption = userOption;
            } else {
                winText = rpsPhrases.lose;
                winOption = botOption;
            }
        break;

        case 'papel':
            if (botOption === 'piedra') {
                winText = rpsPhrases.win;
                winOption = userOption;
            } else {
                winText = rpsPhrases.lose;
                winOption = botOption;
            }
        break;

        case 'tijera':
            if (botOption === 'papel') {
                winText = rpsPhrases.win;
                winOption = userOption;
            } else {
                winText = rpsPhrases.lose;
                winOption = botOption;
            }
        break

        default:
            Utils.sendErrorMessage(interaction, '¡Oye, eso no es una opcion válida!, utiliza **`piedra`**, **`papel`** o **`tijera`**.');
            return;
    }
    embedBase.title = '¡Piedra, Papel o Tijera!';
    embedBase.fields.push({
        name: `${interaction.user.username} saca`,
        value: userOption
    },
    {
        name: "Yo saco:",
        value: botOption
    },
    {
        name: "Resultado:",
        value: winText
    });

    embedBase.image.url = Utils.getRanValueArray(miscOptions.rpsImageOptions[winOption]);

    Utils.sendEmbed(interaction, embedBase, false);

}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Juega contra mi a "Piedra, Papel o Tijera"')
	.addStringOption(option =>
	    option
        .setName('input')
		.setDescription('La opción que usarás contra el bot')
		.setRequired(true)),
    aliases: ['rps'],
    description: 'Juega contra mi a "Piedra, Papel o Tijera". \n\n_¡Soy profesional en este juego, así que no me subestimes!_',
    category: '🎲 Comandos Divertidos',
    args : '<Opción (piedra, papel, tijera)>',
    async execute(interaction) {
        rpsGame(interaction);
    },
};