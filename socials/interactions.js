const utils = require('../utils/utils.js');
const Gifs = require('../collections/gifCollection.json');
const Phrases = require('../collections/phrasesCollection.json');

class Interactions {
    constructor(msg, client, userMention){
        this.msg = msg;
        this.client = client;
        this.userMentioned = userMention;
    }

    interaction (gif, phrases, phrasesDuo, needsMention) {
        if (needsMention) {
            const phraseToUse = utils.getRanValueArray(phrases)
            if(this.userMentioned){
                utils.actionReactionBase(this.msg, this.userMentioned, phraseToUse, gif);
                return;
            }
            utils.sendErrorMessage(this.msg, `¡Así no es!, **tienes que mencionar a alguien**. <:facepalm:722547858594725889>`);
        } else {
            let phraseToUse;
            if (this.userMentioned) {
                phraseToUse = utils.getRanValueArray(phrasesDuo);
                utils.actionReactionBase(this.msg, this.userMentioned, phraseToUse, gif);
            } else {
                phraseToUse = utils.getRanValueArray(phrases);
                utils.actionReactionBase(this.msg, this.userMentioned, phraseToUse, gif, true);
            }
        }
    }
     
    /* DUAL INTERACTIONS/STANDALONE - DOESN'T REQUIRE MENTION */

    async bite () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.biteGifs);
        this.interaction(gifToUse, Phrases.interactions.bitePhrases, Phrases.interactions.biteDuoPhrases, false);
    }
    
    
    async claps () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.clapsGifs);
        this.interaction(gifToUse, Phrases.interactions.clapsPhrases, Phrases.interactions.clapsDuoPhrases, false);
    }   

    async cook () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.cookGifs);
        this.interaction(gifToUse, Phrases.interactions.cookPhrases, Phrases.interactions.cookDuoPhrases, false);
    }
    
    async cuddle () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.cuddleGifs);
        this.interaction(gifToUse, Phrases.interactions.cuddlePhrases, Phrases.interactions.cuddleDuoPhrases, false);
    }

    async dance () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.danceGifs);
        this.interaction(gifToUse, Phrases.interactions.dancePhrases, Phrases.interactions.danceDuoPhrases, false);
    }
    
    async feed () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.feedGifs);
        this.interaction(gifToUse, Phrases.interactions.feedPhrases, Phrases.interactions.feedDuoPhrases, false);
    }

    async gaming () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.gamingGifs);
        this.interaction(gifToUse, Phrases.interactions.gamingPhrases, Phrases.interactions.gamingDuoPhrases, false);
    }

    async glare () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.glareGifs);
        this.interaction(gifToUse, Phrases.interactions.glarePhrases, Phrases.interactions.glareDuoPhrases, false);
    }

    async hi () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.hiGifs);
        this.interaction(gifToUse, Phrases.interactions.hiPhrases, Phrases.interactions.hiDuoPhrases, false);
    }

    async highfive () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.highfiveGifs);
        this.interaction(gifToUse, Phrases.interactions.highfivePhrases, Phrases.interactions.highfiveDuoPhrases, false);
    }
    
    async laugh () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.laughGifs);
        this.interaction(gifToUse, Phrases.interactions.laughPhrases, Phrases.interactions.laughDuoPhrases, false);
    }

    async scared () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.scaredGifs);
        this.interaction(gifToUse, Phrases.interactions.scaredPhrases, Phrases.interactions.scaredDuoPhrases, false);
    }

    async shoot () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.shootGifs);
        this.interaction(gifToUse, Phrases.interactions.shootPhrases, Phrases.interactions.shootDuoPhrases, false);
    }

    async sleep () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.sleepGifs);
        this.interaction(gifToUse, Phrases.interactions.sleepPhrases, null, false);
    }

    async spray () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.sprayGifs);
        this.interaction(gifToUse, Phrases.interactions.sprayPhrases, Phrases.interactions.sprayDuoPhrases, false);
    }

    async tsundere () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.tsundereGifs);
        this.interaction(gifToUse, Phrases.interactions.tsunderePhrases, Phrases.interactions.tsundereDuoPhrases, false);
    }

    /* NORMAL INTERACTIONS - DOES REQUIRE MENTION */

    async baka () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.bakaGifs);
        this.interaction(gifToUse, Phrases.interactions.bakaPhrases, null, true);
    }

    async cheeks () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.cheeksGifs);
        this.interaction(gifToUse, Phrases.interactions.cheeksPhrases, null, true);
    }
    
    async handHolding () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.handholdingGifs);
        this.interaction(gifToUse, Phrases.interactions.handholdingPhrases, null, true);
    }
    
    async heal () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.healGifs);
        this.interaction(gifToUse, Phrases.interactions.healPhrases, null, true);
    }

    async hug () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.hugGifs);
        this.interaction(gifToUse, Phrases.interactions.hugPhrases, null, true);
    }

    async kickbutts () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.kickbuttsGifs);
        this.interaction(gifToUse, Phrases.interactions.kickbuttsPhrases, null, true);
    }

    async kill () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.killGifs);
        this.interaction(gifToUse, Phrases.interactions.killPhrases, null, true);
    }

    async kiss () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.kissGifs);
        this.interaction(gifToUse, Phrases.interactions.kissPhrases, null, true);
    }

    async lick () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.lickGifs);
        this.interaction(gifToUse, Phrases.interactions.lickPhrases, null, true);
    }

    async pat () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.patGifs);
        this.interaction(gifToUse, Phrases.interactions.patPhrases, null, true);
    }

    async poke () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.pokeGifs);
        this.interaction(gifToUse, Phrases.interactions.pokePhrases, null, true);
    }

    async punch () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.punchGifs);
        this.interaction(gifToUse, Phrases.interactions.punchPhrases, null, true);
    }

    async slap () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.slapGifs);
        this.interaction(gifToUse, Phrases.interactions.slapPhrases, null, true);
    }

    async spank () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.spankGifs);
        this.interaction(gifToUse, Phrases.interactions.spankPhrases, null, true);
    }

    async splash () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.splashGifs);
        this.interaction(gifToUse, Phrases.interactions.splashPhrases, null, true);
    }

    async stare () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.stareGifs);
        this.interaction(gifToUse, Phrases.interactions.starePhrases, null, true);
    }

    async tickle () {
        const gifToUse = utils.getRanValueArray(Gifs.interactions.tickleGifs);
        this.interaction(gifToUse, Phrases.interactions.ticklePhrases, null, true);
    }
}

module.exports = Interactions;