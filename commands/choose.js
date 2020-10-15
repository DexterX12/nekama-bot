const Utils = require('../utils/utils.js');

async function choose (msg, message) {
    if(!message){
        Utils.sendErrorMessage(msg, '¡Dame 2 o más cosas para elegir!, ejemplo: **ne!choose Gato ; Perro**');
        return;
    }
    
    const embedBase = {
        title: "", description: "", image:{url:""}, thumbnail:{url:""}, footer:"", color:"#ff00ff", fields: [] 
    }
    const options = message.split(';');
    const response = Utils.getRanValueArray(options);
    let finalText = "";

    if (options.length > 6){
        Utils.sendErrorMessage(msg, '¡Oye!, relájate con la cantidad de opciones. <:chancla:722547876244357200>');
        return;
    }

    if (options.length < 2){
        Utils.sendErrorMessage(msg, '¡Oh vamos!, hazme elegir entre 2 o más opciones.');
        return;
    }
    
    options.forEach((option, index) => {
        if (index < options.length - 1)
            finalText +=  `${option}, `;
        else
            finalText += `${option}.`;
    });
    
    embedBase.title = "¡Voy a elegir a lo que me hagas decidir! <:yeah:738560261249826828>";
    embedBase.fields.push({
        name: "Las opciones son:",
        value: finalText
    },
    {
        name: "Mi respuesta es:",
        value: `**${response}**`
    });

    Utils.sendEmbed(msg, embedBase, false);
}

module.exports = {
    aliases: ['choose'],
    description: 'Hazme elegir entre dos o más opciones. \n\n_¡Sé elegir bien, así que confía en mi!_',
    category: ':game_die: Comandos Divertidos',
    args : '<Opcion 1; Opcion 2...>**',
    execute(msg, client, args, command="") {
        choose(msg, args);
    },
};