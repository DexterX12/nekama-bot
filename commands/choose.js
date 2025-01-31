const Utils = require('../utils/utils.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

async function choose (interaction) {

    const message = interaction.options.getString('options')

    if(!message){
        Utils.sendErrorMessage(interaction, '¡Dame 2 o más cosas para elegir!, ejemplo: **/choose Gato ; Perro**');
        return;
    }
    
    const embedBase = {
        title: "", description: "", image:{url:""}, thumbnail:{url:""}, footer:"", color:"#ff00ff", fields: [] 
    }
    
    const options = message.split(';');
    const response = Utils.getRanValueArray(options);
    let finalText = "";

    if (options.length > 10){
        Utils.sendErrorMessage(interaction, '¡Oye!, relájate con la cantidad de opciones. <:chancla:722547876244357200>');
        return;
    }

    if (options.length < 2){
        Utils.sendErrorMessage(interaction, '¡Oh vamos!, hazme elegir entre 2 o más opciones. **(Sepáralas entre ;)**');
        return;
    }
    
    options.forEach((option, index) => {
        if (index < options.length - 1)
            finalText +=  `${option}, `;
        else
            finalText += `${option}.`;
    });
    
    embedBase.title = "¡Voy a elegir a lo que me hagas decidir!";
    embedBase.fields.push({
        name: "Las opciones son:",
        value: finalText
    },
    {
        name: "Mi respuesta es:",
        value: `**${response}**`
    });

    Utils.sendEmbed(interaction, embedBase, false);
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Hazme elegir entre dos o más opciones.')
	.addStringOption(option =>
	    option
        .setName('options')
		.setDescription('Las opciones a escoger')
		.setRequired(true)),
    aliases: ['choose'],
    description: 'Hazme elegir entre dos o más opciones. \n\n_¡Sé elegir bien, así que confía en mi!_',
    category: '🎲 Comandos Divertidos',
    args : '<Opcion 1> ; <Opcion 2> ; [Opción 3]',
    async execute(interaction) {
        choose(interaction);
    },
};