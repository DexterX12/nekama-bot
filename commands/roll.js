const Utils = require('../utils/utils.js');
const miscOptions = require('../collections/funniesCollection.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

async function roll (interaction) {

    const response = Utils.getRanValueArray(miscOptions.rollOptions);
    const responseText = Object.keys(response)[0];
    const responseImage = Object.values(response)[0];
    const embedBase = {
        title: "", description: "", image:{url:""}, thumbnail:{url:""}, footer:"", color:"#ff00ff", fields: [] 
    }

    embedBase.title = "¡Se ha lanzado el dado! <:winking:722547864118624278>";
    embedBase.fields = [{
        name: "Y ha caido...",
        value: responseText
    }];
    embedBase.image.url = responseImage;

    Utils.sendEmbed(interaction, embedBase, false);
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Lanzaré un dado para un resultado aleatorio.'),
    aliases: ['roll'],
    description: 'Lanzaré un dado para un resultado aleatorio. \n\n_Tranquilo, el dado no está trucado..._',
    category: '🎲 Comandos Divertidos',
    args : false,
    async execute(interaction) {
        roll(interaction);
    },
};;