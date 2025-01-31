const Utils = require('../utils/utils.js');
const googleImageSearch = require('image-search-google');
const client = new googleImageSearch('', '');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

class ImageSearch {
	constructor (interaction) {
		this.interaction = interaction;
		this.msgID = new String();
		this.query = interaction.options.getString('query');
        this.imagesRequested = [];
		this.fixedMessage;
		this.embedObject = {
            title: null,
            description: "",
            author: {
                name: "Resultados de la búsqueda:",
                icon_url: "https://images.theconversation.com/files/93616/original/image-20150902-6700-t2axrz.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1000&fit=clip"
            },
            image: { url: "" },
            footer: {text:""},
            color: "#114CEB",
            fields: [],
            thumbnail: {
                url: ""
            }  
        };
		this.row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('left')
					.setLabel('«')
					.setStyle('DANGER'),
				new MessageButton()
					.setCustomId('right')
					.setLabel('»')
					.setStyle('SUCCESS')
			);
		
		this.disabledRow = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('left')
				.setLabel('«')
				.setStyle('SECONDARY')
				.setDisabled(true),
			new MessageButton()
				.setCustomId('right')
				.setLabel('»')
				.setStyle('SECONDARY')
				.setDisabled(true)
		);
	}

	async searchImage () {

		try {
			this.fixedMessage = await this.interaction.editReply('Ok, dame un momento para surfear la web...');
			this.msgID = this.fixedMessage.id;
		
			const results = await client.search(this.query, {page: 1});
			
			if (results.length < 1) {
				await Utils.sendErrorMessage(this.interaction, 'Parece que no he encontrado nada en la web. ¡Rayos! ¿Podrías intentar de otra forma?', true);
				this.fixedMessage.delete();
				return;
			}
			
			for (let result of results) {
				this.imagesRequested.push({
					"title": result.snippet,
					"description": result.context,
					"image_url": result.url
				});
			}
			
			await this.sendImage(this.imagesRequested[0], 0);
		} catch (e) {
			console.log(e.message);
		}
	}


	async sendImage (imageOBJ, pageNumber, editEmbed=false) {
		try {
			let currentPage = parseInt(pageNumber) + 1;

			this.embedObject.image.url = imageOBJ.image_url;
			this.embedObject.footer.text = `Resultado ${currentPage} de ${this.imagesRequested.length}`;
			this.embedObject.title = imageOBJ.title;
			this.embedObject.description = `[Ve a la web de donde proviene la imágen](${imageOBJ.description})`;

			if (!editEmbed)
				await this.fixedMessage.edit({embeds: [this.embedObject], components: [this.row]});
			else
				await this.fixedMessage.edit({embeds: [this.embedObject]});

			
			await this.waitForUserInput(pageNumber);

		} catch (e) {
			console.log('Oops, algo ha sucedido: ' + e.message);
		}
	}


	async waitForUserInput (pageNumber) {
		try {

			const timer = setTimeout(async () => {
				try {
					await this.fixedMessage.edit({components:[this.disabledRow]});
				} catch (error) {
					console.log(error.message);
				}
			}, 30000);

			let filter = m => m.user.id === this.interaction.user.id && (this.msgID === m.message.id);

			let response = await this.interaction.channel.awaitMessageComponent({filter, max: 1, time: 30000, errors:["time"], componentType: "BUTTON"});

			clearTimeout(timer);

			await response.deferUpdate();

			//this.fixedMessage = response;

			switch(response.customId) {
				case 'right':
					if (pageNumber < this.imagesRequested.length - 1) {
						this.changePage(pageNumber + 1)
					} else {
						this.changePage(pageNumber)
					}
				break;
				case 'left':
					if (pageNumber > 0) {
						this.changePage(pageNumber - 1)
					} else {
						this.changePage(pageNumber)
					}
				break;
				default:
					this.changePage(pageNumber);
			}
					
		} catch (e) {
			console.log(e.message);
		}
	}


	async changePage (pageNumber) {
		try {		
			this.sendImage(this.imagesRequested[pageNumber], pageNumber, true);
		} catch (e) {
			if (e !== undefined)
				console.log(e.message);
		}
	}

}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('imagesearch')
    .setDescription('Busca imágenes en Internet usando Google Imágenes.')
	.addStringOption(option =>
	    option
        .setName('query')
		.setDescription('La imágen a buscar en Google')
		.setRequired(true)),
    aliases: ['imagesearch'],
    description: 'Busca imágenes en Internet usando Google Imágenes. \n\n_¡Busca imágenes Moe de Anime!_',
    category: '🔍 Comandos de Búsqueda',
    args : '<Elemento a buscar>',
    async execute(interaction) {
		
		await interaction.deferReply();

		let instance = new ImageSearch(interaction);
		await instance.searchImage();

    },
};