const utils = require('../utils/utils.js');
const helpJSON = require('../collections/helpCollection.json');

class Help {
    constructor(msg, client) {
        this.msg = msg;
        this.helpJSON = helpJSON
        this.client = client;
    }
    async showHelp () {
        this.helpJSON.thumbnail.url = this.client.user.displayAvatarURL();
        await utils.sendEmbed(this.msg, helpJSON, false);
    }
}

module.exports = Help;