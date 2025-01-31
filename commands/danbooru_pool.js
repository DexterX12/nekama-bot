const fetch = require('node-fetch');
const utils = require('../utils/utils.js');
const Booru = require('danbooru');
const Danbooru = new Booru();
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

class DanbooruPool {
	constructor (interaction) {
		this.interaction = interaction;
		this.msgID = new String();
		this.query = interaction.options.getString('tag');
		this.fixedMessage;
		this.postsID = [];
		this.imagesRequested = [];
		this.currentPage = 0;
		this.pools = [];
		this.poolsFetch = `https://danbooru.donmai.us/pools.json?search[name_matches]=`;
		this.baseDanbooruURL = 'https://danbooru.donmai.us/posts/';
		this.searchToken = "";
		this.embedObject = {
            title: null,
            description: "",
            author: {
                name: "Resultados de Danbooru",
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


	async searchPools () {
		try {

			if (!this.interaction.channel.nsfw) {
				await utils.sendErrorMessage(this.interaction, 'Estás intentando usar una función NSFW fuera de un canal apropiado para el mismo.');
				return;
			}

			this.fixedMessage = await this.interaction.editReply('Buscando...');
			this.msgID = this.fixedMessage.id;

			let userQuery = this.query;
			let poolsResponse = await fetch(`${this.poolsFetch}${userQuery}`);
			this.pools = await poolsResponse.json();

			this.showPools();

		} catch (e) {
			console.log(`Ocurrió un error: ${e.message}`);
		}
	}


	async showPools () {

		if (!this.pools.length > 0) {
			await utils.sendErrorMessage(this.interaction, '¡Oh no! Al parecer no existe una pool con la tag que mencionaste.', true);
			return;
		}

		const options = [];


		for (let [index, pool] of this.pools.entries()) {
			options.push({
				label: `${pool.name.slice(0, 50)}...`,
				description: `Resultado #${index + 1} en Danbooru sobre ${this.query}`,
				value: index.toString()
			});
		}

		const select_row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
					.setCustomId('pools_results')
					.setPlaceholder('Selecciona el resultado deseado')
					.addOptions(options)
				);

		await this.fixedMessage.edit({content: "Selecciona la Pool que desees ver.", components: [select_row]});

		this.poolUserInput();
	}


	async poolUserInput () {
		try {	

			const timer = setTimeout( async () => {
				try {
					await this.fixedMessage.edit({components:[]});
				} catch (error) {
					console.log(error.message);
				}
			}, 30000);

			let filter = m => m.user.id === this.interaction.user.id && (this.msgID === m.message.id);
			let response = await this.interaction.channel.awaitMessageComponent({filter, max: 1, time: 30000, errors:["time"], componentType: "SELECT_MENU"});

			await response.deferUpdate();
	
			clearTimeout(timer);
			
			const poolIndex = response.values[0];
			
			this.postsID = this.pools[poolIndex].post_ids;
			
			await this.getPoolPosts();
			
			
		} catch (e) {
			console.log(e.message);
		}
	}


	async getPoolPosts () {
		try {

			for (let postID of this.postsID) {
				let postResponse = await Danbooru.posts(postID);

				this.imagesRequested.push(postResponse);
			}

			if (!this.imagesRequested[0]) {
				await utils.sendErrorMessage(this.interaction, "Algo malo pasó al intentar ver dicho Pool. ¿Quizás es inválido?", true);
				return;
			}

			await this.sendImage(this.imagesRequested[0], 0);

		} catch (e) {
			await utils.sendErrorMessage(this.interaction, '¡Oops! Algo malo ocurrió mientras la operación se realizaba.\n' + e);
		}
	}


	async sendImage (imageOBJ, pageNumber, editEmbed=false) {
		try {
			let currentPage = parseInt(pageNumber) + 1;

			this.embedObject.image.url = imageOBJ.file_url;
			this.embedObject.footer.text = `Resultado ${currentPage} de ${this.imagesRequested.length} para ${this.query}`;
			this.embedObject.title = `Post ID: ${imageOBJ.id}`;
			this.embedObject.description = `[Clic para ir al post original](${this.baseDanbooruURL}${imageOBJ.id})`;

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

			let response = await this.interaction.channel.awaitMessageComponent({filter, max: 1, time: 30000, errors:["time"], componentType: "BUTTON"});
			
			await response.deferUpdate();

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
    .setName('danboorupool')
    .setDescription('Retorna un Pool de imágene de Danbooru a partir de un Tag')
	.addStringOption(option =>
	    option
        .setName('tag')
		.setDescription('El Tag a buscar en Danbooru')
		.setRequired(true)),
    aliases: ['danboorupool'],
    description: 'Retorna un Pool de imágene de Danbooru a partir de un Tag \n\n_Los Pool son como álbumes de imágenes_.',
    category: '🔞 NSFW',
    args : '<Tag>',
    async execute(interaction) {
		
		await interaction.deferReply();

		let instance = new DanbooruPool(interaction);
		await instance.searchPools();

    },
};