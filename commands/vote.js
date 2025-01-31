const {voteLink} = require('../config.json')
const { SlashCommandBuilder } = require('@discordjs/builders');

class BotVote {

    constructor (interaction) {
        this.interaction = interaction;
        this.embedOptions = {
            title: "¡Vota por mí!",
            description: `Al votar, me estarás apoyando y permitirás que más personas me conozcan. Desde el equipo de Nyantakus agradecemos mucho esta acción.\nPor favor, [haz clic aquí para votar](${voteLink})`,
            image: { url: "" },
            footer: {},
            color: "#ff00ff",
            fields: [],
            thumbnail: {
                url: interaction.client.user.displayAvatarURL()
            }  
        };
    }

    sendBotVote () {
        this.interaction.reply({embeds:[this.embedOptions]});
    }

}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Te da un enlace de votación, para así poder apoyarme.'),
    aliases: ['vote'],
    description: 'Te da un enlace de votación, para así poder apoyarme. \n\n_¡Por favor, vota por mi para que más personas me conozcan!_',
    category: '🤖 Comandos del Bot',
    args : false,
    execute(interaction) {
        let instance = new BotVote(interaction);
        instance.sendBotVote();
    },
};