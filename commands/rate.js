const Utils = require('../utils/utils.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

async function rate (interaction) {
    const embedBase = {
        title: "", description: "", image:{url:""}, thumbnail:{url:""}, footer:{text:""}, color:"#ff00ff", fields: [] 
    }
    
    const thingToRate = interaction.options.getString('input');
    let randomNumberRate = Math.floor(Math.random() * 10);
    let finalText = "";
    
    if (randomNumberRate === 0) {
        randomNumberRate = 1;
    }

    if (thingToRate.length > 35) {
        Utils.sendErrorMessage(interaction, '¡Tu mensaje es demasiado largo! <:chancla:722547876244357200>');
        return;
    }

    for(let currentNumber = 1; currentNumber <= 10; currentNumber++) {
        if (currentNumber <= randomNumberRate) {
            finalText += ":heart:";
        } else {
            finalText += ":white_heart:"
        }
    }
    embedBase.title = `Evaluando: ${thingToRate} :thinking:`;

    embedBase.fields.push({
        name: `Mi evaluación es: ${randomNumberRate}/10`,
        value: finalText
    });

    embedBase.footer.text = `Evaluación pedida por: ${interaction.user.username}`;
    Utils.sendEmbed(interaction, embedBase, false);
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rate')
    .setDescription('Daré mi evaluación a lo que me pongas.')
	.addStringOption(option =>
	    option
        .setName('input')
		.setDescription('Lo que el bot evaluará')
		.setRequired(true)),
    aliases: ['rate'],
    description: 'Daré mi evaluación a lo que me pongas. \n\n_¡Yo siempre valgo mucho, independientemente de los resultados._',
    category: '🎲 Comandos Divertidos',
    args : '<Elemento a valorar>',
    async execute(interaction) {
        rate(interaction);
    },
};