const Utils = require('../utils/utils.js');
const MathJS = require('mathjs');

class Calculator {
    constructor (msg, operations) {
        this.msg = msg;
        this.operation = operations.split(' ')[0];
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
                value: MathJS.evaluate(this.operation)
            })
            this.embedOptions.image.url = this.gifOne;
            this.embedOptions.footer.text = "¡Soy un bot super inteligente!";
            Utils.sendEmbed(this.msg, this.embedOptions, false);
        } catch (e) {
            console.log(e);
            this.msg.channel.send('¡Oops! Al parecer no recibí una operación válida. :warning:');
        }


    }
}

module.exports = Calculator;