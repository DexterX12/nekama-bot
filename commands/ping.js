const Utils = require('../utils/utils.js');

module.exports = {
    aliases: ['ping'],
    description: 'Prueba el tiempo de respuesta del bot.',
    category: ':desktop: Comandos Útiles',
    args : false,
    async execute(msg, client) {
        let messageSent = await msg.channel.send('¡Ok! Esperando respuesta del servidor... :alarm_clock:');
        setTimeout(() => {
        	messageSent.edit(`¡Pong! :ping_pong:\nEl tiempo de respuesta es: ${messageSent.createdTimestamp - msg.createdTimestamp}ms`)
        }, 1000)
    },
}