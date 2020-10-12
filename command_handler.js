const utils = require('./utils/utils.js');
const fs = require('fs');

class CommandHandler {
    constructor (msg, client, userMention, messageContent){
        this.msg = msg;
        this.client = client;
        this.userMention = utils.getIdFromMention(userMention, client);
        this.messageContent = messageContent
    }

    async handleCommand(input) {
        let commandsFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (let file of commandsFiles) {
            let command = require('./commands/' + file);
            //console.log(command)
            for (let alias of command.aliases) {
                if (input === alias) {
                    command.execute(this.msg, this.client, this.messageContent, input, this.userMention);
                    return;
                }
            }
        }
        utils.sendErrorMessage(this.msg, '¡Uy!, no conozco ese comando... <:pensando:705937711873261587>')
    }
}

module.exports = CommandHandler;