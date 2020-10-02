const Utils = require('../../utils/utils.js');
const miscOptions = require('../../collections/funniesCollection.json');

async function rpsGame (msg, client, message) {
    if(!message){
        Utils.sendErrorMessage(msg, 'debes elegir entre **`piedra`**, **`papel`** o **`tijera`**. :warning:');
        return;
    }
    const embedBase = {
        title: "", description: "", image:{url:""}, thumbnail:{url:""}, footer:"", color:"#ff00ff", fields: [] 
    }

    const userOption = message;
    const botOption = Utils.getRanValueArray(miscOptions.rpsBotOptions);
    const rpsPhrases = {
        win: `¡**${msg.author.username}** me ha ganado con **${userOption}**!, que pena. <:triste:722547890823757925>`,
        lose: `¡Le he ganado a **${msg.author.username}** con **${botOption}**!, ¡yupii! <:Yupii:722547848809414666>`
    };
    let winText = '';
    let winOption = '';
    
    switch(userOption){
        case botOption:
            await msg.channel.send('¡Alto ahí!, esto ha sido un empate. <:XD:722547896628805692>');
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
            Utils.sendErrorMessage(msg, '¡Oye, eso no es una opcion válida!, utiliza **`piedra`**, **`papel`** o **`tijera`**.');
            return;
    }
    embedBase.title = '¡Piedra, Papel o Tijera!';
    embedBase.fields.push({
        name: `${msg.author.username} saca`,
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

    Utils.sendEmbed(msg, embedBase, false);

}

module.exports = rpsGame;