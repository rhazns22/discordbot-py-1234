const db = require('quick.db')

exports.run = async (client, message, args) => {
  const channel = db.get(`inzung.${message.guild.id}.channel`);
  if (!channel) return message.reply(`인증가능한 채널을 지정하시지 않았습니다!`);
  const role = db.get(`inzung.${message.guild.id}.role`);
  if (!role) return message.reply(`인증후 지급할 역할이 지정되지않았습니다!`);
  const togg = db.get(`roledel.${message.guild.id}`);
  if (togg == true) { 
    const roles = db.get(`inzung.${message.guild.id}.rerole`);
    if (!roles) return message.reply(`인증후 제거할 역할이 지정되지않았습니다!`);
  }
  if (message.channel.id !== channel) {
    message.reply(`인증가능한 채널이 아닙니다!`)
    return;
  }
  const roless = db.get(`inzung.${message.guild.id}.rerole`);

  await message.member.roles.add(role);
  if (togg == true) {
    await message.member.roles.remove(roless);
  }

  const moment = require("moment");
  var u_c = moment.utc(message.guild.members.cache.get(message.author.id).user.createdAt).format("YYYY년 M월 D일");
  var u_j = moment.utc(message.guild.members.cache.get(message.author.id).user.joinedAt).format("YYYY년 M월 D일");

  const embed = new (require("discord.js").MessageEmbed)()
  embed.setColor('RANDOM')
  embed.setTitle("[서버이름] 인증 알림")
  embed.setDescription(`인증 대상: <@${message.author.id}>`)
  embed.setThumbnail(message.author.avatarURL())
  embed.addField(`닉네임`, '```' + message.author.username + '````', true)
  embed.addField(`태그`, '```' + message.author.username + `#` + message.author.discriminator + '````', true)
  embed.addField(`아이디`, '```' + message.author.id + '````', true)
  embed.addField(`디코가입`, '```' + u_c + '````', true)
  embed.addField(`서버가입`, '```' + u_j + '````', true)
  message.channel.send(embed)
  return;
}

exports.help = {
  name: "인증",
  description: "로봇이 아닌걸 인증하기 위한 명령어입니다."
}

exports.conf = {
  aliases: [],
  cooldown: 20
}
