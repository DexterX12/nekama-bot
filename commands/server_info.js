const Utils = require('../utils/utils.js');
const voiceRegions = require('../collections/serverInfoCollection.json');

class ServerInfo { 
    constructor (msg) {
        this.msg = msg;
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
        this.embedOptions.author.name = `Información del servidor: ${this.msg.guild.name}`
        this.embedOptions.author.icon_url = this.msg.guild.iconURL();
        this.embedOptions.thumbnail.url = this.msg.guild.iconURL({size: 512});
        this.embedOptions.fields.push(
        {
            name: "**ID del servidor**",
            value: `:id: ${this.msg.guild.id}`,
            inline: true
        },
        {
            name: "**Región**",
            value: this.getVoiceRegion(),
            inline: true
        },
        {
            name: "**Creado en**",
            value: `:date: ${this.msg.guild.createdAt.toString().slice(0, 16)}`,
            inline: true
        },
        {
            name: "**Dueño**",
            value: `:crown: ${this.msg.guild.owner.user.username}#${this.msg.guild.owner.user.discriminator}`,
            inline: true
        },
        {
            name: "**Canales**",
            value: this.getChannelsAmount(),
            inline: true
        },
        {
            name: "**Roles**",
            value: this.getRolesAmmount(),
            inline: true
        },
        {
            name: "**Usuarios**",
            value: this.getUsersAmount(),
            inline: true
        },
        {
            name: "**Canal AFK**",
            value: this.getAfkChannels(),
            inline: true
        },
        );
    
        this.embedOptions.footer.text = `Información solicitada por: ${this.msg.author.username}`;
    
        Utils.sendEmbed(this.msg, this.embedOptions, false);
    }

    getChannelsAmount () {
        let totalTextChannels = 0,
            totalVoiceChannels = 0;
        this.msg.guild.channels.cache.forEach((channel) => {
            if (channel.type === "text") {
                totalTextChannels++;
            } else if (channel.type === "voice") { 
                totalVoiceChannels++;
            }
        });
    
        return `:speech_balloon: De texto: **${totalTextChannels}**\n :speaker: De voz: **${totalVoiceChannels}**\n :tv: En total: **${totalVoiceChannels + totalTextChannels}**`;
    }

    getUsersAmount () {
       let totalUsers = 0,
           totalBots = 0;
       this.msg.guild.members.cache.forEach((user) => {
           if (!user.user.bot) {
               totalUsers++
               return;
           }
           totalBots++;
       })
    
       return `:busts_in_silhouette: Humanos: **${totalUsers}**\n :robot: Bots: **${totalBots}**\n :bar_chart: En total: **${totalUsers + totalBots}**`;
    }

    getAfkChannels () {
        if(!this.msg.guild.afkChannel) {
            return "No especificado"; 
        }

        return `:sleeping: Nombre: **${this.msg.guild.afkChannel}**\n :alarm_clock: Min. de Inactividad: **${this.msg.guild.afkTimeout / 60}**`;
    
    }
    
    getVoiceRegion () {
        let region = "";
        for(let letter = 0; letter < this.msg.guild.region.length; letter++) {
            if (!/\d/.test(this.msg.guild.region[letter])) {
                region += this.msg.guild.region[letter];
            }
        }

        return voiceRegions.regions[region];
    }

    getRolesAmmount () {
        let totalRoles = 0;
        this.msg.guild.roles.cache.forEach(() => {
            totalRoles++
        })

        return totalRoles;
    }

    sendServerIcon () {
        this.embedOptions.title = "Ícono del servidor";
        this.embedOptions.footer.text = `Pedido por: ${this.msg.author.username}`;
        this.embedOptions.fields.push({
            name: "Imagen completa",
            value: `[Haz clic aquí para ir al enlace](${this.msg.guild.iconURL({format: "png", size: 2048})})`
        });
    
        if (this.msg.guild.iconURL().endsWith(".webp")) { 
            this.embedOptions.image.url = this.msg.guild.iconURL({format:"png", size: 2048});
        } else {
            this.embedOptions.image.url = this.msg.guild.iconURL();
        }
    
        Utils.sendEmbed(this.msg, this.embedOptions, false);
    }
    
}


module.exports = {
    aliases: ['serverinfo', 'sein'],
    description: 'Devuelve información del servidor',
    category: ':desktop: Comandos Útiles',
    args : false,
    execute(msg, client, args) {
        let instance = new ServerInfo(msg)
        instance.sendServerInfo();
    },
};;