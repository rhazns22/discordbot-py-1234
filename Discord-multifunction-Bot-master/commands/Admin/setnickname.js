const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  
  // You can make a single array to detect the user permissions.
  if (!message.member.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
    return message.channel.send({embed: {color: "RED", description: "당신은 권한이 없습니다!"}})
  }
  
  let user = message.mentions.users.first(); // You can mention someone, not only just user.
  if (!user) return message.channel.send({embed: {color: "RED", description: "별명을 변경할 유저를 멘션해주세요!"}});
  
  let nick = args.slice(1).join(" ");
  if (!nick) return message.channel.send({embed: {color: "RED", description: "바꿀닉네임을 적어주세요!"}});
  
  let member = message.guild.members.cache.get(user.id);
  
  await member.setNickname(nick).catch(err => message.channel.send({embed: {color: "RED", description: `에러: ${err}`}}));
  return message.channel.send({embed: {color: "GREEN", description: `정삭적으로 **${user.tag}** 님의 닉네임이 변경되었습니다 ! \n 변경된 닉네임: **${nick}**`}});
}

exports.help = {
  name: "별명변경",
  description: "유저의 별명을 바꿔줍니다.",
  usage: "!별명변경 <@유저멘션> <닉네임>",
  example: "!별명변경 @우진#2222 총관리자"
}

exports.conf = {
  aliases: ["별명변경"],
  cooldown: 5
}
