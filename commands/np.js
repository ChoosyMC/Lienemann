const { MessageEmbed } = require("discord.js")

const { COLOR } = require("../config.json");

module.exports = {
  name: "np",
  description: "Get the name of current playing song",
  execute (client, message, args) {
    let embed = new MessageEmbed()
.setColor(COLOR)
      
    const { channel } = message.member.voice;
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      embed.setAuthor("YOU NEED TO BE IN VOICE CHANNEL :/")
      return message.channel.send(embed);
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      embed.setAuthor("Bot is not playing anything")
      return message.channel.send(embed);
    }
    
    embed.setDescription(`<a:correto:723741436377563148> **Música Atual:**
${serverQueue.songs[0].title}`)
     .setColor("#05e18e")
    message.channel.send(embed)

    
    
    
  }
}