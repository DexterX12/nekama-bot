const dbru = require('danbooru');
const fetch = require('node-fetch');
const utils = require('../utils/utils.js');
const booru = new dbru();

class DanbooruTag {
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

	async searchTag (nsfw=false) {

		if (!this.msg.channel.nsfw) {
			this.msg.channel.send('Estás intentando usar una función NSFW fuera de un canal apropiado para el mismo.');
			return;
		} else {

			if (!this.messageContent){
				this.msg.channel.send('Oye, requieres buscar un tag, pon algo!');
				return;
			}

			this.posts = await booru.posts({limit: 200, tags: `${this.messageContent.split(' ')[0]}`});
		}


		// if has or not an index specified, only the tag needs to be searched (split)
		let tagsOptions = this.messageContent.split(' '),
			tagIndex = tagsOptions[1] - 1; // arrays starts in 0, so if input is 1, goes to 0, etc.

		if (tagsOptions.length > 1) {
			this.post = this.posts[tagIndex];
		} else {
			this.post = this.posts[0];
		}
		if (Number.isNaN(tagIndex))
			tagIndex = 0;

		this.embedOptions.author.name += `\nÍndice: ${tagIndex + 1} de ${this.posts.length}`;
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
    aliases: ['danboorutag', 'dbt'],
    description: 'Retorna un post de danbooru a partir de un tag.',
    category: ':underage: NSFW',
    args : '[Tag]*',
    execute(msg, client, args, command="") {
        let instance = new DanbooruTag(msg, client, args)
        instance.searchTag();
    },
};;