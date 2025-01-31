const Utils = require('../utils/utils.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const youtube = require('scrape-youtube').default;
//const youtube = new Client();

class YoutubeSearch {
	constructor (interaction) {
		this.client = interaction.client;
		this.query = encodeURIComponent(interaction.options.getString('query'));
		this.interaction = interaction;
		this.baseYoutubeURL = 'https://www.youtube.com/watch?v=';
		this.fixedMessage = null;
		this.msgID = null;
		this.options = [];
	}

	async searchYoutube () {
		try {

			const results = await youtube.search(this.query);
			const videoLimit = 9 // index based

			if(results.videos.length < 1) {
				await Utils.sendErrorMessage(this.interaction, '¡Oh no! No pude encontrar tu petición. Quizás podrías probar con otras palabras.', true);
				return;
			}
			
			for (const [index, video] of results.videos.entries()) {

				if (index <= videoLimit) {
					this.options.push({
						label: video.title,
						description: video.description,
						value: index.toString()
					});
				} else {
					break;
				}
			}

			const row = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId('yt_results')
					.setPlaceholder('Selecciona el resultado deseado')
					.addOptions(this.options)
			)

			this.fixedMessage = await this.interaction.editReply({content: 'Se han encontrado los siguientes resultados',components: [row]});
			this.msgID = this.fixedMessage.id;

			this.getUserOption(results.videos);

		} catch (e) {
            console.log(e.message);
			await Utils.sendErrorMessage(this.interaction, 'Ocurrió un error inesperado en la búsqueda, intenta de nuevo.', true);
		}
	}

	async getUserOption (videos) {	
		try {
			const filter = m => m.user.id === this.interaction.user.id && (this.msgID === m.message.id);
	
			// ahora se obtienen valores del usuario via MessageComponentCollector desde un canal
			const collector = this.interaction.channel.createMessageComponentCollector({
				componentType: "SELECT_MENU",
				max: 1,
				filter
			});
	
			collector.on('collect', async interaction => {
				try {
					const optionChosen = interaction.values[0];
		
					await interaction.deferUpdate();
	
					this.sendVideo(videos[optionChosen]);		
				} catch (e) {
					console.log(e.message);
				}
			});
			
		} catch (error) {
			console.log(error.messsage);
		}
	}

	async sendVideo (video) {
		try {
			await this.fixedMessage.edit({content: `**Título:** ${video.title}\n**Fecha de publicación:** ${video.uploaded}\n${this.baseYoutubeURL + video.id}`, components:[]});
		} catch (e) {
			console.log(e.message);
		}
	}

}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Busca vídeos en YouTube')
	.addStringOption(option =>
	    option
        .setName('query')
		.setDescription('El vídeo que se buscará')
		.setRequired(true)),
    aliases: ['youtube'],
    description: 'Busca videos de youtube. \n\n_¡Te recomiendo buscar videos de gatos, los videos de gatos son lo mejor en YouTube!_',
    category: '🔍 Comandos de Búsqueda',
    args : '<Elemento a buscar>',
    async execute(interaction) {
		interaction.deferReply();

		setTimeout(() => {
			let instance = new YoutubeSearch(interaction)
			instance.searchYoutube();
		},2000);
    },
};