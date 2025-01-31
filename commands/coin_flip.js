const Utils = require('../utils/utils.js');
const miscOptions = require('../collections/funniesCollection.json');
const { SlashCommandBuilder } = require('@discordjs/builders');  

async function coinFlip (interaction) {
    const response = Utils.getRanValueArray(miscOptions.coinFlipOptions);
    const responseText = Object.keys(response)[0];
    const responseImage = Object.values(response)[0];
    const embedBase = {
        title: "", description: "", image:{url:""}, thumbnail:{url:""}, footer:"", color:"#ff00ff", fields: [] 
    }

    embedBase.title = "¡Hora de girar la moneda! <:winking:722547864118624278>";
    embedBase.fields = [{
        name: "La moneda ha caido, y el lado es...",
        value: responseText
    }];
    embedBase.image.url = responseImage;

    Utils.sendEmbed(interaction, embedBase, false);
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Lanzaré una moneda para un resultado aleatorio entre cara o cruz.'),
    aliases: ['coinflip', 'cf'],
    description: 'Lanzaré una moneda para un resultado aleatorio entre cara o cruz. \n\n_¡En este juego no hay trampas, te lo aseguro!_',
    category: '🎲 Comandos Divertidos',
    args : false,
    async execute(interaction) {
        coinFlip(interaction);
    },
};