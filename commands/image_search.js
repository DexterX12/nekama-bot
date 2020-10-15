const Utils = require('../utils/utils.js');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Scraper = require('images-scraper');

class ImageSearch {
	constructor (msg, client, messageContent) {
		this.msg = msg;
		this.client = client;
		this.messageContent = messageContent;
        this.currentMsg;
        this.dogpile = "http://results.dogpile.com/serp?qc=images&q=";
        this.imagesRequested = [];
		this.embedObject = {
            title: null,
            description: "",
            author: {
                name: "Resultados de la búsqueda:",
                icon_url: "https://images.theconversation.com/files/93616/original/image-20150902-6700-t2axrz.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1000&fit=clip"
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

	async searchImage (option=false) {

		let query = this.messageContent;

		if (!query) {
			Utils.sendErrorMessage('¡Hey! Especifica que quieres buscar.');
			return;
		}

		if (!option) {
			const google = new Scraper({
				userAgent: 'Mozilla/5.0 (X11; Linux i686; rv:64.0) Gecko/20100101 Firefox/64.0',
		  		puppeteer: {
		    		headless: true,
		    		args: ['--no-sandbox', '--disable-setuid-sandbox']
		  		}
			});
			
			let results = await google.scrape(query, 50);

			for (let result of results) {
				this.imagesRequested.push(result.url);
			}		
		} else {
			let response = await fetch(this.dogpile + query);
			response = await response.text();
			let dom = new JSDOM(response);
			let imagesList = dom.window.document.querySelectorAll('a');

			for (let image of imagesList) {
				if (image.href.endsWith('.jpg')) {
					this.imagesRequested.push(image.href);
				}
			}
		}
 
		this.sendImage(this.imagesRequested[0], 0);
	}

	async changePage (pageNumber) {
		try {		
			let currentPage = parseInt(pageNumber) + 1
			this.embedObject.image.url = this.imagesRequested[pageNumber];
			this.embedObject.footer.text = `Resultado ${currentPage} de ${this.imagesRequested.length}`
			this.currentMsg.edit({embed: this.embedObject})
			this.waitForUserInput(pageNumber);
		} catch (e) {
			console.log('Oops, algo ha sucedido: ' + e.message);
		}
	}

	async sendImage (imageURL, pageNumber) {
		try {
			let currentPage = parseInt(pageNumber) + 1
			this.embedObject.image.url = imageURL;
			this.embedObject.footer.text = `Resultado ${currentPage} de ${this.imagesRequested.length}`;
			this.currentMsg = await Utils.sendEmbed(this.msg, this.embedObject, false, false);
			this.waitForUserInput(pageNumber);
		} catch (e) {
			console.log('Oops, algo ha sucedido: ' + e.message);
		}
	}

	async waitForUserInput (pageNumber) {
		try {
			let filter = m => (m.author.id === this.msg.author.id) && (m.content === "n" || m.content === "b" || m.content.startsWith("go to"));
			let response = await this.msg.channel.awaitMessages(filter, {max: 1, time: 60000, errors:["time"]})
			let userText;
			response.forEach(e => {
				userText = e.content;

				if (userText === 'n' && pageNumber < this.imagesRequested.length) {
					this.changePage(pageNumber + 1);

				} else if (userText === 'b' && pageNumber > 0) {
					this.changePage(pageNumber - 1);

				} else if (userText.startsWith('go to')) {

					// expecting a number
					let args = parseInt(userText.split(' ')[2]) - 1;

					if (!Number.isNaN(args)) {
						if (args >= 0 && args <= this.imagesRequested.length - 1) {
							this.changePage(args);
						} else {
							this.msg.channel.send('Límite excedido!');
							this.waitForUserInput(pageNumber);
						}
					}

				} else {
					this.waitForUserInput(pageNumber);
					return;
				}
				e.delete();
			})
		} catch (e) {
			console.log('Oops, algo ha sucedido: ' + e.message);
		}
	}

}

module.exports = {
    aliases: ['image', 'image2', 'img', 'img2'],
    description: 'Busca imágenes de la web con este sencillo comando. \n\n_¡Busca imágenes kawaii y moe!_',
    category: ':mag: Comandos de búsqueda',
    args : '<Elemento a buscar>**',
    execute(msg, client, args, command="") {
        let instance = new ImageSearch(msg, client, args);
        if (command === "img2" || command === "image2") {
        	instance.searchImage(true);
        	return;
        }
        instance.searchImage();
    },
};