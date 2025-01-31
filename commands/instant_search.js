const Utils = require('../utils/utils.js');
const fetch = require('node-fetch');
const apiKEY = '';
const apiID = '';
const baseURL = `https://www.googleapis.com/customsearch/v1?key=${apiKEY}&cx=${apiID}&q=`;
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

class InstantSearch {
	constructor (interaction) {
        this.interaction = interaction;
        this.query = interaction.options.getString('query');
        this.msgID = new String();
        this.fixedMessage;
        this.results = [];
		this.embedObject = {
            title: null,
            description: "",
            author: {
                name: "Resultados de la búsqueda:",
                icon_url: "https://images.theconversation.com/files/93616/original/image-20150902-6700-t2axrz.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1000&fit=clip"
            },
            image: { url: "" },
            footer: {text:"Resultados de Google Search"},
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

    async getSearch () {
        try {
            this.fixedMessage = await this.interaction.editReply('Dame un momento, voy a buscar eso en Google.');
            this.msgID = this.fixedMessage.id;

            let response = await fetch(`${baseURL}${this.query}`);
            response = await response.json();
    
            let post = [];
    
            // Create arrays with two results, which are saved in a parent array.
            for (const item of response.items) {
    
                if (post.length < 2) {
                    post.push({
                        name: `Título: ${item.title}`,
                        value: `**Descripción:**\n${item.snippet}\n[Clic aquí para ir al enlace](${item.link})`
                    });
                } else {
                    this.results.push(post);
                    post = [];
                }
    
            }
    
            await this.setEmbed(this.results, 0);
            
        } catch (error) {
            console.log(error.message);
        }
    }

    async setEmbed (results, pageNumber, editEmbed=false) {

        this.embedObject.fields = [];

        const currentPage = pageNumber + 1;
        const totalPages = this.results.length;

        for (const result of results[pageNumber]) {
            this.embedObject.fields.push(result);
        }

        this.embedObject.footer.text = `Página ${currentPage} de ${totalPages}`;

        if (!editEmbed)
            await this.fixedMessage.edit({embeds:[this.embedObject], components:[this.row]});
        else
            await this.fixedMessage.edit({embeds:[this.embedObject]});

        this.waitForUserInput(pageNumber);
        
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
            
            await response.deferUpdate();
			
			clearTimeout(timer);

			switch(response.customId) {
				case 'right':
					if (pageNumber < this.results.length - 1) {
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
			this.setEmbed(this.results, pageNumber, true);
		} catch (e) {
			if (e !== undefined)
				console.log('Oops, algo ha sucedido: ' + e.message);
		}
	}


}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Busca información en internet usando Google.')
	.addStringOption(option =>
	    option
        .setName('query')
		.setDescription('La información que se buscará en Google.')
		.setRequired(true)),
    aliases: ['search'],
    description: 'Busca información en internet usando Google. \n\n_Busca información útil y de calidad, por ejemplo: **Anime**_',
    category: '🔍 Comandos de Búsqueda',
    args : '<Elemento a buscar>',
    async execute(interaction) {

        await interaction.deferReply();

        let instance = new InstantSearch(interaction);
        instance.getSearch();
    },
};
