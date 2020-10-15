const Utils = require('../utils/utils.js');

async function eightBall (msg, message) {
    const embedBase = {
        title: "", description: "", image:{url:""}, thumbnail:{url:""}, footer:"", color:"#ff00ff", fields: [] 
    }
    const eightBallPhrases = ["Sí, seguro que sí.", "¿Por qué no?", "¡Claro que sí!", "Quien sabe.", "Prefiero no responder.", "Por supuesto.", "Negativo.", "No lo creo.", "¿Qué crees tú?", "Puede ser.", "Quizás, tal vez, a lo mejor, sea posible.", "¡En lo absoluto!", "No creo.", "¿Seguro quieres saber?", "Correcto.", "Confirmo.", "Afirmativo.", "¡Así es!", "Lo confirmo.", "Eso es falso.", "Eso es muy cierto.", "...", "No estoy seguro.", "No sé, dime tú.", "¿Quieres saber?", "¡Jajajaja!, no."];
    const response = Utils.getRanValueArray(eightBallPhrases);
    if (!message){
        Utils.sendErrorMessage(msg, 'Pregúntame algo, pero cuidado con lo que preguntas.');
        return;
    }

    embedBase.title = "Pregunta del 8ball <:pensando:705937711873261587>";
    embedBase.fields.push({
        name: `${msg.author.username} pregunta:`,
        value: message
    },
    {
        name: "Mi respuesta es",
        value: response
    });

    Utils.sendEmbed(msg, embedBase, false);
}

module.exports = {
    aliases: ['8ball'],
    description: 'Hazme una pregunta y yo la responderé de acuerdo a lo que sé. \n\n_¡Hey pero ojo, no me preguntes cosas obsenas, absurdas o mis tallas!_',
    category: ':game_die: Comandos Divertidos',
    args : '<Pregunta>**',
    execute(msg, client, args) {
        eightBall(msg, args);
    },
};;
