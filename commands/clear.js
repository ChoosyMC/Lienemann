const Discord = require("discord.js");


module.exports.run = async (bot, message, args) => {
 
 
   
  message.delete({ timeout: 1 });
  const amount = parseInt(args[0]) + 1;
  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.reply("Permissões insuficientes").then(msg => {
      msg.delete({ timeout: 6000 });
    });

   if (isNaN(amount)) {
    return message.reply(`Hum. ${args[0]} não é considerado um número válido.`);
   } else if (amount <= 1 || amount > 100) {
    return message.reply("Específique quantas mensagens quer limpar, de 1 a 99.").then(msg => {
        msg.delete({ timeout: 6000 });
      });
  }
      

  if (args > 100)
    return message
      .reply(
        `Você tentou remover ${args} mensagens, porém o máximo que eu consigo é 100.`
      )
      .then(msg => {
        msg.delete({ timeout: 6000 });
      });

  setTimeout(() => {
    message.channel.bulkDelete(args[0]).then(() => {
      message.channel.send(`Chat limpo por ${message.author}!`).then(msg => {
        msg.delete({ timeout: 6000 })})
    }, 1000);
  });
    
}
