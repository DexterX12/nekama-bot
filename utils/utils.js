const Discord = require('discord.js');

function getIdFromMention (ArgMention, client) {
    let mention = ArgMention;

    if (!mention) { // is undefined?
        return;
    }

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }         
        //returns the user Object to access its properties
        return client.users.cache.get(mention);

    } else {
        return;
    }
}

function getUserFromID(id, client, callback) {
    try {
        client.users.fetch(id)
        .then(data => {
            callback(data);
        })
        .catch(e => {
            callback(e);
        });
        
    } catch (e){
        return e;
    }
}

async function actionReactionBase (msg, userMentioned, description, gif, isAlone=false) {
    const messageEmbed = new Discord.MessageEmbed();

    if (userMentioned == msg.author) {
        sendErrorMessage(msg, '¡Oh vamos!, no te vas a hacer eso.');
        return;
    }        

    if (isAlone) {
        messageEmbed.setDescription(`**${msg.author.username}** ${description}`);
    } else {
        messageEmbed.setDescription(`**${msg.author.username}** ${description} **${userMentioned.username}**`);
    }

    messageEmbed.setColor('#ff00ff');
    messageEmbed.setImage(gif);
    await msg.channel.send(messageEmbed);
}

async function sendEmbed (msg, embedObject, deletemsg=true) {
    await msg.channel.send({embed: embedObject});
    if (deletemsg)
        await msg.delete();
}

function getRanValueArray (gifArray) {
    return gifArray[Math.floor(Math.random() * gifArray.length)];
}

function capitalize (text) {
    let newText = "";
    newText += text[0].toUpperCase();
    newText += text.slice(1);
    return newText;
}

async function sendErrorMessage (msg, message) {
    msg.reply(message)
    .then((sentmessage)=>{
        sentmessage.delete({timeout:8000});
    });
}

module.exports = {
    getRanValueArray,
    actionReactionBase,
    getIdFromMention,
    getUserFromID,
    sendErrorMessage,
    sendEmbed,
    capitalize
};
