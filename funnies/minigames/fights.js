const Utils = require('../../utils/utils.js');
const weapons = {
    punch: {
        damage: null
    }
}
let usersInQueue = [{}, {}];

async function fight (msg, client, userMention) {
    if (!userMention) {
        Utils.sendErrorMessage(msg, 'Necesitas **mencionar a alguien** para poder luchar.');
        return;
    }

    usersInQueue[0]['name'] = msg.author.username;
    usersInQueue[1]['name'] = userMention.username;
    usersInQueue[0].hp = 200;
    usersInQueue[1].hp = 200;
 
    const filter = answer => answer.content === 'aceptar' && answer.author.username != usersInQueue[0].name && answer.author.username === usersInQueue[1].name && !answer.author.bot;
        
    let newMsg = await msg.channel.send(msg.author.username + " está buscando un contrincante, usa **`aceptar`** para luchar! <:intenso:722547877255315597>");
    newMsg.channel.awaitMessages(filter, {max: 1, time:15000, errors: ['time']})
    .then(() => {
        msg.channel.send(`**${userMention.username}** ha aceptado el duelo. <:mugi:722547866194673816>`);
        playerTurn(msg, usersInQueue[0], usersInQueue[1]);
    })
    .catch((e) => {
        console.log(usersInQueue[0], e);
        msg.channel.send(`**${userMention.username}** no aceptó tu duelo. <:shrug:722547859626655746>`);
    })

}

async function playerTurn (msg, userTurn, enemy) {
    weapons.punch.damage = 15 + Math.floor(Math.random() * 20);
    const filter = answer => answer.author.username == userTurn.name;
    let newMsg = await msg.channel.send(`Es turno de **${userTurn.name}**\n¡Escribe **fight** para pelear!`);
 
    newMsg.channel.awaitMessages(filter, {max: 1, time:15000, errors: ['time']})
    .then( async answer => {
        sendFightDetails(msg, answer.first().content, userTurn, enemy);
    })
    .catch( async () => {
        await msg.channel.send('**No se escogió la opción a tiempo**. ¡Juego terminado! <:shrug:722547859626655746>');
    })
}

async function sendFightDetails(msg, option, userTurn, enemy) {
    if (option == "fight") {
        enemy.hp -= weapons.punch.damage;
        
        if (enemy.hp < 0)
            enemy.hp = 0;
        
        await msg.channel.send(`**${userTurn.name}** le ha dado un puñetazo y a quitado **${weapons.punch.damage} de HP** a **${enemy.name}**, y le ha quedado **${enemy.hp} de HP**!`)
       
        if (checkHP(msg))
            return;
        
        if (userTurn.name === usersInQueue[0].name)
            playerTurn(msg, usersInQueue[1], usersInQueue[0]);
        else
            playerTurn(msg, usersInQueue[0], usersInQueue[1]);     
    } else {
        await msg.channel.send('**¡No es una opción válida!**, intenta colocandolo de nuevo.');
        playerTurn(msg, userTurn, enemy);
    }
}

function checkHP (msg) {
    if(usersInQueue[0].hp > 0 && usersInQueue[1].hp <= 0){
        msg.channel.send(`¡**${usersInQueue[0].name}** ha ganado la batalla!`);
        return true;
    }
    if(usersInQueue[1].hp > 0 && usersInQueue[0].hp <= 0){
        msg.channel.send(`¡**${usersInQueue[1].name}** ha ganado la batalla!`);
        return true;
    }
    return;
} 

module.exports = fight;