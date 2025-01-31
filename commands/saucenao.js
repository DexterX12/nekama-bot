const utils = require('../utils/utils.js');
const config = require('../config.json');
const sauceNAO = require('saucenao');
const mySauce = new sauceNAO(config.snaoKey);
const { SlashCommandBuilder } = require('@discordjs/builders');

class SauceNAO {
	constructor (interaction) {
		this.interaction = interaction;
		this.query = interaction.options.getString('query');
		this.pixivBaseURL = 'https://www.pixiv.net/en/artworks/';
		this.embedOptions = {
            title: null,
            description: "",
            author: {
                name: "",
                icon_url: "https://www.userlogos.org/files/logos/zoinzberg/SauceNAO_2.png"
            },
            image: { url: "" },
            footer: {text:`Sauce solicitado por: ${this.interaction.user.username}`},
            color: "#ff00ff",
            fields: [],
            thumbnail: {
                url: ""
            }  
        };
	}

	async requestSauce () {
		try {
			let regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

			if (!regex.test(this.query)) {
				utils.sendErrorMessage(this.interaction, 'La URL especificada no es válida!', true);
				return;
			}

			const response = await mySauce(this.query);
			let results;

			if (response.json.results) {
				results = response.json.results;
			} else {
				utils.sendErrorMessage(this.interaction, 'No he encontrado nada al respecto.', true);
				return;
			}

			this.setResults(results);

		} catch (e) {
			console.log(e);
			utils.sendErrorMessage(this.interaction, 'Al parecer ocurrió un error... ¿estará el link correcto?', true);
		}
	}

	async setResults (results) {

		const result = results[0];

		const header = result.header;
		const data = result.data;

		this.embedOptions.author.name = `Con una similitud del ${header.similarity}%`;

		if (data.pixiv_id) {
			let url = `${this.pixivBaseURL}${data.pixiv_id}`;

			this.embedOptions.description = `[Haz clic aquí para ir al enlace](${url})\n\n`;
		}

		if (data.title) {
			this.embedOptions.description += `Título: ${data.title}`;
		} else {
			this.embedOptions.description += `Título: ${header.index_name}`;
		}

		this.embedOptions.description += `\n\n**Otros datos encontrados:**\n`;

		this.embedOptions.description += '```';

		for (let dataKey in data) {
			if (dataKey !== "title" && dataKey !== "ext_urls") { 
				this.embedOptions.description += `${dataKey}: ${data[dataKey]}\n`;
			}
		}

		this.embedOptions.description += '```';

		this.embedOptions.thumbnail.url = header.thumbnail;

		this.sendResults();
	}

	async sendResults () {
		this.interaction.editReply({embeds:[this.embedOptions]});
	}

}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('saucenao')
    .setDescription('Busca la fuente de alguna imagen a partir de similitudes.')
	.addStringOption(option =>
	    option
        .setName('query')
		.setDescription('El enlace de la imágen a comparar')
		.setRequired(true)),
    aliases: ['saucenao'],
    description: 'Busca la fuente de alguna imagen a partir de similitudes. \n\n_Puedes buscar la fuente de mi foto de pfp, te aseguro que no habrá resultados, creo..._',
    category: '🔍 Comandos de Búsqueda',
    args : '<URL o Imagen Adjuntada>',
    async execute(interaction) {

		await interaction.deferReply();

        let instance = new SauceNAO(interaction);
        instance.requestSauce();
    },
};