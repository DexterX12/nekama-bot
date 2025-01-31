const utils = require('../utils/utils.js');
const nhentaiAPI = require('nhentai');
const nhentai = new nhentaiAPI.API();
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

class Nhentai {
	constructor (interaction) {
		this.interaction = interaction;
		this.query = interaction.options.getString('query');
		this.fixedMessage = null;
        this.msgID = "";
        this.results = [];
        this.currentDoujin = null;
        this.timer = null;
        this.isSearchIDBased = false;
		this.embedOptions = {
            title: null,
            description: "",
            author: {
                name: "Resultados de nhentai",
                icon_url: "https://makemoneyadultcontent.com/wp-content/uploads/2020/03/nhentai-logo.png"
            },
            image: { url: "" },
            footer: {text:""},
            color: "#ff00ff",
            fields: [],
            thumbnail: {
                url: ""
            }  
        };

        this.arrowsUIComponents = new MessageActionRow()
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


	async searchDoujin () {
		try {

            this.fixedMessage = await this.interaction.editReply('Buscando...');
            this.msgID = this.fixedMessage.id;
            
            // First check if query it's an ID
            if (!isNaN(parseInt(this.query))) { 
                const result = await nhentai.fetchDoujin(this.query);
                this.currentDoujin = result;

                this.sendDoujin();
                
                return;
            }

            const results = await nhentai.search(this.query);
            this.results = results.doujins;

            this.sendDoujinList();

		} catch (e) {
			utils.sendErrorMessage(this.interaction, 'Ha ocurrido un error. Quizás la ID o búsqueda es incorrecta.', true);
			console.log(`Ocurrio un error: ${e.message}`);
		}
	}

    async sendDoujinList () {
        try {
            let options = [];

            for (let [index, result] of this.results.entries()) {
                options.push({
                    label: result.titles.pretty.slice(0, 50),
                    value: index.toString()
                })
            }
    
            const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('nhen_results')
                .setPlaceholder('Selecciona el resultado deseado')
                .addOptions(options)
            );
    
            await this.fixedMessage.edit({embeds: [this.embedOptions], components: [row]});
    
            await this.WaitDoujinSelection();
        } catch (e) {
            await utils.sendErrorMessage(this.interaction, "Al parecer ocurrió un error, quizás no tengo los permisos suficientes.", true);
            console.log('Ocurrió un error en la función sendDoujinList: ' + e);
        }


    }

    async WaitDoujinSelection() {
        try {

            this.menuTimeout();

			let filter = m => m.user.id === this.interaction.user.id && (this.msgID === m.message.id);
			let response = await this.fixedMessage.channel.awaitMessageComponent({filter, max: 1, time: 30000, errors:["time"], componentType: "SELECT_MENU"})
            
            clearTimeout(this.timer);

            await response.deferUpdate();
            
            this.currentDoujin = this.results[response.values[0]];

            await this.sendDoujin();
			
			
		} catch (error) {
			console.log(error.message);
		}
    }

    async sendDoujin (page=0, editing=false) {

        try {
            this.embedOptions.footer.text = `Página ${page + 1} de ${this.currentDoujin.pages.length}\n\nID: ${this.currentDoujin.id}`;
            this.embedOptions.image.url = this.currentDoujin.pages[page].url;
    
            if (!editing) {             
                this.embedOptions.description = this.currentDoujin.titles.pretty;
                await this.fixedMessage.edit({components:[this.arrowsUIComponents], embeds:[this.embedOptions]});       
            } else {
                await this.fixedMessage.edit({embeds: [this.embedOptions]});
            }
    
            await this.waitUserInput(page);
        } catch (e) {
            console.error('Ocurrió el siguiente error: ' + e);
        }
    }

    async waitUserInput (page) {
		try {

			await this.menuTimeout();

			let filter = m => m.user.id === this.interaction.user.id && (this.msgID === m.message.id);

			let response = await this.interaction.channel.awaitMessageComponent({filter, max: 1, time: 30000, errors:["time"], componentType: "BUTTON"});

			clearTimeout(this.timer);

			await response.deferUpdate();

			switch(response.customId) {
				case 'right':
					if (page < this.currentDoujin.pages.length - 1) {
						await this.changePage(page + 1)
					} else {
						await this.changePage(page)
					}
				break;
				case 'left':
					if (page > 0) {
						await this.changePage(page - 1)
					} else {
						await this.changePage(page)
					}
				break;
			}
					
		} catch (e) {
			console.log(e.message);
		}
    }
    
    async changePage (page) {
        await this.sendDoujin(page, true);
    }

    async menuTimeout () {
        this.timer = setTimeout( async () => {
            try {
                await this.fixedMessage.edit({components:[this.disabledRow]});
            } catch (error) {
                console.log(error.message);
            }
        }, 30000);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nhentai')
    .setDescription('Busca y retorna un Doujinshi o Manga Hentai de nhentai a partir de una ID.')
	.addStringOption(option =>
	    option
        .setName('query')
		.setDescription('El doujin a buscar (Nombre o ID)')
		.setRequired(true)),
    aliases: ['nhentai'],
    description: 'Busca y retorna un Doujinshi o Manga Hentai de nhentai a partir de una ID. \n\n_Pasa esos códigos nucleares y yo los buscaré... Por cierto, busca éste: **177013**_',
    category: '🔞 NSFW',
    args : '<ID>',
    async execute(interaction) {

        if (!interaction.channel.nsfw) {
            utils.sendErrorMessage(interaction, 'Estás intentando usar una función NSFW fuera de un canal apropiado para el mismo. 🔞', false);
            return;
        }

		await interaction.deferReply();

        let instance = new Nhentai(interaction);
        await instance.searchDoujin();
    },
};