const Utils = require('../utils/utils.js');
const wiki = require('wikijs').default({ apiUrl: 'https://es.wikipedia.org/w/api.php' });
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

class WikiSearch {
	constructor (interaction) {
		this.interaction = interaction;
		this.msgID = new String ();
		this.fixedMsg = new Object();
		this.client = interaction.client;
		this.query = interaction.options.getString('query');
		this.channel = interaction.channel;
		this.menuInteraction = null;
		this.wikipediaBaseURL = 'https://es.wikipedia.org/wiki/';
		this.embedOptions = {
            title: null,
            description: "",
            author: {
                name: "Búsqueda de Wikipedia",
                icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Wikipedia-logo-v2-es.svg/1200px-Wikipedia-logo-v2-es.svg.png"
            },
            image: { url: "" },
            footer: {text:""},
            color: "#ff00ff",
            fields: [],
            thumbnail: {
                url: ""
            }  
        };
		
	}

	async searchArticle () {
		try {

			this.fixedMsg = await this.interaction.editReply({content:"Estoy buscando sobre eso..."});
			this.msgID = this.fixedMsg.id;

			const response = await wiki.search(this.query);
			const resultsLimit = 4; // index based
			const options = [];
	
	
			if (response.results.length === 0) {
				await Utils.sendErrorMessage(this.interaction, 'No he encontrado nada. Seguro que si intentas con otras palabras quizás funcione.', true);
				return;
			}
	
			for (let [index, result] of response.results.entries()) {
				if (index <= resultsLimit) {
					options.push({
						label: result,
						description: `Resultado #${index + 1} de la wikipedia sobre ${this.query}`,
						value: index.toString()
					});
				} else {
					break;
				}
			}
	
			const row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
					.setCustomId('wiki_results')
					.setPlaceholder('Selecciona el resultado deseado')
					.addOptions(options)
				);
	
			await this.fixedMsg.edit({content: "Se han encontrado los siguientes artículos:", components:[row]});

			await this.getUserOption(response.results);
		} catch (error) {
			console.log(error.message);
		}
	}

	async getUserOption (results) {	
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
		
					// elimina el menu de seleccion, asi el usuario no ejecuta de nuevo la funcion
					await this.fixedMsg.edit({ components: []});
		
					setTimeout(() => {
						this.getArticle(results[optionChosen]);
					}, 2000); // Esto es para evitar que nos rate-limiten el bot por peticion
				} catch (e) {
					console.log(e.message);
				}
			});
			
		} catch (error) {
			console.log(error.message);
		}
	}

	async getArticle (articleToSearch) {
		try {
			const response = await wiki.find(articleToSearch);
			const info = await response.summary();
			this.embedOptions.title = response.title;

			this.embedOptions.description = `[Clic aquí para ir al artículo original](${response.fullurl})\n\n`
			this.embedOptions.description += await this.cleanInfo(info);
			
			if (this.embedOptions.description.length > 1000) {
				this.embedOptions.description = `${this.embedOptions.description.slice(0, 1000)}...`;
			}
	
			this.sendArticle();
		} catch (error) {
			console.log(error.message);
		}
	}

	async sendArticle () {
		try{
			await this.fixedMsg.edit({embeds:[this.embedOptions]});
		} catch (e) {
			console.log(e.message);
		}
	}

	async cleanInfo (info) {
		const newInfo = info.replace(/ *\[[^\]]*]/g, '');
		return newInfo;
	}


}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('wikipedia')
    .setDescription('Busca resultados en Wikipedia.')
	.addStringOption(option =>
	    option
        .setName('query')
		.setDescription('Los datos a buscar en wikipedia')
		.setRequired(true)),
    aliases: ['wikipedia', 'wiki'],
    description: 'Busca resultados en Wikipedia. \n\n_Es un excelente comando para tus estudios, ¡aprovechalo!_',
    category: '🔍 Comandos de Búsqueda',
    args : '<Elemento a buscar>',
    async execute(interaction) {

		await interaction.deferReply();

		setTimeout(() => {
			let instance = new WikiSearch(interaction) 
			instance.searchArticle();
		},3000);

    },
};