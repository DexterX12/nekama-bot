const Booru = require('booru');
const Yande_re = Booru.forSite('yd');
const Utils = require('../utils/utils.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

class Yande_reTag {
	constructor (interaction) {
		this.interaction = interaction;
		this.msgID = new String();
		this.tagOne = interaction.options.getString('tag_one');
		this.tagTwo = interaction.options.getString('tag_two');
		this.fixedMessage;
		this.currentPage = 0;
		this.baseYandereURL = 'https://yande.re/post/show/';
		this.embedObject = {
            title: null,
            description: "",
            author: {
                name: "Resultados de Yande.re",
                icon_url: "https://vignette.wikia.nocookie.net/discord/images/8/8c/Danbooru_Discord_Icon.png"
            },
            image: { url: "" },
            footer: {text:""},
            color: "#ff00ff",
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


	async searchTag () {

		try {

			if (!this.interaction.channel.nsfw) {
				await Utils.sendErrorMessage(this.interaction, 'Estás intentando usar una función NSFW fuera de un canal apropiado para el mismo. 🔞', true);
				return;
			}

			this.fixedMessage = await this.interaction.editReply('Buscando...');	
			this.msgID = this.fixedMessage.id;

			let tagToSearch = this.tagOne;

			if (this.tagTwo)
				tagToSearch += ` ${this.tagTwo}`;
			
			
			this.imagesRequested = await Yande_re.search([tagToSearch], {
				limit: 100
			});

			if (!this.imagesRequested.length > 0) {
				await Utils.sendErrorMessage(this.interaction, 'No encontré resultados al respecto. Asegúrate que sea el tag correcto.', true);
				await this.fixedMessage.delete();
				return;
			}

			await this.sendImage(this.imagesRequested[0], 0);

		} catch (e) {
			console.log(`Ocurrio un error: ${e.message}`);
		}
	}


	async sendImage (imageOBJ, pageNumber, editEmbed=false) {
		try {
			let currentPage = parseInt(pageNumber) + 1;

			this.embedObject.image.url = imageOBJ.fileUrl;
			this.embedObject.footer.text = `Resultado ${currentPage} de ${this.imagesRequested.length} para ${this.tagOne}${(this.tagTwo) ? ", " + this.tagTwo : ""}`;
			this.embedObject.title = `Post ID: ${imageOBJ.id}`;
			this.embedObject.description = `[Clic para ir al post original](${this.baseYandereURL}${imageOBJ.id})`;

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

			const timer = setTimeout( async () => {
				try {
					await this.fixedMessage.edit({components:[this.disabledRow]});
				} catch (error) {
					console.log(error.message);
				}
			}, 30000);

			let filter = m => m.user.id === this.interaction.user.id && (this.msgID === m.message.id);

			let response = await this.fixedMessage.channel.awaitMessageComponent({filter, max: 1, time: 30000, errors:["time"], componentType: "BUTTON"})
			
			response.deferUpdate();
			
			clearTimeout(timer);

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
			console.log('Oops, algo ha sucedido: ' + e.message);
		}
	}


	async changePage (pageNumber) {
		try {		
			this.sendImage(this.imagesRequested[pageNumber], pageNumber, true);
		} catch (e) {
			if (e !== undefined)
				console.log('Oops, algo ha sucedido: ' + e.message);
		}
	}

}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('yande_re')
    .setDescription('Busca y retorna Post de imágenes de Yande.re a partir de un o dos Tag.')
	.addStringOption(option =>
	    option
        .setName('tag_one')
		.setDescription('El Tag a buscar en Yande.re')
		.setRequired(true))
	.addStringOption(option =>
		option
		.setName('tag_two')
		.setDescription('Otro Tag para complementar el anterior')
		.setRequired(false)),
    aliases: ['yande_re'],
    description: 'Busca y retorna Post de imágenes de Yande.re a partir de un o dos Tag. \n\n_Busca imágenes de las etiquetas "40hara" y "kinako", ¡te van a gustar!_',
    category: '🔞 NSFW',
    args : '<Tag> [Tag]',
    async execute(interaction) {

		await interaction.deferReply();

        let instance = new Yande_reTag(interaction)
        instance.searchTag();
    },
};