const Discord = require('discord.js')
const db = require('quick.db')

exports.run = async (client, message, args) => {
  if (message.author.id === '803964960068599869') {
    const amount = parseInt(args[1])
    if (!amount) return message.channel.send('포인트을 입력해주세요.')
    if (isNaN(amount)) return message.channel.send('포인트는 숫자만 가능합니다')

    let user = message.mentions.users.first()

    db.add(`account.${user.id}.balance`, amount)

    const embed = new Discord.MessageEmbed()
      .setTitle('포인트 권한지급')
      .setDescription(`${user} 님에게 ${amount}포인트를 지급했습니다.`)
    message.channel.send(embed)
  } else {
    message.reply('당신은 OO이가 아닙니다 명령을 거부합니다.')
  }
}

exports.help = {
  name: '지급',
  description: 'OO이만 사용할 수 있습니다.',
  usage: '지급 <지급포인트>',
  example: '지급 1000',
}

exports.conf = {
  aliases: ['ㅈㄱ'],
  cooldown: 5,
}
