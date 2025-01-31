const Utils = require('../utils/utils.js');
const translation = require('translation-google');
const { SlashCommandBuilder } = require('@discordjs/builders');

class Translator {
	constructor (interaction) {
        this.interaction = interaction;
		this.client = interaction.client;
        this.ISO = interaction.options.getString('iso');
        this.content = interaction.options.getString('text');
        this.embedOptions = {
            title: null,
            description: "",
            author: {
                name: "Traductor",
                icon_url: "https://png.pngtree.com/png-vector/20191022/ourmid/pngtree-translating-icon-simple-style-png-image_1838402.jpg"
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

    async getData () {

        
        if (!this.ISO) {
            this.ISO = this.interaction.guild.preferredLocale.slice(0,2);
        }

        this.embedOptions.description = `Traduciendo al idioma -> **${this.ISO}**\n\nResultado:\n`;

        this.translate(this.content, this.ISO);
    }

	async translate (text, iso) {
        try {
            const result = await translation(text, {to: iso});
    
            this.embedOptions.description += '```' + result.text + '```';

            Utils.sendEmbed(this.interaction, this.embedOptions, false);

        } catch {
            Utils.sendErrorMessage(this.interaction, '¡Ha ocurrido un error! ¿Habrás colocado el ISO correcto?');
        }
    }


}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Traduce textos de un idioma a otro.')
    .addStringOption(option =>
        option
        .setName('text')
        .setDescription('Lo que el bot va a traducir')
        .setRequired(true))
	.addStringOption(option =>
	    option
        .setName('iso')
		.setDescription('El ISO del idioma a traducir')
		.setRequired(false)),
        
    aliases: ['translate'],
    description: 'Traduce textos de un idioma a otro. \n\n_Intenta traducir ésto desde el japonés al español (es):_\n"`このコマンドをご利用いただき、誠にありがとうございます。`"',
    category: '🖥️ Comandos Útiles',
    args : '<ISO> <Texto a traducir>',
    async execute(msg, client, args) {
        let instance = new Translator(msg, client, args);

        let randomTime = (Math.floor(Math.random() * 2)) * 1000;

        setTimeout(() => {
            instance.getData();
        }, randomTime);
    },
};