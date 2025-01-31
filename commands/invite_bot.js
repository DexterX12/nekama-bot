const {inviteLink} = require('../config.json')
const { SlashCommandBuilder } = require('@discordjs/builders');

class BotInvite {

    constructor (interaction) {
        this.interaction = interaction;
        this.embedOptions = {
            title: "Invitación de Nyantakus",
            description: `Me hace feliz ser parte de tu servidor. \nPor favor, [haz clic aquí para ir al enlace de invitación](${inviteLink})`,
            image: { url: "" },
            footer: {},
            color: "#ff00ff",
            fields: [],
            thumbnail: {
                url: interaction.client.user.displayAvatarURL()
            }  
        };
    }

    sendBotInvite () {
        this.interaction.reply({content: `¡Gracias por interesarte en invitarme a tu servidor! <:Yupii:722547848809414666>`, embeds:[this.embedOptions]});
    }

}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Te da un enlace de invitación para yo poder entrar a tu servidor.'),
    aliases: ['invite'],
    description: 'Te da un enlace de invitación para yo poder entrar a tu servidor. \n\n_¡Anda, usarlo y recomendarme a tus amigos!_',
    category: '🤖 Comandos del Bot',
    args : false,
    execute(interaction) {
        let instance = new BotInvite(interaction);
        instance.sendBotInvite();
    },
};