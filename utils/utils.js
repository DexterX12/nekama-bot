const { MessageEmbed } = require('discord.js');

async function sendEmbed (interactionObj, embedObject, deletemsg=true, isChannel=false, needText=false, text="") {
    let returns;
    return new Promise( async (resolve, reject) => {
        if (isChannel) {
            if (needText)
                interactionObj.reply(text, {embeds: [embedObject]});
            else
                interactionObj.reply({embeds: [embedObject]});
        } else {
            option = interactionObj.channel;
            if (needText)
                returns = await interactionObj.reply(text, {embeds: [embedObject]});
            else
                returns = await interactionObj.reply({embeds: [embedObject]});
        }

        if (deletemsg)
            interactionObj.deleteReply();

        resolve(returns);
    })
}

function getRanValueArray (array) {
    return array[Math.floor(Math.random() * array.length)];
}

function capitalize (text) {
    return text[0].toUpperCase() + text.slice(1);
}

async function sendErrorMessage (interactionObj, message, isDeferred=false) {
    try{
        if (isDeferred)
            await interactionObj.editReply(message);
        else
            await interactionObj.reply(message);
        
        setTimeout( async () => {
            try {
                await interactionObj.deleteReply();
            } catch (error) {
                console.log(error.message);
            }
        }, 10000);

    } catch (e) {
        console.log(e.message);
    }
}

async function interaction (interactionObj, gif, phrases, phrasesDuo, needsMention) {

        userMentioned = interactionObj.options.getUser('user');

        if (needsMention) {
            const phraseToUse = getRanValueArray(phrases)
            if(userMentioned){
                actionReactionBase(interactionObj, userMentioned, phraseToUse, gif);
                return;
            }
            sendErrorMessage(interactionObj, `¡Así no es!, **tienes que mencionar a alguien**. <:facepalm:722547858594725889>`);
        } else {
            let phraseToUse;
            if (userMentioned) {
                phraseToUse = getRanValueArray(phrasesDuo);
                actionReactionBase(interactionObj, userMentioned, phraseToUse, gif);
            } else {
                phraseToUse = getRanValueArray(phrases);
                actionReactionBase(interactionObj, userMentioned, phraseToUse, gif, true);
            }
        }
    }

async function actionReactionBase (interactionObj, userMentioned, description, gif, isAlone=false) {

    const messageEmbed = new MessageEmbed()

    if (userMentioned == interactionObj.user) {
        sendErrorMessage(interactionObj, '¡Oh vamos!, no te vas a hacer eso.');
        return;
    }        

    if (isAlone) {
        messageEmbed.setDescription(`**${interactionObj.user.username}** ${description}`);
    } else {
        messageEmbed.setDescription(`**${interactionObj.user.username}** ${description} **${userMentioned.username}**`);
    }

    messageEmbed.setColor('#ff00ff');
    messageEmbed.setImage(gif);

    await interactionObj.reply({embeds: [messageEmbed]});
}

module.exports = {
    actionReactionBase,
    interaction,
    getRanValueArray,
    sendErrorMessage,
    sendEmbed,
    capitalize
};
