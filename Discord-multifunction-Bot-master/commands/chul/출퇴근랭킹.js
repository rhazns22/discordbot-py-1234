const discord = require('discord.js')
const db = require('quick.db')

exports.run = async (client, message, args) => {
  if (message.channel.id !== '767345325509705730') {
    message.reply('출퇴근가능한 채널이 아닙니다.')
    return
  }

  var data = db.get(`chul`) || {}

  var list = Object.keys(data)
    .map((_data) => {
      return {
        Id: _data,
        Value: data[_data] || 0,
      }
    })
    .sort((x, y) => y.Value - x.Value)

  var embed = new discord.MessageEmbed()
    .setTitle(' 출퇴근랭킹')
    .setDescription('현재출퇴근랭킹')
    .setThumbnail(
      'https://media.discordapp.net/attachments/764444105182019598/767315993113657344/baf446aeb1ab5a2e.png',
    )
    .setColor('GREEN')
    .addField(
      '┌──────────────────────────┐',
      `** **${list
        .splice(0, 10)
        .map(
          (item, index) =>
            `${index + 1}위 <@${item.Id}> 님의 모든개수: 출퇴근 횟수: ${
              item.Value
            }회`,
        )
        .join('\n├──────────────────────────┤\n')}`,
    )
    .addField(
      '└──────────────────────────┘',
      `기타안내: 매주 랭킹은 자동갱신됩니다. 순위권 1등분은 부스트가 지급됩니다.`,
    )
    .setFooter('항상 노력하시는 업로더분들 정말 멋있습니다!')

  message.channel.send(embed)
  return
}

exports.help = {
  name: '출퇴근랭킹',
  description: '관리자, 매니저 출퇴근 상태',
}

exports.conf = {
  aliases: [],
  cooldown: 0,
}
