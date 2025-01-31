const Utils = require('../utils/utils.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

function sendServerIcon (interaction) {
    const embedOptions = {
        title: null, description: "", image: { url: "" }, footer: {}, color: "#ff00ff", fields: [], thumbnail: { url: "" }  
    };

    embedOptions.title = "Ícono del servidor";
    embedOptions.footer.text = `Pedido por: ${interaction.user.username}`;
    embedOptions.fields.push({
        name: "Imagen completa",
        value: `[Haz clic aquí para ir al enlace](${interaction.guild.iconURL({dynamic: true, size: 2048})})`
    });


    const icon = interaction.guild.iconURL({dynamic: true, size: 2048});


    if (!icon) {
        Utils.sendErrorMessage(interaction, 'No existe un ícono para este servidor!');
        return;
    }

    if (icon.endsWith(".webp")) { 
        embedOptions.image.url = interaction.guild.iconURL({format:"png", size: 2048});
    } else {
        embedOptions.image.url = icon;
    }


    Utils.sendEmbed(interaction, embedOptions, false);
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('servericon')
    .setDescription('Muestro el ícono de tu servidor.'),
    aliases: ['servericon'],
    description: 'Muestro el ícono de tu servidor. \n\n_Mostrad que tan bello es el ícono de tu server, yo le doy 10/10_',
    category: '🖥️ Comandos Útiles',
    args : false,
    async execute(interaction) {
        sendServerIcon(interaction);
    },
};