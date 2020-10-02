const Utils = require('../utils/utils.js');

function sendServerIcon (msg) {
    const embedOptions = {
        title: null, description: "", image: { url: "" }, footer: {}, color: "#ff00ff", fields: [], thumbnail: { url: "" }  
    };

    embedOptions.title = "Ícono del servidor";
    embedOptions.footer.text = `Pedido por: ${msg.author.username}`;
    embedOptions.fields.push({
        name: "Imagen completa",
        value: `[Haz clic aquí para ir al enlace](${msg.guild.iconURL({format: "png", size: 2048})})`
    });

    if (msg.guild.iconURL().endsWith(".webp")) { 
        embedOptions.image.url = msg.guild.iconURL({format:"png", size: 2048});
    } else {
        embedOptions.image.url = msg.guild.iconURL();
    }


    Utils.sendEmbed(msg, embedOptions, false);
}

module.exports = sendServerIcon;