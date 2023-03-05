const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("당신은 권한이 없습니다.");
 
    if (!args[0]) return message.reply("정리할만큼 숫자를 적으세요.");
 
    if (Number.isInteger(parseInt(args[0]))) {

        const channel = client.channels.cache.get("739622731389337642");
 
        var aantal = parseInt(args[0]) + 1;
 
        message.channel.bulkDelete(aantal).then(() => {
 
            if (args[0] == 0) {
 
                const embed0 = new Discord.MessageEmbed()
                .setAuthor("0개의 메시지를 삭제하지못합니다.")
                message.reply(embed0).then(msg => msg.delete({timeout: 3000}));
           
            } else if (args[0] == 1) {
           
                const embed1 = new Discord.MessageEmbed()
                .setAuthor("채팅창을 청소하였습니다.")
                .setDescription("채팅창이 깔끔해졌네요 ^^")
                .addField("> 삭제한 관리자", "<@" + message.author.id + ">", true)
                .addField("> 삭제된 메시지의수",`${args[0]}`, true)
                .setFooter("이용해주셔서 감사합니다.")
                message.reply(embed1).then(msg => msg.delete({timeout: 3000}));
           
            } else {
           
                const embed2 = new Discord.MessageEmbed()
                .setAuthor("채팅창을 청소하였습니다.")
                .setDescription("채팅창이 깔끔해졌네요 ^^")
                .addField("> 삭제한 관리자", "<@" + message.author.id + ">", true)
                .addField("> 삭제된 메시지의수",`${args[0]}`, true)
                .setFooter("이용해주셔서 감사합니다.")
                message.reply(embed2).then(msg => msg.delete({timeout: 3000}));
           
            }
 
        });
 
    } else {
        return message.reply("오류.");
    }
}

exports.help = {
  name: "청소",
  description: "채팅창을 청소합니다!",
  usage: "청소 <청소량>",
  example: "청소 99"
};

exports.conf = {
  aliases: ["청소"],
  cooldown: 5
}
