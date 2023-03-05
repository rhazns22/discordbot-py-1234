const Discord = require('discord.js')
const db = require('quick.db')

exports.run = async (client, message, args) => {
  if (message.channel.id !== '765859494307299338') {
    message.delete()
    return message.reply('포인트기부 가능한 채널이 아닙니다!')
  }
  let user
  if (message.mentions.users.first()) {
    user = message.mentions.users.first()
  } else if (args[0]) {
    user = message.guild.members.cache.get(args[0]).user
  }

  let balance = db.get(`account.${message.author.id}.balance`)

  if (!user)
    return message.channel.send('사용자를 멘션하거나 사용자 ID를 입력하십시오.')
  if (user.bot || user === client.user)
    return message.channel.send('이사용자는 봇입니다')
  if (user.id === message.author.id || user === message.author)
    return message.channel.send('자신에게 기부는 불가능합니다.')

  let amount = parseInt(args[1])
  if (!amount) return message.channel.send('기부할 포인트를 입력해주세요')
  if (isNaN(amount))
    return message.channel.send('기부포인트는 숫자만 가능합니다')
  // isNaN = is Not a Number.

  if (!balance || balance == 0)
    return message.channel.send('포인트가 비어 있습니다.')
  if (amount > balance)
    return message.channel.send('기부할 포인트가 충분하지 않습니다.')
  if (amount === 0)
    return message.channel.send('0포인트는 전송할 수 없습니다..')

  await db.add(`account.${user.id}.balance`, amount)
  await db.subtract(`account.${message.author.id}.balance`, amount)

  return message.channel.send(
    `기부가 완료되었습니다 (<@${message.author.id}>)님의 현재 포인트: ${amount}!`,
  )
}

exports.help = {
  name: '기부',
  description: '포인트가 없는 유저에게 기부를 할 수 있습니다.',
  usage: '기부 <@멘션 | 유저 ID> <기부금액>',
  example: '기부  900',
}

exports.conf = {
  aliases: ['기부'],
  cooldown: 15,
}
