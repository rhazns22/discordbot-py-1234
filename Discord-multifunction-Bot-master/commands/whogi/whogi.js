const Discord = require('discord.js')
const fs = require('fs')
const Database = require('./Helpers/Database')
// const db = require("quick.db");

exports.run = async (client, message, args) => {
  const User = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0]),
  )

  if (!User)
    return message.reply(
      '\n[후기양식]\n```&후기 @멘션 1~5 후기내용```\n[EX]\n```&후기 @이은이 5 배포해주셔서 감사합니다.```',
    )

  const Stars = args[1]

  if (!Stars || Stars < 1 || Stars > 5)
    return message.reply('1부터 5중에 평점을 숫자로 매겨주세요')
  if (isNaN(Stars)) return message.reply('평점은 숫자만 가능합니다!')

  var text = args.splice(2, args.length).join(' ') || '감사합니다!'

  const amount = 1

  var stars = ''
  for (let i = 0; i < Stars; i++) {
    stars += ':star: '
  }

  // var d = new Date();
  // var currentData = d.getFullYear() + "년 " + (d.getMonth() + 1) + "월 " + d.getDate() + "일 ";
  // var currentTime = d.getHours() + "시 " + d.getMinutes() + "분 ";
  // var u_a = user.user.avatarURL({ format: 'png', dynamic: true, size: 1024 });
  // var u_u = user.user.username;
  // var u_d = `#${user.user.discriminator}`;
  // var u_i = user.user.id;
  // var u_p = user.user.presence.status;
  // var u_c = moment.utc(message.guild.members.cache.get(user.user.id).user.createdAt).format("YYYY년 M월 D일");
  // var u_j = moment.utc(message.guild.members.cache.get(user.user.id).user.joinedAt).format("YYYY년 M월 D일");
  // var u_t = `${currentData + currentTime}`;

  // const data = new whogis("./Whogis/" + message.guild.id, "Whogi")

  const db = new Database('./Servers/' + message.guild.id, 'Whogis')

  const whogi = db.get(`whogi.${User.id}`) || 0
  const star = db.get(`star.${User.id}`) || 0

  await db.add(`whogi.${User.id}`, amount)
  await db.add(`star.${User.id}`, Stars)
  const embed = new Discord.MessageEmbed()
    .setTitle('[LEEDU] 후기')
    .setDescription(
      `**<@${message.author.id}>님이 ${User}님에게 후기를 남겼습니다.**`,
    )
    .addField('후기자 아이디', '```' + message.author.id + '```')
    .addField('받는자 아이디', '```' + User.id + '```')
    .addField('평점', `' **${stars}** '`, true)
    .addField('후기내용', `' **${text}** '`, true)
    .addField('후기개수', '```' + (whogi + 1) + '```')
    .addField('평점개수', '```' + star + '```')
    .setColor('GREEN')
  return message.channel.send(embed)
}

exports.help = {
  name: '후기',
  description: '유저에게 후기남기기!',
  usage: '후기 <@멘션> <평점 1 ~ 5 숫자만 적기> <사유>',
  example: '후기  봇 5 감사합니다!',
}

exports.conf = {
  aliases: ['ㅎㄱ'],
  cooldown: 5,
}
