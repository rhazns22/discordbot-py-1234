const Discord = require('discord.js')
const fs = require('fs')
const Database = require('./Helpers/Database')

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission(['MANAGE_GUILD', 'ADMINISTRATOR'])) {
    return message.channel.send({
      embed: { color: 'RED', description: '당신은 권한이 없습니다!' },
    })
  }

  const db = new Database('./Servers/' + message.guild.id, 'Whogis')

  const User = message.guild.member(message.mentions.users.first())

  if (!User)
    return message.reply(
      '\n[후기양식]\n```&후기 @멘션 1~5 후기내용```\n[EX]\n```&후기 @이은이 5 배포해주셔서 감사합니다.```',
    )

  db.set(`whogi.${User.id}`, 0)
  db.set(`star.${User.id}`, 0)
}

exports.help = {
  name: '초기화',
  description: '유저에게 후기남기기!',
  usage: '후기 <@멘션> <평점 1 ~ 5 숫자만 적기> <사유>',
  example: '후기  봇 5 감사합니다!',
}

exports.conf = {
  aliases: ['ㅎㄱ'],
  cooldown: 5,
}
