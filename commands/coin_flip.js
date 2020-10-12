const Utils = require('../utils/utils.js');
const miscOptions = require('../collections/funniesCollection.json');  

async function coinFlip (msg) {
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

    Utils.sendEmbed(msg, embedBase, false);
}

module.exports = {
    aliases: ['coinFlip', 'cf'],
    description: 'Hace el bot lanzar una moneda con resultado aleatorio.',
    category: ':game_die: Comandos Divertidos',
    args : false,
    execute(msg, client, args, command="") {
        coinFlip(msg);
    },
};;