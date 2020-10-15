const Utils = require('../utils/utils.js');

async function say (msg, message) {
    if(!message){
        Utils.sendErrorMessage(msg, 'Escribe algo y yo lo repitiré jijiji... <:hihi:705936102501908492>');
        return;
    }
    let finalText = "";
    //checks mentions, 
    for (let index = 0; index < message.length; index++){
        if(message[index] === "@" && message[index - 1] != "<"){
            finalText += "ම";
        } else {
            finalText += message[index];
        }
    }
    console.log(finalText)
    msg.delete();
    msg.channel.send(finalText);
}

module.exports = {
    aliases: ['say'],
    description: 'Hazme decir algo. \n\n_Con este comando, puedes engañar a otros y hacerles pensar que tengo vida propia._',
    category: ':game_die: Comandos Divertidos',
    args : '<Mensaje>**',
    execute(msg, client, args) {
        say(msg, args);
    },
};