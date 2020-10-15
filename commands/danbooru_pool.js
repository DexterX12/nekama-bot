const dbru = require('danbooru');
const fetch = require('node-fetch');
const utils = require('../utils/utils.js');
const booru = new dbru();

class DanbooruPool {
	constructor (msg, client, messageContent) {
		this.msg = msg;
		this.client = client;
		this.messageContent = messageContent;
		this.msgEdit;
		this.safeSearchConfig = "rating:safe order:rank";
		this.posts;
		this.post;
		this.url;
		this.poolOption = "";
		this.poolQuery = "";
		this.poolsFetch = `https://danbooru.donmai.us/pools.json?search`;
		this.poolsLength;
		this.postsLength;
		this.poolIndex = 0;
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

	async searchPool (page=0) {
		try {

			if (!this.msg.channel.nsfw) {
				this.msg.channel.send('Estás intentando usar una función NSFW fuera de un canal apropiado para el mismo.');
				return;
			}

			if (!this.messageContent) {
				this.msg.channel.send('Especifica que quieres buscar! ID o Tag')
				return;
			}

			// resets search to avoid string stacking
			this.poolsFetch = `https://danbooru.donmai.us/pools.json?search`; 

			// resets title to avoid string stacking
			this.embedOptions.author.name = "Resultados de Danbooru";

			let poolOptions = this.messageContent.split(' ');

			if (poolOptions.length > 1) {
				this.poolsFetch += `[name_matches]=${poolOptions[0]}`;
				
			// is a tag and not an id
			} else if (Number.isNaN(parseInt(poolOptions[0]))){
				this.poolsFetch += `[name_matches]=${poolOptions[0]}`
			} else {
				this.poolsFetch += `[id]=${poolOptions[0]}`
			}
			let _request = await fetch(this.poolsFetch);
			let _post = await _request.json();

			if (!this.msgEdit) {
				if (_post.length < 1) {
					this.msg.channel.send('No he encontrado ningún resultado al respecto...');
					return;
				}

				let _fetched = 'Se han encontrado los siguientes Pools, introduce el número correspondiente:\n```';
				let _filter = m => !m.author.bot && m.author.id === this.msg.author.id;
				let index = 1

				for (let post in _post) {
					if (post < _post.length - 1) {
						_fetched += `\n${index}.- ${_post[post].name}`;
					} else {
						_fetched += "\n"+index + " " + _post[post].name + "\n```";
					}
					index++;
				}

				this.msg.channel.send(_fetched);
				let response = await this.msg.channel.awaitMessages(_filter, {max: 1, time:15000, errors:["time"]})
				
				response.forEach(e => {
					if (!Number.isNaN(parseInt(e.content))) {
						this.poolIndex = parseInt(e.content);
					}
				})
			}


			this.poolsLength = _post.length;
			this.postsLength = _post[this.poolIndex - 1].post_ids.length;

			//every pool has an array of posts, starting by the first one
			_post = _post[this.poolIndex - 1].post_ids[page];

			//fetchs current post of the current pool
			_post = await booru.posts(_post);

			this.post = _post;
			this.embedOptions.author.name += `\nEstás en la Pool ${this.poolIndex} de ${this.poolsLength}\nPost ${page + 1} de ${this.postsLength}`
			
			if (!this.msgEdit) {
				this.sendBooru();
			} else {
				this.url = booru.url(this.post.large_file_url);
				this.embedOptions.image.url = this.url;
				this.embedOptions.footer.text = `Danbooru post: ${this.post.id}`;
				this.embedOptions.description = `[Haz click aquí para ir al post original](https://danbooru.donmai.us/posts/${this.post.id})`
				this.msgEdit.edit({embed: this.embedOptions});
			}
			this.waitForUserInputPool(page);

		} catch (e){
			this.msg.channel.send('¡Lo siento mucho! Al parecer la búsqueda ha fallado. Inténtalo de nuevo. \nError:' + e);
		}

	}

	async waitForUserInputPool (page) {
		let query = m => (m.author.id === this.msg.author.id) && (m.content === "n" || m.content === "b" || m.content.startsWith("go to"));
		this.msg.channel.awaitMessages(query, {max: 1, time: 20000, errors:["time"]})
		.then(response => {
			response.forEach(e => {

				if (e.content === "n" && page < this.postsLength - 1) {
					this.searchPool(page + 1)

				} else if (e.content === "b" && page > 0) {
					this.searchPool(page - 1)

				} else if (e.content.startsWith("go to")){
					let _gotoNumber = e.content.split(' ')[2];

					if (!Number.isNaN(parseInt(_gotoNumber))) {
						if (parseInt(_gotoNumber) <= this.postsLength) {
							this.searchPool(_gotoNumber - 1);
						} else {
							this.msg.channel.send('Índice de post excedido.');
							this.searchPool(page);
						}

					} else {
						this.msg.channel.send('No se especificó un número');
						this.searchPool(page);
					}

				} else {
					this.searchPool(page);
					return;
				}
				e.delete();
			})
		})
		.catch(e=> {return});
		
	}

	async sendBooru () {
		try {
			this.url = booru.url(this.post.large_file_url);
			this.embedOptions.image.url = this.url;
			this.embedOptions.footer.text = `Danbooru post: ${this.post.id}`;
			this.embedOptions.description = `[Haz click aquí para ir al post original](https://danbooru.donmai.us/posts/${this.post.id})`
			this.msgEdit = await utils.sendEmbed(this.msg, this.embedOptions, false, false);
			console.log(this.msgEdit);
		} catch {
			this.msg.channel.send('¡Lo siento mucho! Al parecer la búsqueda ha fallado. Inténtalo de nuevo.');
		}
	}

}

module.exports = {
    aliases: ['danboorupool', 'dbp'],
    description: 'Retorna un pool de Danbooru a partir de un tag.',
    category: ':underage: NSFW',
    args : '<Tag>**',
    execute(msg, client, args, command="") {
        let instance = new DanbooruPool(msg, client, args);
        instance.searchPool();
    },
};