const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js")

const { COLOR } = require("../config.json");

module.exports = {
  name: "queue",
  description: "Get all the song name which are in queue",
  execute: (client, message, args) => {
    let embed = new MessageEmbed().setColor(COLOR);
    const { channel } = message.member.voice;

    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      embed.setAuthor("YOU NEED TO BE IN VOICE CHANNEL :/");
      return message.channel.send(embed);
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      embed.setAuthor("There is nothing in the queue");
      return message.channel.send(embed);
    }
      const embedQueue = new Discord.MessageEmbed()
       .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
       .setDescription(`
<:papel:734322526846451726> __**Músicas na fila**__:

\`${serverQueue.songs
        .map((song, index) => index + 1 + ". " + song.title)
        .join("\n")}\`

Pular para a próxima música: **s.skip**
Pular para uma música específica: **s.jump <numero>**
`)
       .setColor('#fc7c00')
      message.channel.send(embedQueue)
  }
};
