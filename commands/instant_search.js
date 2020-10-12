const Utils = require('../utils/utils.js');
const fetch = require('node-fetch');

class InstantSearch {
	constructor (msg, client, messageContent) {
		this.msg = msg;
		this.client = client;
		this.messageContent = messageContent;
        this.query = messageContent;
		this.requestURL = `https://api.duckduckgo.com/?q=${this.query}&format=json&pretty=1&kl=es-es&no_html=1`;
        this.currentMsg;
        this.imagesRequested = [];
		this.embedObject = {
            title: null,
            description: "",
            author: {
                name: "Resultados de la búsqueda:",
                icon_url: "https://duckduckgo.com/assets/logo_social-media.png"
            },
            image: { url: "" },
            footer: {text:"Búsqueda efectuada con DuckDuckGo Instant Answer API"},
            color: "#114CEB",
            fields: [],
            thumbnail: {
                url: ""
            }  
        };
	}

    async getSearch () {
        let response = await fetch(this.requestURL);
        response = await response.json();
        let searchText = response.AbstractText;

        if (!this.messageContent) {
            Utils.sendErrorMessage('Debes introducir alguna palabra para buscar');
            return;
        }

        if (!searchText) {
            Utils.sendErrorMessage('Al parecer no encontré nada. Intenta usar palabras claves reconocibles.');
            return;
        }

        this.embedObject.description = searchText;
        this.embedObject.thumbnail.url = response.Image;
        Utils.sendEmbed(this.msg, this.embedObject, false);
    }
}

module.exports = {
    aliases: ['search'],
    description: 'Busca información en la web',
    category: ':desktop: Comandos Útiles',
    args : '[Elemento a buscar]¨*',
    execute(msg, client, args, command="") {
        let instance = new InstantSearch(msg, client, args);
        instance.getSearch();
    },
};;
