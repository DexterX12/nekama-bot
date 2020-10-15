const Utils = require('../utils/utils.js');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const yt = require('scrape-youtube');
const youtube = new yt.Youtube();
const { JSDOM } = jsdom;


class YoutubeSearch {
	constructor (msg, client, messageContent) {
		this.msg = msg;
		this.client = client;
		this.messageContent = messageContent;
		this.embedObject = {
            title: null,
            description: "",
            author: {
                name: "Resultados de youtube:",
                icon_url: "https://www.vippng.com/png/detail/44-448302_magnifying-glass-circle.png"
            },
            image: { url: "" },
            footer: {text:""},
            color: "#114CEB",
            fields: [],
            thumbnail: {
                url: ""
            }  
        };
	}

	async searchYoutube () {
		try {
			let query = this.messageContent;
			let response = await youtube.searchOne(this.messageContent);
			if (response) {

				let finalText = "";
				finalText += `- **Canal:** ${response.channel.name}\n- **Nombre del vídeo:** ${response.title}\n- **Visitas:** ${response.views}\n- **Subido:** ${response.uploaded}\n${response.link}`;
				this.msg.channel.send(finalText);
			}
		} catch (e) {
			this.msg.channel.send('Ocurrió un error inesperado en la búsqueda, ¡intenta de nuevo!')
		}
	}
}

module.exports = {
    aliases: ['youtube', 'yt'],
    description: 'Busca videos de YouTube en Discord usando este sencillo comando. \n\n_¡Te recomiendo buscar, "EVE Online", te va a gustar!_',
    category: ':mag: Comandos de búsqueda',
    args : '<Elemento a buscar>**',
    execute(msg, client, args) {
        let instance = new YoutubeSearch(msg, client, args)
        instance.searchYoutube();
    },
};