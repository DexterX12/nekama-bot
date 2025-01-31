const Utils = require('../utils/utils.js');
const MathJS = require('mathjs');
const { SlashCommandBuilder } = require('@discordjs/builders');

class Calculator {
    constructor (interaction) {
        this.interaction = interaction;
        this.operation = interaction.options.getString('operation').replace(" ", "");
        this.embedOptions = {
            title: null, description: "", image: { url: "" }, footer: {}, color: "#ff00ff", fields: [], thumbnail: { url: "" }  
        };
        this.gifOne = "https://i.imgur.com/NsKzI1N.gif"
        this.easterImg = "https://i.imgur.com/nuIoyCc.jpg"
    }

    sendCalc () {
        try{
            this.embedOptions.title = "¡Calculando! :abacus:";
            this.embedOptions.fields.push({
                name: "Operación a calcular:",
                value: this.operation
            },
            {
                name: "El resultado es:",
                value: `${MathJS.evaluate(this.operation)}`
            })
            this.embedOptions.image.url = this.gifOne;
            this.embedOptions.footer.text = "¡Soy un bot super inteligente!";

            Utils.sendEmbed(this.interaction, this.embedOptions, false);
        } catch (e) {
            console.log(e);
            this.interaction.reply('¡Oops! Al parecer no recibí una operación válida. :warning:');
        }


    }
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('Una pequeña pero potente calculadora para operaciones matemáticas')
	.addStringOption(option =>
	    option
        .setName('operation')
		.setDescription('La operación matemática a realizar')
		.setRequired(true)),
    aliases: ['calc'],
    description: 'Una pequeña pero potente calculadora para operaciones matemáticas, muy útil para tus estudios escolares o universitarios. \n\n_¡Pero no lo uses para hacer trampa!_',
    category: '🖥️ Comandos Útiles',
    args : '<Operación matemática>',
    async execute(interaction) {
        let instance = new Calculator(interaction);
        instance.sendCalc();
    },
};