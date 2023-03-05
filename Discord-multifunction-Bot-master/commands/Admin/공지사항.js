const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  const channel = message.mentions.channels.first();
  if (!channel) return message.reply({ embed: { color: "RED", description: "공지를 올릴 채널을 선택해주세요!"}});

  
}

exports.help = {
  name: "공지사항",
  description: "공지사항을 올릴 수 있습니다.",
  usage: "공지사항 [@멘션 | 유저 ID]",
  example: "공지사항 #채널 올릴말"
}

exports.conf = {
  aliases: ["ㄱㅈ"],
  cooldown: 5
}
