/* NYANTAKUS v1.2.2
PROYECTO DE BOT DE DISCORD
OWNERS: Nekama4chan#5381 y DexterX#6353
© 2020 Hello_Isekai! todos los derechos reservados.
*/

const Handlers = require('./command_handler.js'),
      utils = require('./utils/utils.js'),
      Discord = require('discord.js'),
      client = new Discord.Client(),
      token = 'NzUzNjQwNTQwNDg2MTA3MzA2.X1pIcg.btFkwov7rQRCvZrorSMOorNqdtY',
      testToken = 'NzI0ODE1NzI1NzgwNDAyMjM2.XvFsJg.hsVQ5phc1gRitrfCFkhtGxJ3YYE',
      prefix = 'n!',
      cooldown = new Set(),
      cdseconds = 5;


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
      await msg.reply('¡Ese es mi prefix!, usa **`n!help`** para más información. <:wink:722547864118624278>');
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
        await msg.reply('¡por favor, relájate un momento!, **Espera 5 segundos por comando por favor**. <:chancla:722547876244357200>');
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
      if(command === "ping"){
        msg.channel.send(`¡Pong!\n:ping_pong: ${Date.now() - msg.createdTimestamp}ms`);
        return;
      }
      commandHandler.handleCommand(command);
      
      
    } catch (e){
      console.log(`Algo ha fallado. Razón del error: ${e}`);
    }
  }
});

async function updateDescription () {
  setInterval( async () => {
    let membercount = 0;
    let servercount = 0;
    client.guilds.cache.forEach( guild => {
      membercount += guild.memberCount;
      servercount++;
    });
    client.user.setActivity(`¡${membercount} personitas y ${servercount} servidores!`, {type:'WATCHING'});
  }, 300000);
}

client.login(token);
