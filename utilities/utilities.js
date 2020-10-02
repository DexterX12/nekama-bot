const CreateEmbed = require('./create_embed.js'),
Calculator = require('./calculator.js'),
UserAvatar = require('./user_avatar.js'),
BotInvite = require('./bot_invite.js'),
ServerInfo = require('./server_info.js'),
UserInfo = require('./user_info.js'),
Danbooru = require('./danbooru.js'),
Pokemon = require('./pokemon.js');

class Utilities {  //
    constructor (msg, client, messageContent, userMention) {
        this.CreateEmbed = new CreateEmbed(msg, messageContent);
        this.Calculator = new Calculator(msg, messageContent);
        this.UserAvatar = new UserAvatar(msg, userMention, messageContent, client);
        this.BotInvite = new BotInvite(msg, client);
        this.ServerInfo = new ServerInfo(msg);
        this.UserInfo = new UserInfo(msg, client, userMention, messageContent);
        this.Pokemon = new Pokemon(msg, messageContent);
        this.danbooruSearch = new Danbooru(msg, client, messageContent);
    }
}

module.exports = Utilities;