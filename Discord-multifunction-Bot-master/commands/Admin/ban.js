const Discord = require('discord.js')
const ban = require('./ban.json')

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission('MANAGE_MESSAGES')) {
    return message.channel.send(
      `${message.author} 님은 해당 명령어를 쓸 권한이 없습니다.`,
    )
  }

  const user = message.mentions.members.first()
  if (!user) return message.reply('제재할 유저를 멘션하세요.')

  const text = message.content.split(' ').slice(2).join(' ')
  if (!text) return message.reply('제재사유를 작성해주세요.')

  const role = '764695534455226379'

  var d = new Date()
  var currentData =
    d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일 '
  var currentTime = d.getHours() + '시 ' + d.getMinutes() + '분 '
  var u_a = user.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
  var u_u = user.user.username
  var u_d = `#${user.user.discriminator}`
  var u_i = user.user.id
  var u_p = user.user.presence.status
  var u_c = moment
    .utc(message.guild.members.cache.get(user.user.id).user.createdAt)
    .format('YYYY년 M월 D일')
  var u_j = moment
    .utc(message.guild.members.cache.get(user.user.id).user.joinedAt)
    .format('YYYY년 M월 D일')
  var u_t = `${currentData + currentTime}`

  if (!ban[role])
    ban[role] = {
      ban: 0,
    }

  if (!ban[role])
    ban[role] = {
      ban: 1,
    }

  ban[role].ban += +1
  fs.writeFile('./ban.json', JSON.stringify(ban), (err) => {
    if (err) console.log(err)
  })

  var ban_embed = new (require('discord.js').MessageEmbed)()
  ban_embed.setColor('리얼포스')
  ban_embed.setTitle('[리얼포스 서버] 차단 알림')
  ban_embed.setDescription(`차단 대상: ${user}`)
  ban_embed.setThumbnail(u_a)
  ban_embed.addField(`닉네임`, '```' + u_u + '```', true)
  ban_embed.addField(`태그`, '```' + u_u + u_d + '```', true)
  ban_embed.addField(`아이디`, '```' + u_i + '```')
  ban_embed.addField(`사유`, '```' + `${text}` + '```')
  ban_embed.addField(`가입한 날`, '```' + u_c + '```', true)
  ban_embed.addField(`들어온 날`, '```' + u_j + '```', true)
  ban_embed.addField(`처리 번호`, '```' + `${ban[role].ban}` + '```', true)
  ban_embed.setFooter('처리 날짜 ' + u_t)
  message.channel.send(ban_embed)
  user.ban(user)
}

async function promptMessage(message, author, time, reactions) {
  time *= 1000

  for (const reaction of reactions) {
    await message.react(reaction)
  }

  const filter = (reaction, user) =>
    reactions.includes(reaction.emoji.name) && user.id === author.id

  return message
    .awaitReactions(filter, { max: 1, time: time })
    .then((collected) => collected.first() && collected.first().emoji.name)
}

exports.help = {
  name: '밴',
  description: '밴시키기!',
  usage: '밴 <@멘션> <사유>',
  example: '밴  테스트',
}

exports.conf = {
  aliases: ['밴시키기'],
  cooldown: 5,
}
