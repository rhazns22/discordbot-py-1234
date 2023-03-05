const Discord = require('discord.js')
const db = require('quick.db')

exports.run = async (client, message, args) => {
  if (message.channel.id !== '765859192480464936') {
    message.delete()
    return message.reply('포인트확인 가능한 채널이 아닙니다!')
  }
  const prefix = client.config.prefix
  let user
  if (message.mentions.users.first()) {
    user = message.mentions.users.first()
  } else if (args[0]) {
    user = message.guild.members.cache.get(args[0]).user
  } else {
    user = message.author
  }

  if (user.bot || user === client.user) {
    return message.channel.send('이 사용자는 봇입니다.')
  }

  let balance = db.get(`account.${user.id}.balance`)
  if (!balance) balance = 0
  else balance = balance

  const embed = new Discord.MessageEmbed()
    .setColor(0x7289da)
    .setTitle(`[LEEDU] 포인트확인`)
    .setDescription(`<@${user.id}> 님의 포인트입니다!`)
    .addField(`포인트`, '```' + balance.toLocaleString() + '```')
    // .setImage(user.displayAvatarURL({size: 4096, dynamic: true}))
    .setTimestamp(new Date()) // Optional :)
  return message.channel.send(embed)
}

exports.help = {
  name: '내포인트',
  description: '포인트를 확인합니다..',
  usage: '내포인트 [@멘션 | 유저 ID]',
  example: '내포인트 \n 내포인트 ',
}

exports.conf = {
  aliases: ['포인트', '코인', '머니', '크래딧'],
  cooldown: 5,
}
