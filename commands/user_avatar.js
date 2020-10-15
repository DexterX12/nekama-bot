const Utils = require('../utils/utils.js');

class UserAvatar {
    constructor (msg, userMention, messageContent, client) {
        this.msg = msg;
        this.userMention = userMention;
        this.messageContent = messageContent;
        this.client = client;
        this.defaultImageOptions = {
            dynamic: true,
            size: 4096
        };
        this.embedOptions = {
            title: null, description: "", image: { url: "" }, footer: {}, color: "#ff00ff", fields: [], thumbnail: { url: "" }  
        };
    }

    async sendUserAvatar () {
        if (this.messageContent.length === 18) { // it is an id?
            Utils.getUserFromID(this.messageContent, this.client, async (userObject) => {
                if (!userObject.code) {  // if it is an invalid id, will return an object with an error code
                    if (userObject.username === this.msg.author.username)
                        await this.checkAvatar(userObject, true);
                    else
                        await this.checkAvatar(userObject, false);
                }
                return;
            });
        } else {
            if (this.userMention && (this.userMention.username != this.msg.author.username)) {
                await this.checkAvatar(this.userMention, false);
            } else {
                await this.checkAvatar(null, true);
            }
        }
    }

    async checkAvatar (user, requestFromAuthor) {
        let userToUse = null;
        if (!requestFromAuthor) {
            this.embedOptions.footer.text = `Pedido por: ${this.msg.author.username}`;
            userToUse = user;
        } else {
            userToUse = this.msg.author;
        }
        this.embedOptions.fields.push({
            name: "Imagen completa",
            value: `[Haz click aquí para verla](${userToUse.displayAvatarURL(this.defaultImageOptions)})`
        });
        this.embedOptions.title = `Avatar de ${userToUse.username}`;
        this.embedOptions.image.url = userToUse.displayAvatarURL(this.defaultImageOptions);
        
        Utils.sendEmbed(this.msg, this.embedOptions, false);
    }
}

module.exports = {
    aliases: ['avatar'],
    description: 'Mostraré tu avatar o el de tu amigo. \n\n_Ojala pudiera hacer un match contigo..._',
    category: ':desktop: Comandos Útiles',
    args : '<Mención de usuario/ID>*',
    execute(msg, client, args, command="", mention) {
        let instance = new UserAvatar(msg, mention, args, client)
        instance.sendUserAvatar(msg);
    },
};