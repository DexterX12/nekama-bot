const utils = require('./utils/utils.js');
const Help = require('./bot_related/help.js');
const Socials = require('./socials/socials.js');
const Minigames = require('./funnies/minigames/minigames.js');
const utilities = require('./utilities/utilities.js')
const Miscs = require('./funnies/miscs/miscs.js');

class CommandHandler {
    constructor (msg, client, userMention, messageContent){
        this.msg = msg;
        this.userMention = utils.getIdFromMention(userMention, client);
        this.socials = new Socials(msg, client, this.userMention)
        this.utilities = new utilities(msg, client, messageContent, this.userMention);
        this.minigames = new Minigames(msg, client, messageContent, this.userMention);
        this.miscs = new Miscs(msg, client, messageContent);
        this.help = new Help(msg, client);
    }

    async handleCommand(command) {
        switch(command){
            case "invite":
                await this.utilities.BotInvite.sendBotInvite();
            break;

            case "help":
                await this.help.showHelp();
            break;

            /* utilities SECTION (Comandos Útiles) */
            case "avatar":
                await this.utilities.UserAvatar.sendUserAvatar();
            break;

            case "calc":
                await this.utilities.Calculator.sendCalc();
            break;

            case "embed":
                await this.utilities.CreateEmbed.createEmbed();
            break;

            case "pokedex":
                await this.utilities.Pokemon.fetchPokemon();
            break;

            case "servericon":
                await this.utilities.ServerInfo.sendServerIcon();
            break;

            case "serverinfo":
                await this.utilities.ServerInfo.sendServerInfo();
            break;

            case "userinfo":
                await this.utilities.UserInfo.getUserInfo();
            break;
            
            /* INTERACTIONS SECTION (Comandos de Interacción) */
            case "baka":
                this.socials.interaction.baka();
            break;

            case "bite":
                this.socials.interaction.bite();
            break;
           
            case "cheeks":
                this.socials.interaction.cheeks();
            break;

            case "claps":
                this.socials.interaction.claps();
            break;

            case "cook":
                this.socials.interaction.cook();
            break;
             
            case "cuddle":
                this.socials.interaction.cuddle();
            break;

            case "dance":
                this.socials.interaction.dance();
            break;

            case "feed":
                this.socials.interaction.feed();
            break;

            case "gaming":
                this.socials.interaction.gaming();
            break;

            case "glare":
                this.socials.interaction.glare();
            break;

            case "hh":
                this.socials.interaction.handHolding();
            break;

            case "handholding":
                this.socials.interaction.handHolding();
            break;

            case "heal":
                this.socials.interaction.heal();
            break;
            
            case "hi":
                this.socials.interaction.hi();
            break;

            case "hf":
                this.socials.interaction.highfive();
            break;

            case "highfive":
                this.socials.interaction.highfive();
            break;

            case "hug":
                this.socials.interaction.hug();
            break;

            case "kb":
                this.socials.interaction.kickbutts();
            break;

            case "kickbutts":
                this.socials.interaction.kickbutts();
            break;

            case "kill":
                this.socials.interaction.kill();
            break;

            case "kiss":
                this.socials.interaction.kiss();
            break;

            case "laugh":
                this.socials.interaction.laugh();
            break;

            case "lick":
                this.socials.interaction.lick();
            break;

            case "pat":
                this.socials.interaction.pat();
            break;

            case "poke":
                this.socials.interaction.poke();
            break;

            case "punch":
                this.socials.interaction.punch();
            break;

            case "scared":
                this.socials.interaction.scared();
            break;

            case "shoot":
                this.socials.interaction.shoot();
            break;

            case "slap":
                this.socials.interaction.slap();
            break;

            case "sleep":
                this.socials.interaction.sleep();
            break;

            case "spank":
                this.socials.interaction.spank();
            break;

            case "splash":
                this.socials.interaction.splash();
            break;

            case "spray":
                this.socials.interaction.spray();
            break;

            case "stare":
                this.socials.interaction.stare();
            break;

            case "tickle":
                this.socials.interaction.tickle();
            break;

            case "tsundere":
                this.socials.interaction.tsundere();
            break;

            /* REACTIONS SECTION (Comandos de Reacción) */
            case "angry":
                this.socials.reaction.angry();
            break;

            case "cry":   
                this.socials.reaction.cry();
            break;

            case "happy":
                this.socials.reaction.happy();
            break;

            case "nope":
                this.socials.reaction.nope();
            break;

            /* FUNNIES SECTION (Comandos Divertidos) */

            case "8ball":
                this.miscs.eight_ball();
            break;

            case "choose":
                this.miscs.choose();
            break;

            case "coinflip":
                this.minigames.coinFlip();
            break;

            case "cf":
                this.minigames.coinFlip();
            break;

            case "fight":
                this.minigames.fight();
            break;

            case "rate":
                this.miscs.rate();
            break;
            
            case "roll":
                this.minigames.roll();
            break;

            case "rps":
                this.minigames.rpsGame();
            break;

            case "say":
                this.miscs.say();
            break;

           /* SAFEBOORU SECTION */

            case 'safeboorurank':
                await this.utilities.danbooruSearch.search();
            break;
            case 'sbra':
                await this.utilities.danbooruSearch.search();
            break;
            case 'safeboorutag':
                await this.utilities.danbooruSearch.searchTag();
            break;
            case 'sbt':
                await this.utilities.danbooruSearch.searchTag();
            break;
            case 'safeboorurandom':
                await this.utilities.danbooruSearch.search(true);
            break;
            case 'sbr':
                await this.utilities.danbooruSearch.search(true);
            break;

            /* DANBOORU SECTION */
            case 'danboorurank':
                await this.utilities.danbooruSearch.search(false, true);
            break;
            case 'dbra':
                await this.utilities.danbooruSearch.search(false, true);
            break;
            case 'danboorutag':
                await this.utilities.danbooruSearch.searchTag(true);
            break;
            case 'dbt':
                await this.utilities.danbooruSearch.searchTag(true);
            break;
            case 'danboorurandom':
                await this.utilities.danbooruSearch.search(true, true);
            break;
            case 'dbr':
                await this.utilities.danbooruSearch.search(true, true);
            break;
            case 'danboorupool':
                await this.utilities.danbooruSearch.searchPool();
            break;
            case 'dbp':
                await this.utilities.danbooruSearch.searchPool();
            break;

            default:
                utils.sendErrorMessage(this.msg, '¡Uy!, no conozco ese comando... <:pensando:705937711873261587>');
          }
    }
}

module.exports = CommandHandler;