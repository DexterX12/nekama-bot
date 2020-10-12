const Utils = require('../utils/utils.js');
const inviteURL = "https://discord.com/api/oauth2/authorize?client_id=753640540486107306&permissions=519232&scope=bot";

class BotInvite {

    constructor (msg, client) {
        this.msg = msg;
        this.embedOptions = {
            title: "Invitación de Nyantakus",
            description: `Me hace feliz ser parte de tu servidor, por favor: \n[Haz clic aquí para ir al enlace de invitación](${inviteURL})`,
            image: { url: "" },
            footer: {},
            color: "#ff00ff",
            fields: [],
            thumbnail: {
                url: client.user.displayAvatarURL()
            }  
        };
    }

    sendBotInvite () {
        this.msg.reply(`¡Gracias por interesarte en invitarme a tu servidor! <:Yupii:722547848809414666>`);
        Utils.sendEmbed(this.msg, this.embedOptions, false);
    }

}

module.exports = {
    aliases: ['invite'],
    description: 'Retorna la invitación del bot.',
    category: ':robot: Comandos del Bot',
    args : false,
    execute(msg, client, args, command="") {
        let instance = new BotInvite(msg, client);
        instance.sendBotInvite();
    },
};;