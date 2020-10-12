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
async function interaction (msg, userMention, gif, phrases, phrasesDuo, needsMention) {
        userMentioned = userMention;
        if (needsMention) {
            const phraseToUse = getRanValueArray(phrases)
            if(userMentioned){
                actionReactionBase(msg, userMentioned, phraseToUse, gif);
                return;
            }
            sendErrorMessage(msg, `¡Así no es!, **tienes que mencionar a alguien**. <:facepalm:722547858594725889>`);
        } else {
            let phraseToUse;
            if (userMentioned) {
                phraseToUse = getRanValueArray(phrasesDuo);
                actionReactionBase(msg, userMentioned, phraseToUse, gif);
            } else {
                phraseToUse = getRanValueArray(phrases);
                actionReactionBase(msg, userMentioned, phraseToUse, gif, true);
            }
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

async function sendEmbed (msg, embedObject, deletemsg=true, isChannel=false, needText=false, text="") {
    let returns;
    return new Promise( async (resolve, reject) => {
        if (isChannel) {
            if (needText)
                msg.send(text, {embed: embedObject});
            else
                msg.send({embed: embedObject});
        } else {
            option = msg.channel;
            if (needText)
                returns = await msg.channel.send(text, {embed: embedObject});
            else
                returns = await msg.channel.send({embed: embedObject});
        }

        if (deletemsg)
            msg.delete();

        resolve(returns);
    })
}

function getRanValueArray (array) {
    return array[Math.floor(Math.random() * array.length)];
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
    interaction,
    getIdFromMention,
    getUserFromID,
    sendErrorMessage,
    sendEmbed,
    capitalize
};
