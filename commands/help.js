const utils = require('../utils/utils.js');
const config = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders'); 
const { MessageActionRow, MessageSelectMenu } = require('discord.js');


class Help {
	constructor (interaction) {
		this.interaction = interaction;
		this.query = interaction.options.getString('command');
		this.client = interaction.client;
		this.commands = interaction.commands;
		this.fixedMessage = Object;
		this.msgId = "";
		this.categories = [];
		this.categoriesOption = [];
		this.helpEmbed = {
		    "author": {
		    	name:"Comandos de Nyantakus",
		    	icon_url: this.client.user.displayAvatarURL()
		    },
		    "description": "",
		    "image":{ 
		        "url": ""
		    },
		    "footer":{
		    	"text": "¡Usa mis comandos con cariño! Te estoy advirtiendo, ¿oiste?"
		    },
		    "fields":[
		    ],
			"color":"#ff00ff"
		}
	}

	async getGeneralHelp (edit=false) {

		await this.getCategories();
		await this.getCategoryOptions();

		this.helpEmbed.description = `Hello Sekai! Mi nombre es **Nyantakus**. Aquí tienes mi **lista de comandos**. \nSi necesitas ayuda detallada de algún comando entonces usa **help <comando>**.\n\nActualmente cuento con **${this.commands.size}** comandos y **${this.categories.length}** categorías.`;
		
		await this.setCategories();
	}

	async getCategories () {
		for (const [commandKey, command] of this.commands) {
			const category = command.category;

			if (command.aliases[0] !== "help" && !this.categories.includes(category)) {
				this.categories.push(category);
			}
		}
	}

	async getCategoryOptions () {
		for (const [index, category] of this.categories.entries()) {

			let categoryName = category.split(" ").slice(1).join(" ");

			this.categoriesOption.push({
				label: categoryName,
				description: ``,
				value: index.toString(),
				emoji: `${category.split(" ")[0]}`
			});
		}
	}

	async setCategories (edit=false) {
		const rowCategory = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
			.setCustomId('categories')
			.setPlaceholder('Selecciona la categoría que quieres revisar.')
			.addOptions(this.categoriesOption)
		);

		if (!edit) {
			this.fixedMessage = await this.interaction.editReply({embeds:[this.helpEmbed], components:[rowCategory]});
			this.msgId = this.fixedMessage.id;
		} else {
			await this.fixedMessage.edit({embeds:[this.helpEmbed]});
		}

		await this.categoryByUserInput();
	}

	async categoryByUserInput () {
		const filter = m => m.user.id === this.interaction.user.id && (this.msgId === m.message.id);
		const collector = this.interaction.channel.createMessageComponentCollector({
			componentType: "SELECT_MENU",
			max: 1,
			filter
		});

		const timer = setTimeout( async () => {
			try {
				await this.fixedMessage.edit({components:[]});
			} catch (error) {
				console.log(error.message);
			}
		}, 30000);

		
		collector.on('collect', async interaction => {

			clearTimeout(timer);
			
			this.helpEmbed.description = `¡Hello Isekai!, mi nombre es, **Nyantakus**, aquí tienes mi **lista de comandos**. \nSi necesitas ayuda detallada de algún comando entonces usa **help <comando>**.\n\nActualmente cuento con **${this.commands.size}** comandos y **${this.categories.length}** categorías.`;
			
			await interaction.deferUpdate();

			const category = this.categories[interaction.values[0]];

			let commandsInText = `${category}\n\n`;
			

			for (const [commandKey, command] of this.commands) {
				if (command.aliases[0] !== "help" && command.category === category) {
					commandsInText += "`" + command.aliases[0] + "` ";
				}
			}

			this.helpEmbed.description += `\n\n${commandsInText}`;

			await this.setCategories(true);

		})
		
	} 

	async getCommandHelp (commandArg) {
		let userInput = commandArg ? commandArg : this.query;
		let wasFound = false;

		for (let [commandKey, command] of this.commands) {
			if (command.aliases[0] !== "help" && command.aliases[0] === userInput) {
	
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
						name: "Ejemplo de uso:",
						value: '`' + config.prefix + '' + command.aliases[0] + '`',
						inline: true
					})
				} else {
					this.helpEmbed.fields.push({
						name: "Ejemplo de uso:",
						value: '`' + config.prefix + '' + command.aliases[0] + ' ' + command.args + '`',
						inline: true
					})	
				}
	
				this.helpEmbed.fields.push({
					name: "Alias:",
					value: `${command.aliases[0]}`,
					inline: true
				})
	
				this.helpEmbed.footer.text = "Nota: <> = Argumento obligatorio. [] = Argumento opcional. \n¡Estos signos son meramente explicativos, no los incluyas al ejecutar algún comando!"
	
				wasFound = true;
				break;
			}
		}

		if (!wasFound) {
			utils.sendErrorMessage(this.interaction, 'Tal parece que ese comando no existe... <:pensando:722547844770299909>', true);
			return;
		}

		await this.interaction.editReply({embeds:[this.helpEmbed]});
	}
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra una útil ayuda sobre todos los comandos.')
	.addStringOption(option =>
	    option
        .setName('command')
		.setDescription('Comando al cual se revisarán los detalles')
		.setRequired(false)),
	aliases: ['help'],
    async execute (interaction) {

		await interaction.deferReply();

		let args = interaction.options.getString('command');

		let instance = new Help(interaction);

    	if (!args)
    		instance.getGeneralHelp();
    	else
    		instance.getCommandHelp();
    }
}