const Utils = require('../utils/utils.js');
const Jikan = require('jikan-node');
const mal = new Jikan();
const translate = require('translation-google');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

class MyAnimeList {
	constructor (interaction) {
        this.interaction = interaction;
        this.query = interaction.options.getString('query');
        this.fixedMessage = null;
        this.msgID = "";
		this.embedOptions = {
            title: null,
            description: "",
            author: {
                name: "Resultados de My Anime List (MAL)",
                icon_url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
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

    async search (type) {

        this.fixedMessage = await this.interaction.editReply('¡Bien! Hora de buscar... 🔍');
        this.msgID = this.fixedMessage.id;
        
        try { 
            let response;

            if (type === 'anime')
                response = await mal.search('anime', this.query);
            else
                response = await mal.search('manga', this.query);
            
            const results = response.results;
            
            this.setResults(results, type);
            

        } catch (error) {
            Utils.sendErrorMessage(this.interaction, 'Obra no encontrada, intenta con otro nombre.', true);
            console.error('Ocurrió el siguiente error:' + error);
        }

    }

    async setResults (results, type) {

        let options = [];

        for (let [index, result] of results.entries()) {

            if (index < 10) {
                options.push({
                    label: result.title,
                    value: index.toString()
                });
            } else {
                break;
            }
        }

        const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId('mal_results')
            .setPlaceholder('Selecciona el resultado deseado')
            .addOptions(options)
        );
            
        await this.fixedMessage.edit({embeds: [this.embedOptions], components: [row]});

        await this.getUserInput(results, type);
    }

    async getUserInput (results, type) {
        try {

            const timer = setTimeout( async () => {
				try {
					await this.fixedMessage.edit({components:[]});
				} catch (error) {
					console.log(error.message);
				}
			}, 30000);

			let filter = m => m.user.id === this.interaction.user.id && (this.msgID === m.message.id);

			let response = await this.fixedMessage.channel.awaitMessageComponent({filter, max: 1, time: 30000, errors:["time"], componentType: "SELECT_MENU"})
            
            await response.deferUpdate();

            clearTimeout(timer);
            
            let option = response.values[0];
            
            if (type === 'anime') {
                const anime = await mal.findAnime(results[option].mal_id);
                await this.setAnimeInfo(anime);
                
            } else {
                const manga = await mal.findManga(results[option].mal_id);
                await this.setMangaInfo(manga);
            }

            await this.fixedMessage.edit({embeds: [this.embedOptions], components:[]})
			
			
		} catch (error) {
			console.log(error.message);
		}
    }

    /**
     * @param {Object} anime  Contains all anime information
     */

    async setAnimeInfo (anime) {
        try {
            this.embedOptions.thumbnail.url = anime.image_url;
            this.embedOptions.description = `[Haz click aquí para ir a MyAnimeList](${anime.url})`;
    
            this.embedOptions.fields.push({
                name: '**Nombre:**',
                value: anime.title,
                inline: true
            },
            {
                name: '**Nombres alternativos:**',
                value: `${anime.title_synonyms}\n${anime.title_japanese}`,
                inline: true
            },
            {
                name: '**Tipo:**',
                value: anime.type,
                inline: true
            },
            {
                name: '**Fecha:**',
                value: anime.aired.string.replace('to', 'hasta'),
                inline: true
            },
            {
                name: '**Estado:**',
                value: await this.getAnimeStatus(anime),
                inline: true
            },
            {
                name: '**Capitulos:**',
                value: (!anime.episodes) ? 'Por definir' : anime.episodes.toString(),
                inline: true
            },
            {
                name: '**Fuente:**',
                value: (anime.source === "Other") ? 'Otro' : anime.source,
                inline: true
            },
            {
                name: '**Temporada:**',
                value: await this.getAnimeSeason(anime),
                inline: true
            },
            {
                name: '**Duración:**',
                value: await this.getAnimeDuration(anime),
                inline: true
            },
            {
                name: '**Puntuación:**',
                value: (!anime.score) ? "Por definir" : anime.score.toString(),
                inline: true
            },
            {
                name: '**Productor(es):**',
                value: await this.getAnimeProducers(anime),
                inline: true
            },
            {
                name: '**Género(s):**',
                value: await this.getAnimeGenres(anime),
            },
            );
    
            this.embedOptions.footer.text = await this.getAnimeSynopsis(anime); 
        } catch (error) {
            console.error(error);
        }

    }

    /**
     * @param {Object} anime  Contains all anime information
     * @returns {String}
     */

    async getAnimeGenres (anime) {

        if (anime.genres.length < 1)
            return 'No definido';

        let genres = '';

        for (let [index, genre] of anime.genres.entries()) {
            if (index < anime.genres.length - 1) {
                genres += `${genre.name}, `;
            } else {
                genres += `${genre.name}`;
            }
        }

        return genres;
    }

    /**
     * @param {Object} anime Contains all anime information
     * @returns {String}
     */

    async getAnimeStatus (anime) {

        if (!anime.status)
            return 'No definido';

        const status = anime.status

        switch (true) {
            case status.includes('Currently'):
                return 'En emisión';

            case status.includes('Finished'):
                return 'Finalizado';

            case status.includes('Publishing'):
                return 'Por publicar';

            default:
                return 'No definido';
        }
    }

    /**
     * @param {Object} anime  Contains all anime information
     * @returns {String}
     */

    async getAnimeSynopsis (anime) {

        if (!anime.synopsis)
            return 'No definido';

        let synopsis = anime.synopsis;

        try {
            const result = await translate(synopsis, {to: 'es'});
            return result.text;
        } catch {
            return synopsis;
        }
    }

    /**
     * @param {Object} anime  Contains all anime information
     */

    async getAnimeDuration (anime) {

        if (!anime.duration)
            return 'No definido';

        
        if (anime.duration === "Unknown") {
            return 'Por definir';
        } else {
            if (anime.type === 'Movie') {
                return anime.duration;
                
            } else if (anime.duration.includes('per ep')) {
                return anime.duration.replace('per ep', 'por episodio');
                
            } else {
                return `${anime.duration} por episodio`;
            }
        }
    }

    /**
     * @param {Object} anime Contains all anime information
     * @returns {String}
     */    

    async getAnimeSeason (anime) {

        if (!anime.premiered) {
            return 'No definido';
        }

        const season = anime.premiered;

        switch(true) {
            case season.includes('Fall'):
                return season.replace('Fall', 'Otoño');

            case season.includes('Winter'):
                return season.replace('Winter', 'Invierno');

            case season.includes('Spring'):
                return season.replace('Spring', 'Primavera');

            case season.includes('Summer'):
                return season.replace('Summer', 'Verano');
            
            default:
                return 'No definido';
        }
    }

    /**
     * @param {Object} anime Contains all anime information
     * @returns {String}
     */  

    async getAnimeProducers (anime) {

        if (anime.producers.length < 1)
            return 'No definido';

        let producers = '';

        for (let [index, producer] of anime.producers.entries()) {
            if (index < anime.producers.length - 1) {
                producers += `${producer.name}, `;
            } else {
                producers += `${producer.name}`;
            }
        }

        return producers;
    }

    /**
     * @param {Object} manga Contains all manga information
     */    
    
    async setMangaInfo (manga) {
        try {
            this.embedOptions.thumbnail.url = manga.image_url;
    
            this.embedOptions.fields.push({
                name: '**Nombre:**',
                value: manga.title,
                inline: true
            },
            {
                name: '**Nombres alternativos:**',
                value: `${manga.title_synonyms}\n${manga.title_japanese}`,
                inline: true
            },
            {
                name: '**Tipo:**',
                value: manga.type,
                inline: true
            },
            {
                name: '**Volúmenes:**',
                value: (!manga.volumes) ? 'Por definir' : manga.volumes.toString(),
                inline: true
            },
            {
                name: '**Capítulos:**',
                value: (!manga.chapters) ? 'Por definir' : manga.chapters.toString(),
                inline: true
            },
            {
                name: '**Estado:**',
                value: (!manga.publishing) ? 'Finalizado' : 'Publicándose',
                inline: true
            },
            {
                name: '**Fecha:**',
                value: manga.published.string.replace('to', 'hasta'),
                inline: true
            },
            {
                name: '**Autor(es):**',
                value: await this.getMangaAuthors(manga),
                inline: true
            },
            {
                name: '**Publicador:**',
                value: await this.getMangaSerialization(manga),
                inline: true
            },
            {
                name: '**Puntuación:**',
                value: (!manga.score) ? 'No definido.' : manga.score.toString(),
                inline: true
            },
            {
                name: '**Género(s):**',
                value: await this.getMangaGenres(manga),
            },
            );
    
            this.embedOptions.footer.text = await this.getMangaSynopsis(manga); 
    
        } catch (error) {
            console.error(error);
        }

    }

    /**
     * @param {Object} manga Contains all manga information
     * @returns {String}
     */    

    async getMangaAuthors (manga) {

        if (!manga.authors) {
            return 'No definido';
        }

        let authors = '';

        for (let [index, author] of manga.authors.entries()) {
            if (index < manga.authors.length - 1) {
                authors += `${author.name}, `;
            } else {
                authors += author.name
            }
        }

        return authors;
    }

    /**
     * @param {Object} manga Contains all manga information
     * @returns {String}
     */  

    async getMangaSerialization (manga) {

        if (manga.serializations.length < 1) {
            return 'No definido';
        }

        let serializations = '';

        for (let [index, serializator] of manga.serializations.entries()) {
            if (index < manga.serializations.length - 1) {
                serializations += `${serializator.name}, `;
            } else {
                serializations += serializator.name;
            }
        }

        return serializations;
    }

    /**
     * @param {Object} manga Contains all manga information
     * @returns {String}
     */      

    async getMangaGenres (manga) {

        if (!manga.genres) {
            return 'No definido';
        }

        let genres = '';

        for (let [index, genre] of manga.genres.entries()) {
            if (index < manga.genres.length - 1) {
                genres += `${genre.name}, `;
            } else {
                genres += genre.name;
            }
        }

        return genres;
    }

    /**
     * @param {Object} manga Contains all manga information
     * @returns {String}
     */  

    async getMangaSynopsis (manga) {

        if (!manga.synopsis) {
            return 'No definido';
        }

        let synopsis = manga.synopsis;

        try {
            const result = await translate(synopsis, {to: 'es'});
            return result.text;
        } catch {
            return synopsis;
        }
    }

}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('myanimelist')
    .setDescription('Busca la información de un Anime o Manga en My Anime List (MAL).')
	.addStringOption(option =>
	    option
        .setName('query')
		.setDescription('El ánime o manga a buscar')
		.setRequired(true))
	.addBooleanOption(option =>
	    option
        .setName('manga')
		.setDescription('¿Será una búsqueda manga?')
		.setRequired(false)),
    aliases: ['myanimelist'],
    description: 'Busca la información de un Anime o Manga en My Anime List (MAL).',
    category: '🔍 Comandos de Búsqueda',
    args : '<Elemento a buscar> [manga]',
    async execute(interaction) {

        await interaction.deferReply();

        let instance = new MyAnimeList(interaction);

        let isManga = interaction.options.getBoolean('manga');

        setTimeout(() => {
            if (isManga) {
                instance.search('manga');
                return;
            }
    
            instance.search('anime');
        }, 3000)

    },
};