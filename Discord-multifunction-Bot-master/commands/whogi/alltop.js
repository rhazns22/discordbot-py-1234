const Discord = require('discord.js')
const fs = require('fs')
const Database = require('./Helpers/Database')
// const db = require("quick.db");
// const whogis = new db.table('whogis');

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission(['MANAGE_GUILD', 'ADMINISTRATOR'])) {
    return message.channel.send({
      embed: { color: 'RED', description: '당신은 권한이 없습니다!' },
    })
  }

  const db = new Database('./Servers/' + message.guild.id, 'Whogis')
  var data = db.get(`whogi`) || {}
  var data2 = db.get(`star`) || {}
  var userdata = db.get(`whogi.${message.author.id}`)

  var list = Object.keys(data)
    .map((_data) => {
      return {
        Id: _data,
        Value: data[_data] || 0,
        Value2: data2[_data] || 0,
      }
    })
    .sort((x, y) => y.Value - x.Value)

  var embed = new Discord.MessageEmbed()
    .setTitle(' 전체랭킹')
    .setDescription('현재전체랭킹')
    .setThumbnail(
      'https://media.discordapp.net/attachments/764444105182019598/767315993113657344/baf446aeb1ab5a2e.png',
    )
    .setColor('GREEN')
    .addField(
      '┌──────────────────────────┐',
      `** **${list
        .splice(0, 100)
        .map(
          (item, index) =>
            `${index + 1}위 <@${item.Id}> 님의 모든개수: 후기 개수: ${
              item.Value
            }개, 평점개수: ${item.Value2}개`,
        )
        .join('\n├──────────────────────────┤\n')}`,
    )
    .addField(
      '└──────────────────────────┘',
      `기타안내: 매주 랭킹은 자동갱신됩니다. 순위권 1등, 2등, 3등 분들께는 부스트가 지급됩니다.`,
    )
    .setFooter('항상 노력하시는 업로더분들 정말 멋있습니다!')

  message.channel.send(embed)
}

exports.help = {
  name: '전체랭킹',
  description: '전체랭킹조회하기',
  usage: '전체랭킹',
  example: '전체랭킹',
}

exports.conf = {
  aliases: ['ㄹㅋ'],
  cooldown: 5,
}
