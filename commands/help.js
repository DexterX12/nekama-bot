const utils = require('../utils/utils.js');
const fs = require('fs');
const config = require('../config.json')


class Help {
	constructor (msg, client, messageContent) {
		this.msg = msg;
		this.messageContent = messageContent;
		this.fileNames = [];
		this.helpEmbed = {
		    "author": {
		    	name:"Comandos de Nyantakus",
		    	icon_url: client.user.displayAvatarURL()
		    },
		    "description": "¡Hello Isekai!, mi nombre es: **Nyantakus**. Aquí tienes mi **lista de comandos**",
		    "image":{ 
		        "url": ""
		    },
		    "footer": {
		    	"text": "Usarme con amor y cariño, [entra el servidor de soporte]"
		    },
		    "fields":[
		    ],
		    "color":"#ff00ff"
		}
	}

	async fetchFileNames () {
       this.fileNames = fs.readdirSync('./commands').filter(file => file.endsWith('.js') && !file.startsWith('help'));
	}

	async getGeneralHelp () {

		await this.fetchFileNames();

		for (let file of this.fileNames) {
			const command = require(`./${file}`);

			if (this.helpEmbed.fields.length > 0) {
				let index = 0;
				let hasCategory = false;

				for (let field of this.helpEmbed.fields) {

					// if category already exists, just push the command
					if (field.name === command.category) {
						this.helpEmbed.fields[index].value += '`' + command.aliases[0] + '` ';
						hasCategory = true;
						break;
					}
					index++;
				}

				if (!hasCategory) {		
					this.helpEmbed.fields.push({
						"name": command.category,
						"value" : '`' + command.aliases[0] + '` '
					});
				}

			} else {
				this.helpEmbed.fields.push({
					"name": command.category,
					"value" : '`' + command.aliases[0] + '` '
				});
			}
		}

		utils.sendEmbed(this.msg, this.helpEmbed, false);
	}

	async getCommandHelp () {
		let userInput = this.messageContent;
		let wasFound = false;
		await this.fetchFileNames();

		for (let file of this.fileNames) {
			const command = require(`./${file}`);

			for (let alias of command.aliases) {
				if (alias === userInput) {

					this.helpEmbed.description = `Ayuda para el comando **${command.aliases[0]}**`;

					this.helpEmbed.fields.push({
						name: "Categoría:",
						value: command.category
					})

					this.helpEmbed.fields.push({
						name: "Descripción del comando:",
						value: command.description
					})

					if (!command.args){
						this.helpEmbed.fields.push({
							name: "Uso:",
							value: '`' + config.prefix + '' + command.aliases[0] + '`',
							inline: true
						})
					} else {
						this.helpEmbed.fields.push({
							name: "Uso:",
							value: '`' + config.prefix + '' + command.aliases[0] + ' ' + command.args + '`',
							inline: true
						})	
					}

					this.helpEmbed.fields.push({
						name: "Aliases:",
						value: command.aliases,
						inline: true
					})

					this.helpEmbed.footer.text = "(**) = Argumento obligatorio. (*) = Argumento opcional. | Estos signos son meramente explicativos, no los incluyas al ejecutar algún comando."

					wasFound = true;
					break;
				}
			}
		}

		if (!wasFound) {
			utils.sendErrorMessage(this.msg, 'Tal parece que ese comando no existe...');
			return;
		}

		utils.sendEmbed(this.msg, this.helpEmbed, false);
	}
}

module.exports = {
	aliases: ['help'],
    execute (msg, client, args) {
    	let instance = new Help (msg, client, args);

    	if (!args)
    		instance.getGeneralHelp();
    	else
    		instance.getCommandHelp();
    }
}