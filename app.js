/* NYANTAKUS v2.0.0
PROYECTO DE BOT DE DISCORD
OWNERS: Nekama4chan#5381 (ID: 634104804813045762) y DexterX#6353 (ID: 301427223829938196)
© 2020 Hello_Isekai! todos los derechos reservados.
*/

const Discord = require('discord.js'),
      Handlers = require('./command_handler.js'),
      utils = require('./utils/utils.js'),
      config = require('./config.json'),

      client = new Discord.Client(),
      token = config.testToken,
      prefix = config.prefix,
      cooldown = new Set(),
      cdseconds = config.cooldown;


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  updateDescription();
});

client.on('message', async msg => {
  if (msg.author.bot) {
    return;
  }
  //console.log(msg.content);

  if (msg.content === prefix) {
      if(!msg.guild){
        return;
      }
      await msg.reply(`¡Ese es mi prefix!, usa **${prefix}help** para más información. <:wink:722547864118624278>`);
      return;
  }

  if (msg.content.startsWith(`<@!${client.user.id}>`) && msg.guild) {
      utils.sendErrorMessage(msg, `¡Hola!, usa mi prefix **${prefix}**`);
  }

  if (msg.content.startsWith(prefix)) {
    try{
      if(!msg.guild){
        return;
      }
      if(!cooldown.has(msg.author.id)){
        cooldown.add(msg.author.id);
      } else {
        await utils.sendErrorMessage(msg, '¡por favor, relájate un momento!, **Espera 5 segundos por comando por favor**. <:chancla:722547876244357200>');
        return;
      }

      
      setTimeout(async () => {
        cooldown.delete(msg.author.id);
      }, cdseconds * 1000);
      
      const msgcontent = msg.content.slice(prefix.length).toLowerCase(),
      userMention = msgcontent.split(' ')[1],
      command = msgcontent.split(' ')[0],
      noCommandMsgContent = msg.content.slice(prefix.length + (command.length + 1)),   
      commandHandler = new Handlers(msg, client, userMention, noCommandMsgContent);

      commandHandler.handleCommand(command);
      
      
    } catch (e){
      console.log(`Algo ha fallado. Razón del error: ${e}`);
    }
  }
});

async function updateDescription () {
    setInterval(() => {
      let membercount = client.users.cache.filter(u => !u.bot).size;
      let servercount = client.guilds.cache.size;
    
      client.user.setActivity(`${membercount} personitas y ${servercount} servidores`, {type:'WATCHING'});

    }, 300000)
  
}

client.login(token);
