const Discord = require('discord.js')
const db = require('quick.db')
let ms = require('parse-ms')

exports.run = async (client, message, args) => {
  if (message.channel.id !== '765858560801243137') {
    message.delete()
    return message.reply('출석 가능한 채널이 아닙니다!')
  }

  let pad_zero = (num) => (num < 10 ? '0' : '') + num
  let cooldown = 8.64e7 // 24 Hours in ms. 8.64e+7
  let amount = 500 // How much user will get it in their dailies.

  const prefix = client.config.prefix

  let user
  if (message.mentions.users.first()) {
    user = message.mentions.users.first()
  } else if (args[0]) {
    user = message.guild.members.cache.get(args[0]).user
  } else {
    user = message.author
  }

  let lastDaily = await db.get(`lastDaily.${message.author.id}`)
  let buck = await db.get(`account.${message.author.id}.balance`)
  if (!buck) buck = 0
  else buck = buck

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  try {
    if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
      let timeObj = ms(cooldown - (Date.now() - lastDaily))

      let hours = pad_zero(timeObj.hours).padStart(2, '0'),
        mins = pad_zero(timeObj.minutes).padStart(2, '0'),
        secs = pad_zero(timeObj.seconds).padStart(2, '0')

      let finalTime = `${hours}시간${mins}분${secs}초`
      embed = new Discord.MessageEmbed()
        .setColor('#00FBFF')
        .setTitle('[LEEDU] 출석체크는 이미완려되어있습니다!')
        .setDescription(`${user}님은 이미 출석을 한 상태입니다.`)
        .addField('남은시간', '```' + finalTime + '```')
        // .setImage(user.displayAvatarURL({size: 4096, dynamic: true}))
        .setFooter('')
      return message.channel.send(embed)
    } else {
      await db.set(`lastDaily.${message.author.id}`, Date.now())
      await db.add(`account.${message.author.id}.balance`, amount)
      await sleep(2000)
      embed2 = new Discord.MessageEmbed()
        .setColor('#00FBFF')
        .setTitle(' 출석체크 완료')
        .setDescription(
          `<@${message.author.id}>님! 출석 체크가 완료되었어요!` +
            '```' +
            (buck + amount).toLocaleString() +
            '```',
        )
        // .setImage(user.displayAvatarURL({size: 4096, dynamic: true}))
        .setFooter('')
      return message.channel.send(embed2)
    }
  } catch (error) {
    console.log(error)
    return message.channel.send(`알수없는 오류: ${error}`)
  }
}

exports.help = {
  name: '출석',
  description: '출석을해 포인트를 받으세요',
}

exports.conf = {
  aliases: ['ㅊㅅ'],
  cooldown: 10,
}
