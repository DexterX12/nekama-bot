const dbru = require('danbooru');
const fetch = require('node-fetch');
const utils = require('../utils/utils.js');
const booru = new dbru();

class DanbooruSearch {
	constructor (msg, client, messageContent) {
		this.msg = msg;
		this.client = client;
		this.messageContent = messageContent;
		this.msgEdit;
		this.safeSearchConfig = "rating:safe order:rank";
		this.posts;
		this.post;
		this.url;
		this.embedOptions = {
            title: null,
            description: "",
            author: {
                name: "Resultados de Danbooru",
                icon_url: "https://vignette.wikia.nocookie.net/discord/images/8/8c/Danbooru_Discord_Icon.png"
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

	async search () {
		let index = this.messageContent;

		if (!this.msg.channel.nsfw) {
			this.msg.channel.send('Estás intentando usar una función NSFW fuera de un canal apropiado para el mismo.');
			return;
		} else {
			this.posts = await booru.posts({limit: 100, tags:"order:rank"});
		}

		if (parseInt(index) === "NaN" || !index || parseInt(index > this.posts.length)) {
			this.post = this.posts[0];
		} else {
			this.post = this.posts[index];
		}
		if(Number.isNaN(parseInt(index)))
			index = 0;
		this.embedOptions.author.name += `\nÍndice: ${index} de ${this.posts.length}`;
		
		this.sendBooru();
		
	}

	async sendBooru () {
		try {
			this.url = booru.url(this.post.large_file_url);
			this.embedOptions.image.url = this.url;
			this.embedOptions.footer.text = `Danbooru post: ${this.post.id}`;
			this.embedOptions.description = `[Haz click aquí para ir al post original](https://danbooru.donmai.us/posts/${this.post.id})`
			this.msgEdit = await utils.sendEmbed(this.msg, this.embedOptions, false, false)
		} catch {
			this.msg.channel.send('¡Lo siento mucho! Al parecer la búsqueda ha fallado. Inténtalo de nuevo.');
		}
	}

}

module.exports = {
    aliases: ['danboorurank', 'dbr'],
    description: 'Retorna un post de Danbooru.',
    category: ':underage: NSFW',
    args : '[Índice]**',
    execute(msg, client, args, command="") {
        let instance = new DanbooruSearch(msg, client, args);
        instance.createEmbed();
    },
};;