const Utils = require('../utils/utils.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

async function say (interaction) {

    const message = interaction.options.getString('input');

    interaction.deferReply();

    let finalText = "";
    //checks mentions, 
    for (let index = 0; index < message.length; index++){
        if(message[index] === "@" && message[index - 1] != "<"){
            finalText += "ම";
        } else {
            finalText += message[index];
        }
    }

    setTimeout(() => {
        interaction.channel.send(finalText);
        interaction.deleteReply();
    },1000);

}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Hazme decir cualquier cosa que desees.')
	.addStringOption(option =>
	    option
        .setName('input')
		.setDescription('Lo que el bot dirá')
		.setRequired(true)),
    aliases: ['say'],
    description: 'Hazme decir algo. \n\n_Con este comando, puedes engañar a otros y hacerles pensar que tengo vida propia._',
    category: '🎲 Comandos Divertidos',
    args : '<Mensaje>',
    async execute(interaction) {
        say(interaction);
    },
};