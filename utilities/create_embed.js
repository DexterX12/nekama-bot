const utils = require('../utils/utils.js');

class CreateEmbed {

    constructor (msg, messageContent) {
        this.msg = msg;
        this.messageContent = messageContent;
        this.embedObject = {};
    }
    
    async createEmbed () {
        try {
            if (!this.msg.member.hasPermission('ADMINISTRATOR')) {
                utils.sendErrorMessage(this.msg, 'No tienes los permisos suficientes para realizar esta acción.');
                return;
            }
            const parameters = this.messageContent.split('|');
            this.embedObject = {
                title: parameters[0],
                description: parameters[1],
                image: {
                    url: parameters[2],
                },
                thumbnail: {
                    url: parameters[3],
                },
                footer: parameters[4],
                color: parameters[5],
                fields:[],
            }
    
            let fields = parameters[6];
    
            if(fields){
                let fieldsToParse = fields.split(';');
                fieldsToParse.forEach((field, index) => {
                    fieldsToParse[index] = JSON.parse(field);
                });
    
                this.embedObject.fields = fieldsToParse;
            }
    
            await utils.sendEmbed(this.msg, this.embedObject);
    
        } catch(error) {
            utils.sendErrorMessage(this.msg, error.toString());
        }
    }
}

module.exports = CreateEmbed;