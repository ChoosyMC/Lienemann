const { MessageEmbed } = require("discord.js")

const { COLOR } = require("../config.json");

module.exports = {
  name: "pause",
  description: "Pause the cureent playing Song",
  execute (client, message, args) {
  const { channel } = message.member.voice;
   let embed = new MessageEmbed()
.setColor(COLOR);

    
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
       embed.setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
       .setDescription(`
Você não está em um canal de voz.
`)
       .setColor('#f50e0e')
      return message.channel.send(embed)
    }
    
    
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      embed.setAuthor("Não há nada tocando para eu pausar.")
      return message.channel.send(embed);
    }
    
    if(serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause(true)
      
      embed.setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
        .setDescription("⏯️ | A música atual foi pausada.")
        .setColor("#2094ff")
      return message.channel.send(embed)
  }  
  }
}