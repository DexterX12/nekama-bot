const Utils = require('../utils/utils.js');


async function rate (msg, thingToRate) {
    const embedBase = {
        title: "", description: "", image:{url:""}, thumbnail:{url:""}, footer:{}, color:"#ff00ff", fields: [] 
    }
    
    let randomNumberRate = Math.floor(Math.random() * 10);
    let finalText = "";
    
    if (randomNumberRate === 0) {
        randomNumberRate = 1;
    }

    if(!thingToRate) {
        Utils.sendErrorMessage(msg, 'Debes indicar algo para valorarlo. :warning:');
        return;
    } else if (thingToRate.length > 35) {
        Utils.sendErrorMessage(msg, '¡Tu mensaje es demasiado largo! <:chancla:722547876244357200>');
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
        name: `Mi evaluación es de ${randomNumberRate}/10`,
        value: finalText
    });
    embedBase.footer.text = `Evaluación pedida por: ${msg.author.username}`;
    Utils.sendEmbed(msg, embedBase, false);
}

module.exports = {
    aliases: ['rate'],
    description: 'Daré mi valoración a lo que me pongas. \n\n_¡Yo siempre valgo mucho, independientemente de los resultados._',
    category: ':game_die: Comandos Divertidos',
    args : '<Elemento a valorar>**',
    execute(msg, client, args) {
        rate(msg, args);
    },
};