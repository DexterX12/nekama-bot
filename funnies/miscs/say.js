const Utils = require('../../utils/utils.js');

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

module.exports = say;