const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Prueba el tiempo de mi respuesta.'),
    aliases: ['ping'],
    description: 'Prueba el tiempo de mi respuesta. \n\n_A veces me da lag..._',
    category: '🤖 Comandos del Bot',
    args : false,
    async execute(interaction) {
        await interaction.reply('**Esperando respuesta del servidor...** :alarm_clock:');
        setTimeout(() => {
        	interaction.editReply(`¡Pong! :ping_pong:\n\nEl tiempo de respuesta es: **${interaction.client.ws.ping}ms**`)
        }, 1000)
    },
}