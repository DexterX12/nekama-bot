const Utils = require('../utils/utils.js');
const voiceRegions = require('../collections/serverInfoCollection.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

class ServerInfo { 
    constructor (interaction) {
        this.interaction = interaction;
        this.embedOptions = {
            title: null,
            description: "",
            author: {
                name: "",
                icon_url: ""
            },
            image: { url: "" },
            footer: {},
            color: "#ff00ff",
            fields: [],
            thumbnail: {
                url: ""
            }  
        };
    
    }

    async sendServerInfo () {
        this.embedOptions.author.name = `Información del servidor: ${this.interaction.guild.name}`
        this.embedOptions.author.icon_url = this.interaction.guild.iconURL();
        this.embedOptions.thumbnail.url = this.interaction.guild.iconURL({size: 512});
        this.embedOptions.fields.push(
        {
            name: "**ID del servidor**",
            value: `:id: ${this.interaction.guild.id}`,
            inline: true
        },
        {
            name: "**Creado en**",
            value: `:date: ${this.interaction.guild.createdAt.toString().slice(0, 16)}`,
            inline: true
        },
        {
            name: "**ID del Dueño**",
            value: `:crown: ${this.interaction.guild.ownerId}`,
            inline: true
        },
        {
            name: "**Canales**",
            value: await this.getChannelsAmount(),
            inline: true
        },
        {
            name: "**Roles**",
            value: `${await this.getRolesAmmount()}`,
            inline: true
        },
        {
            name: "**Usuarios**",
            value: `${await this.getUsersAmount()}`,
            inline: true
        },
        {
            name: "**Canal AFK**",
            value: `${await this.getAfkChannels()}`,
            inline: true
        },
        );
    
        this.embedOptions.footer.text = `Información solicitada por: ${this.interaction.user.username}`;
    
        Utils.sendEmbed(this.interaction, this.embedOptions, false);
    }

    async getChannelsAmount () {
        let totalTextChannels = 0,
            totalVoiceChannels = 0;
        const channels = await this.interaction.guild.channels.fetch();

        for (const channel of channels) {

            if (channel[1].type === "GUILD_TEXT") {
                totalTextChannels++;
            } else if (channel[1].type === "GUILD_VOICE") { 
                totalVoiceChannels++;
            }
        }
    
        return `:speech_balloon: De texto: **${totalTextChannels}**\n :speaker: De voz: **${totalVoiceChannels}**\n :tv: En total: **${totalVoiceChannels + totalTextChannels}**`;
    }

    async getUsersAmount () {
       let totalUsers = 0,
           totalBots = 0;

        const members = await this.interaction.guild.members.fetch();

        members.map(member => {
            if (!member.user.bot) {
                totalUsers++;
                return;
            }
            totalBots++;
        })
    
       return `:busts_in_silhouette: Humanos: **${totalUsers}**\n :robot: Bots: **${totalBots}**\n :bar_chart: En total: **${totalUsers + totalBots}**`;
    }

    async getAfkChannels () {
        if(!this.interaction.guild.afkChannel) {
            return "No especificado"; 
        }

        return `:sleeping: Nombre: **${this.interaction.guild.afkChannel}**\n :alarm_clock: Min. de Inactividad: **${this.interaction.guild.afkTimeout / 60}**`;
    
    }

    async getRolesAmmount () {
        let totalRoles = 0;
        this.interaction.guild.roles.cache.forEach(() => {
            totalRoles++
        })

        return totalRoles;
    }

    async sendServerIcon () {
        this.embedOptions.title = "Ícono del servidor";
        this.embedOptions.footer.text = `Pedido por: ${this.interaction.user.username}`;
        this.embedOptions.fields.push({
            name: "Imagen completa",
            value: `[Haz clic aquí para ir al enlace](${this.interaction.guild.iconURL({format: "png", size: 2048})})`
        });
    
        if (this.interaction.guild.iconURL().endsWith(".webp")) { 
            this.embedOptions.image.url = this.interaction.guild.iconURL({format:"png", size: 2048});
        } else {
            this.embedOptions.image.url = this.interaction.guild.iconURL();
        }
    
        //Utils.sendEmbed(this.interaction, this.embedOptions, false);
    }
    
}


module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Muestra información detallada de tu servidor.'),
    aliases: ['serverinfo'],
    description: 'Muestra información detallada de tu servidor. \n\n_Tranquilo, no voy a revelar cuantas lolis tienes secuestradas en ese canal secreto llamado "#mis-lolis"..._',
    category: '🖥️ Comandos Útiles',
    args : false,
    async execute(interaction) {
        let instance = new ServerInfo(interaction)
        instance.sendServerInfo();

    },
};