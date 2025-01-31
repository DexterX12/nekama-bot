const Utils = require('../utils/utils.js');
const Pokedex = require('pokedex-promise-v2');
const PokedexObj = new Pokedex();
const PokemonCollection = require('../collections/pokemonCollection.json');
const { SlashCommandBuilder } = require('@discordjs/builders');


class Pokemon {
    constructor (interaction) {
        this.interaction = interaction;
        this.pokemonNameID = interaction.options.getString('pokemon_id');
        this.randomPokeID = Math.floor(Math.random() * 800);
        this.pokemonGif = "http://play.pokemonshowdown.com/sprites/xyani/";
        this.embedObject = {
            title: "¡Información para el Pokémon!",
            description: "Descripción de la PokéDex:",
            thumbnail: {
                url: ""
            },
            image: {
                url:""
            },
            footer: {
                text:"Información obtenida de la API de PokeAPI",
                icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pokebola-pokeball-png-0.png/601px-Pokebola-pokeball-png-0.png"
            },
            color: "#ff00ff",
            fields: []
        };
    }

    async fetchPokemon () {
        let id = this.formatPokemonName();
        let responses = [];
        // Retrieves pokemon and poke-species JSON
        PokedexObj.resource([`/api/v2/pokemon/${id}`, `/api/v2/pokemon-species/${id}`])
        .then(response => {
            responses.push(response);
        })
        .then(() => {
            // Retrieves evolution_chain url property from poke-species object
            PokedexObj.resource(responses[0][1].evolution_chain.url)
            .then(response => {
                responses.push(response);
                this.sendPokemonInfo(responses);
            })
            .catch((e) => {
                Utils.sendErrorMessage('Ha ocurrido un error inesperado, el mensaje fue enviado al desarrollador.');
                //console.log(e)
            });
        })
        .catch((e) => {
            Utils.sendErrorMessage(this.interaction, '¡Oops!, ¿Es ese el nombre o ID del pokémon correcto? :warning:');
            //console.log(e);
        });
    }

    async sendPokemonInfo (responses) {
        const pokeJSON = responses[0];
        const evolutions = responses[1];
        this.embedObject.fields = [
            {
                name: "Nombre del Pokémon:",
                value: Utils.capitalize(pokeJSON[0].name),
                inline: true
            },
            {
                name: "N# Pokédex:",
                value: pokeJSON[0].id.toString(),
                inline: true
            }
            
        ]

        this.searchForPokeTypes(pokeJSON[0].types);
        this.searchForPokeEV(pokeJSON[0].stats);
        this.searchForEggGroups(pokeJSON[1].egg_groups);
        this.embedObject.fields.push({
            name: '\u200b',
            value: '\u200b',
            inline: false,
        });
        this.searchForPokeStats(pokeJSON[0].stats);
        this.embedObject.fields.push({
            name: '\u200b',
            value: '\u200b',
            inline: true
        });
        this.evolutiveLine(pokeJSON[1], evolutions);
        this.searchForPokeDescription(pokeJSON[1]);
        this.embedObject.fields.push({
            name: '\u200b',
            value: '\u200b',
            inline: true
        });
        if(pokeJSON[0].name.indexOf('-') > -1) {
            let newName = pokeJSON[0].name.replace('-', '');
            this.embedObject.thumbnail.url = this.pokemonGif + newName + ".gif";
        } else {
            this.embedObject.thumbnail.url = this.pokemonGif + pokeJSON[0].name + ".gif";
        }

        await Utils.sendEmbed(this.interaction, this.embedObject, false);
    }

    searchForPokeDescription (array) {
        let found = false;
        array.flavor_text_entries.forEach(element => {
            if (element.language.name == 'es' && !found) {
                this.embedObject.fields.push({
                    name: "Descripción",
                    value: element.flavor_text,
                    inline: false
                });
                found = true;
            }
        })
    }

    searchForPokeEV (array) {
        let finalText = "";
        let foundEV = [];
        array.forEach(element => {
            if (element.effort > 0) {
                let statName = PokemonCollection.stats[element.stat.name];
                foundEV.push(`${statName} **+${element.effort}**`);
            }
        })
        if (foundEV.length > 1) {
            foundEV.forEach( (element, index) => {
                if (index < foundEV.length - 1) {
                   finalText += (element + "\n");
                   return;
                }
                finalText += element;
            })
        } else {
            finalText = foundEV[0];
        }
        this.embedObject.fields.push({
            name: "EV's que brinda:",
            value: finalText,
            inline: true
        })
    }

    searchForEggGroups (eggGroupsArray) {
        let finalText = "";
        if (eggGroupsArray.length > 1) {
            eggGroupsArray.forEach((eggGroup, index) => {
                let currentEggGroup = PokemonCollection.eggGroups[eggGroup.name]
                if (index < eggGroupsArray.length - 1) {
                    finalText += `${currentEggGroup} /`;
                    return;
                }
                finalText += currentEggGroup;
            })
        } else {
            finalText = PokemonCollection.eggGroups[eggGroupsArray[0].name];
        }

        this.embedObject.fields.push({
            name:"Grupo(s) de huevo:",
            value: finalText,
            inline: true
        });
    }

    searchForPokeStats (statsArray) {
        let finalText = "";
        statsArray.forEach((stat, index) => {
            let statName = PokemonCollection.stats[stat.stat.name];
            let statValue = stat.base_stat;
            if(index < statsArray.length - 1){
                finalText += `${statName}: ${statValue} \n`
                return;
            }
            finalText += `${statName}: ${statValue}`;
        });

        this.embedObject.fields.push({
            name: "Estadísticas base del Pokémon:",
            value: finalText,
            inline: true
        })
    }

    searchForPokeTypes (array) {
        let finalText = "";
        let foundTypes  = [];

        array.forEach(element => {
            foundTypes.push(PokemonCollection.types[element.type.name]);
        });

        if (foundTypes.length > 1) {
            foundTypes.forEach( (element, index) => {
                if (index < foundTypes.length - 1) {
                    finalText += `${element} / `;
                    return;
                }
                finalText += ` ${element}`;
            })
        } else {
            finalText = foundTypes[0];
        }

        this.embedObject.fields.push({
            name: "Tipo(s) de Pokémon:",
            value: finalText,
            inline: true
        })

    }

    formatPokemonName () {
        let newText = "";
        if (typeof this.pokemonNameID === "string") {
            this.pokemonNameID = this.pokemonNameID.toLowerCase();
            if (this.pokemonNameID === "random") {
                return this.randomPokeID;
            }

            for(let letter = 0; letter < this.pokemonNameID.length; letter++){
                if (this.pokemonNameID[letter] != " "){
                    newText += this.pokemonNameID[letter];
                }
            }
            return newText;
        }
        
        if(typeof this.pokemonNameID === "number") {
            return this.pokemonNameID;
        }
    }

    evolutiveLine (mainJSON, evolutionJSON) {
        //Pokemons can have multi evolutions in the same evolves_to array, so check for length every time!
        const baseEvolution = evolutionJSON.chain;
        const firstEvolution = baseEvolution.evolves_to;
        let newText = "";
        let evolutions = [];
        evolutions.push(baseEvolution.species.name); //base evolution

        if (firstEvolution.length > 0) {  //has first evolution?
            const finalEvolution = firstEvolution[0].evolves_to;

            if (firstEvolution.length > 1) {  // has branch evolutions?
                evolutions.push(this.branchEvolutionsIterator(mainJSON, firstEvolution));
            } else {
                evolutions.push(firstEvolution[0].species.name);
            }

            if(finalEvolution.length > 0) { //has final evolution?

                if (finalEvolution.length > 1) { // Has branch evolutions?       
                    evolutions.push(this.branchEvolutionsIterator(mainJSON, finalEvolution));
                } else {
                    evolutions.push(finalEvolution[0].species.name);
                }

            }
        }

        if(evolutions.length > 1){
            evolutions.forEach((pokemonName, index) => {
                let currentPokemon = Utils.capitalize(pokemonName);
                if (pokemonName === mainJSON.name) {
                    currentPokemon = `**${currentPokemon}**`
                }

                if (index < evolutions.length - 1) {
                    newText += `${currentPokemon}\n`
                    return;
                } 
                newText += currentPokemon;
            })
        } else {
            newText = `**${Utils.capitalize(evolutions[0])}**`;
        }

        this.embedObject.fields.push({
            name:"Linea evolutiva:",
            value: newText,
            inline: true
        });
    }

    branchEvolutionsIterator (requestedPokemon, evolutionsArray) {
        // Iterates over evolves_to array if its length > 1
        let finalText = "";
        evolutionsArray.forEach((element, index) => {
            let currentEvolution = Utils.capitalize(element.species.name);

            if (element.species.name === requestedPokemon.name) {
                currentEvolution = `**${currentEvolution}**`
            }
            if (index < evolutionsArray.length - 1) {      
                finalText += `${currentEvolution} / `;
            } else {
                finalText += currentEvolution;
            }

        })
        return finalText;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pokedex')
    .setDescription('Busca los datos de un Pokémon en la PokéDex.')
	.addStringOption(option =>
	    option
        .setName('pokemon_id')
		.setDescription('El Pokémon a buscar en la PokéDex.')
		.setRequired(true)),
    aliases: ['pokedex'],
    description: 'Busca los datos de un Pokémon en la PokéDex. \n\n_¡Mi Pokemon favorito es Eevee!_',
    category: '🔍 Comandos de Búsqueda',
    args : '<Nombre del Pokémon>',
    async execute(interaction) {
        let instance = new Pokemon(interaction);
        instance.fetchPokemon();
    },
};