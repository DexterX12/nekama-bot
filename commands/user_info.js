const Utils = require('../utils/utils.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class UserInfo {
    constructor (interaction) {
        this.client = interaction.client;
        this.mention = interaction.options.getUser('user');
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

    async getUserInfo () {
        if (this.mention && (this.mention.id != this.interaction.user.id)) {
            await this.fillEmbed(true);
            this.embedOptions.footer.text = `Información solicitada por: ${this.interaction.user.username}`;
        } else {
            await this.fillEmbed(false);
        }
    }
    
    async fillEmbed (hasMention) {
        this.getGeneral(hasMention);
        this.getUserID(hasMention);
        await this.getUserNickname(hasMention);
        this.getUserType(hasMention);
        await this.getEnterDate(hasMention);
        await this.getDiscordJoinDate(hasMention);
        await this.getUserRoles(hasMention);
        Utils.sendEmbed(this.interaction, this.embedOptions, false);
    }
    
    getUserID (wasUserMentioned) {
        let userToUse = null;
    
        if (wasUserMentioned)
            userToUse = this.mention;
        else
            userToUse = this.interaction.user;
        
        this.embedOptions.fields.push({
            name: "ID",
            value: `:id: ${userToUse.id}`,
            inline: true
        });
    }
    
    async getUserNickname (wasUserMentioned) {
        let userToUse = null;

        if (wasUserMentioned)
            userToUse = this.mention;
        else
            userToUse = this.interaction.user;
    
        this.interaction.guild.members.fetch(userToUse.id)
        .then((data) => {
            let dataToReturn = null;
            if (userToUse.bot || !data.nickname) 
                dataToReturn = userToUse.username;
            else
                dataToReturn = data.nickname;
            
            this.embedOptions.fields.push({
                name: "Apodo",
                value: `:name_badge: ${dataToReturn}`,
                inline: true
            })
        })
        .catch((e) => console.log)
    }

    getUserType (wasUserMentioned) {
        let userToUse = null;
        let options = {"false": ":bust_in_silhouette: No, es humano", "true": ":robot: Sí, con sentimientos"};
        
        if (wasUserMentioned)
            userToUse = this.mention;
        else
            userToUse = this.interaction.user;

        this.embedOptions.fields.push({
            name: "Bot",
            value: options[userToUse.bot],
            inline: true
        }) 
    }

    async getEnterDate (wasUserMentioned) {
        let userToUse = null;
        
        if (wasUserMentioned)
            userToUse = this.mention;
        else
            userToUse = this.interaction.user;
        
        this.interaction.guild.members.fetch(userToUse.id)
        .then(data => {
            this.embedOptions.fields.push({
                name: "Entró al servidor el",
                value: `:date: :inbox_tray: ${new Date(data.joinedTimestamp).toDateString()}`,
            })
        })
        .catch( () => "");
    }

    async getDiscordJoinDate (wasUserMentioned) {
        let userToUse = null;
        
        if (wasUserMentioned)
            userToUse = this.mention;
        else
            userToUse = this.interaction.user;
        
        this.embedOptions.fields.push({
            name: "Se unió a Discord el",
            value: `:date: :globe_with_meridians:  ${new Date(userToUse.createdTimestamp).toDateString()}`,
        })
    }

    async getUserRoles (wasUserMentioned) {
        let userToUse = null;
        let userRoles = [];
        let randomUserRoles = [];
        let finalText = "";
        if (wasUserMentioned)
            userToUse = this.mention;
        else
            userToUse = this.interaction.user;
        
        this.interaction.guild.members.fetch(userToUse.id)
        .then(data => {

            userRoles = data._roles;
            if (userRoles.length > 5) {
                while (randomUserRoles.length < 5) {
                    let roleToPush = Utils.getRanValueArray(userRoles);
                    if (!randomUserRoles.includes(roleToPush))
                        randomUserRoles.push(roleToPush);
                }
                
            } else {
                randomUserRoles = userRoles;
            }

            finalText += `:scroll: En total: **${userRoles.length}**\n(`
            randomUserRoles.forEach((role, index) => {
                if(index < randomUserRoles.length - 1) {
                    finalText += `<@&${role}>, `;
                    return;
                } else {
                    finalText += `<@&${role}>...)`
                }
            })
            this.embedOptions.fields.push({
                name: "Roles",
                value: finalText,
            })
        })
        .catch(error => console.log(error));

    }

    getGeneral (wasUserMentioned) {
        let userToUse = null;
        
        if (wasUserMentioned)
            userToUse = this.mention;
        else
            userToUse = this.interaction.user;

        this.embedOptions.author.name = `Información de ${userToUse.username}#${userToUse.discriminator}`
        this.embedOptions.author.icon_url = userToUse.displayAvatarURL();
        this.embedOptions.thumbnail.url = userToUse.displayAvatarURL({size: 1024});
    }
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Muestro información detallada de un usuario.')
	.addUserOption(option =>
	    option
        .setName('user')
		.setDescription('El usuario el cual se mostrará información')
		.setRequired(false)),
    aliases: ['userinfo'],
    description: 'Muestro información detallada de un usuario. \n\n_No, no puedo decir en donde vive el usuario y su número de WhatsApp._',
    category: '🖥️ Comandos Útiles',
    args : '<Mención de usuario/ID>',
    async execute(interaction) {
        let instance = new UserInfo(interaction)
        instance.getUserInfo();
    },
};
