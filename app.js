/* NYANTAKUS
PROYECTO DE BOT DE DISCORD
OWNERS: Nekama4chan#5381 (ID: 634104804813045762) y DexterX#6353 (ID: 301427223829938196)
© 2020 Hello_Isekai! todos los derechos reservados.
*/

const fs = require('fs'),
      {Client, Intents, Collection} = require('discord.js'),
      config = require('./config.json'),
      utils = require('./utils/utils.js'),
      commandsFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')),

      client = new Client({ intents: [Intents.FLAGS.GUILDS,
                                      Intents.FLAGS.GUILD_MEMBERS,
                                      Intents.FLAGS.GUILD_MESSAGES] }),
      cooldown = new Set(),
      cdseconds = config.cooldown,
      commands = new Collection(),
      token = config.token,
      mentionEmbed = {
        title: "Nyantakus",
        description: `¡Hola! Para usarme, debes hacerlo como una aplicación de discord mediante los *slash commands*\nPara más información usa /help\n\nNota: Si no aparecen mis comandos, entonces invítame de nuevo con este *[invite](${config.inviteLink})*.`,
        color: "#ff00ff"
      }

client.once('ready', () => {
  console.log(`El cliente ha sido iniciado con el tag de: ${client.user.tag}!`);

  for (const file of commandsFiles) {
    let command = require(`./commands/${file}`)
    commands.set(command.aliases[0], command);
  }
  
  console.log('Comandos satisfactoriamente cargados');

  updateDescription();

  setInterval(() => {
    updateDescription();
  }, 300000);
});

client.on('messageCreate', async message => {
  if (message.guild && message.content.startsWith(`<@!${client.user.id}>`)) {
    message.reply({embeds:[mentionEmbed]});
  } 
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

  if(!cooldown.has(interaction.user.id)){
    cooldown.add(interaction.user.id);
  } else {
    await utils.sendErrorMessage(interaction, '¡Por favor relájate un momento, **Espera 5 segundos por comando**! <:chancla:722547876244357200>');
    return;
  }

  setTimeout(async () => {
    cooldown.delete(interaction.user.id);
  }, cdseconds * 1000);

  interaction["commands"] = commands;

  const command = commands.get(interaction.commandName);

  if (!command) {
    await utils.sendErrorMessage(interaction, '¡Uy!, no conozco ese comando... <:pensando:705937711873261587>');
    return;
  }

  await command.execute(interaction);

});

async function updateDescription () {
  let servercount = client.guilds.cache.size;
  client.user.setActivity(`${servercount} servidores usándome! ^-^\n Nyantakus v${config.currentVersion}`, {type:'WATCHING'});
}

client.login(token);
