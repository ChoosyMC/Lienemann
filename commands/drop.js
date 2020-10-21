const { MessageEmbed } = require("discord.js");
const { COLOR } = require("../config.json");
module.exports = {
  name: "drop",
  description: "Drop The Song From Queue",
  execute(client, message, args) {
    let embed = new MessageEmbed().setColor(COLOR);
    const { channel } = message.member.voice;
    if (!channel) {
      embed.setAuthor("YOU ARE NOT IN VOICE CHANNEL");
      return message.channe.send(embed);
    }

    const serverQueue = client.queue.get(message.guild.id);

    if (!serverQueue) {
      embed.setAuthor("");
      return message.channel.send(embed);
    }
    
     if(isNaN(args[0])) {
      embed.setAuthor("Você tem que usar número.")
      return message.channel.send(embed)
    }
   
    if(args[0] > serverQueue.songs.length) {
      embed.setAuthor("Não foi possível entrar a música.")
      return message.channel.send(embed)
    }
    
    
    serverQueue.songs.splice(args[0] - 1, 1)
    embed.setDescription("A música foi jogada na fila.")
    return message.channel.send(embed)
  }
};
