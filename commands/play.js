const { MessageEmbed } = require("discord.js")

const ms = require("ms")

const Discord = require("discord.js")
const { Util } = require("discord.js");
const { YOUTUBE_API_KEY, QUEUE_LIMIT, COLOR } = require("../config.json");
const ytdl = require("ytdl-core");
const YoutubeAPI = require("simple-youtube-api");
const youtube = new YoutubeAPI(YOUTUBE_API_KEY);
const config = new require('../config.json')
const { play } = require("../system/music.js");
module.exports = {
  name: "play",
  description: "Play the song and feel the music",
  async execute(client, message, args) {
    let embed = new MessageEmbed()
.setColor(COLOR);


    //FIRST OF ALL WE WILL ADD ERROR MESSAGE AND PERMISSION MESSSAGE
    if (!args.length) {
      const banido2_embed = new Discord.MessageEmbed()
       .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
       .setDescription(`
Você esqueceu de mencionar o **URL** ou **Nome** da música.
`)
       .setColor('#f50e0e')
      return message.channel.send(banido2_embed)
    }

    const { channel } = message.member.voice;
        
    if (!channel) {
      const embedNoVoice = new Discord.MessageEmbed()
       .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
       .setDescription(`
Você esqueceu de entrar em um canal de voz.
`)
       .setColor('#f50e0e')
      return message.channel.send(embedNoVoice)
    }

    //WE WILL ADD PERMS ERROR LATER :(

    const targetsong = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const urlcheck = videoPattern.test(args[0]);

    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      const embedNoRepro = new Discord.MessageEmbed()
       .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
       .setDescription(`
Não consigo reproduzir a lista de reprodução no momento.
`)
       .setColor('#f50e0e')
      return message.channel.send(embedNoRepro)
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };
    
    const voteConstruct = {
      vote: 0,
      voters: []
    }

    let songData = null;
    let song = null;

    if (urlcheck) {
      try {
        songData = await ytdl.getInfo(args[0]);
      
        song = {
             title: songData.videoDetails.title,
          url: songData.videoDetails.video_url,
          duration: songData.videoDetails.lengthSeconds,
          thumbnail: songData.videoDetails.thumbnail.thumbnails[3].url
        };
      } catch (error) {
        if (message.include === "copyright") {
      const embedCopyright = new Discord.MessageEmbed()
       .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
       .setDescription(`
A música tem direitos autorais e não foi possível reproduzir.
`)
       .setColor('#f50e0e')
      return message.channel.send(embedCopyright)
            .catch(console.error);
        } else {
          console.error(error);
        }
      }
    } else {
          
      try {
        const result = await youtube.searchVideos(targetsong, 1);
        songData = await ytdl.getInfo(result[0].url);
      
        song = {
          title: songData.videoDetails.title,
          url: songData.videoDetails.video_url,
          duration: songData.videoDetails.lengthSeconds,
          thumbnail: songData.videoDetails.thumbnail.thumbnails[3].url,
        };
      } catch (error) {
        console.log(error)
        
      }
    }

    if (serverQueue) {
        if(serverQueue.songs.length > Math.floor(QUEUE_LIMIT - 1) && QUEUE_LIMIT !== 0) {
      return message.channel.send(`Você não pode adicionar mais de **${QUEUE_LIMIT}** músicas na fila.`)
    }
      
    
      serverQueue.songs.push(song);
      embed.setAuthor("Nova música foi adicionado à fila", client.user.displayAvatarURL())
      embed.setDescription(`**[${song.title}](${song.url})**`)
      embed.setThumbnail(song.thumbnail)
      .setFooter(`${songData.videoDetails.likes || "0"} Likes - ${songData.videoDetails.dislikes || "0"} Deslikes`)
      
      return serverQueue.textChannel
        .send(embed)
        .catch(console.error);
    } else {
      queueConstruct.songs.push(song);
    }

    if (!serverQueue)
      message.client.queue.set(message.guild.id, queueConstruct);
       message.client.vote.set(message.guild.id, voteConstruct);
    if (!serverQueue) {
      try {
        queueConstruct.connection = await channel.join();
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(`Could not join voice channel: ${error}`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel
          .send({
            embed: {
              description: `😭 | Não foi possível entrar no canal: ${error}`,
              color: "#ff2050"
            }
          })
          .catch(console.error);
      }
    }
  }
};
