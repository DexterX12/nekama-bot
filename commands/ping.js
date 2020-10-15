const Utils = require('../utils/utils.js');

module.exports = {
    aliases: ['ping'],
    description: 'Prueba el tiempo de mi repuesta. \n\n_A veces me da lag..._',
    category: ':robot: Comandos del Bot',
    args : false,
    async execute(msg, client) {
        let messageSent = await msg.channel.send('**Esperando respuesta del servidor...** :alarm_clock:');
        setTimeout(() => {
        	messageSent.edit(`¡Pong! :ping_pong:\n\nEl tiempo de respuesta es: **${messageSent.createdTimestamp - msg.createdTimestamp}ms**`)
        }, 1000)
    },
}