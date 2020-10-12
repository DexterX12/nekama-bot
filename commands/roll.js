const Utils = require('../utils/utils.js');
const miscOptions = require('../collections/funniesCollection.json');

async function roll (msg) {
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

    Utils.sendEmbed(msg, embedBase, false);
}

module.exports = {
    aliases: ['roll'],
    description: 'El bot lanza un dado con resultado aleatorio.',
    category: ':game_die: Comandos Divertidos',
    args : false,
    execute(msg, client, args) {
        roll(msg);
    },
};;