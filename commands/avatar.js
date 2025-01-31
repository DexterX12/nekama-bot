const Utils = require('../utils/utils.js');
const { SlashCommandBuilder } = require('@discordjs/builders'); 

class UserAvatar {
    constructor (interaction) {
        this.interaction = interaction;
        this.userMention = (!interaction.options.getUser('user') == null) ? "" : interaction.options.getUser('user');
        this.messageContent = (!interaction.options.getString('user_id') == null) ? "" : interaction.options.getString('user_id');
        this.client = interaction.client;
        this.defaultImageOptions = {
            dynamic: true,
            size: 4096
        };
        this.embedOptions = {
            title: null, description: "", image: { url: "" }, footer: {}, color: "#ff00ff", fields: [], thumbnail: { url: "" }  
        };
    }

    async sendUserAvatar () {
        if (this.userMention && (this.userMention != this.interaction.user)) {
            await this.checkAvatar(this.userMention, false);
        } else {
            await this.checkAvatar(null, true);
        }
    }

    async checkAvatar (user, requestFromAuthor) {
        let userToUse = null;
        if (!requestFromAuthor) {
            this.embedOptions.footer.text = `Pedido por: ${this.interaction.user.username}`;
            userToUse = user;
        } else {
            userToUse = this.interaction.user;
        }
        this.embedOptions.fields.push({
            name: "Imagen completa",
            value: `[Haz click aquí para verla](${userToUse.displayAvatarURL(this.defaultImageOptions)})`
        });
        this.embedOptions.title = `Avatar de ${userToUse.username}`;
        this.embedOptions.image.url = userToUse.displayAvatarURL(this.defaultImageOptions);
        
        Utils.sendEmbed(this.interaction, this.embedOptions, false);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Mostraré tu avatar o el de tu amigo.')
	.addUserOption(option =>
	    option
        .setName('user')
		.setDescription('El usuario a revisar el avatar')
		.setRequired(false)),
    aliases: ['avatar'],
    description: 'Mostraré tu avatar o el de tu amigo. \n\n_Ojala pudiera hacer un match contigo..._',
    category: '🖥️ Comandos Útiles',
    args : '<Mención de usuario/ID>',
    async execute(interaction) {
        let instance = new UserAvatar(interaction)
        instance.sendUserAvatar(interaction);
    },
};
