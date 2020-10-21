const { MessageEmbed } = require("discord.js");

const { COLOR } = require("../config.json");
module.exports = {
  name: "volume",
  description: "Manage the volume of the song",
  execute(client, message, args) {
    
    if(!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send("You are not allowed to change the volume of the music")
    }
    

    
    let embed = new MessageEmbed().setColor(COLOR);

    
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
    
    if(!args[0]) {
      embed.setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`O volume atual está em **${serverQueue.volume}**/200%.`)
      return message.channel.send(embed)
    }
    
    if(isNaN(args[0])) {
      embed.setAuthor("O volume deve ser definido por número.")
      return message.channel.send(embed)
    }
    
    if(args[0] > 200) {
      embed.setAuthor("O volume máximo é **200**.")
      return message.channel.send(embed)
    }
    
    serverQueue.volume = args[0]
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100)
    embed.setAuthor(message.author.username, message.author.displayAvatarURL())

      .setDescription(`O volume foi alterado para **${args[0]}**%.`)
    message.channel.send(embed)
    
  }
};
