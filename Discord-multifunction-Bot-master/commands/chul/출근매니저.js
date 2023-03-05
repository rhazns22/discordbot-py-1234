const discord = require('discord.js')
const db = require('quick.db')
let ms = require('parse-ms')

exports.run = async (client, message, args) => {
  if (message.channel.id !== '803965834170073153') {
    message.reply('출퇴근가능한 채널이 아닙니다.')
    return
  }

  const text = args[0]
  if (!text) return message.reply(`상태를 적어주세요! \`출근\` | \`퇴근\``)

  const tr = db.get(`chul.${message.author.id}`)
  let cooldown = 43200000 // 43200000
  let pad_zero = (num) => (num < 10 ? '0' : '') + num
  let lastchul = await db.get(`lastchul.${message.author.id}`)

  if (text == '퇴근') {
    if (tr === false) return message.reply('당신은 이미 출근상태입니다!')
    db.set(`chuls.${message.author.id}`, false)
    db.subtract(`chulss.${message.guild.id}.manager`, 1)
    const embed = new discord.MessageEmbed()
      .setColor('#FE2EF7')
      .setTitle(' 관리자 퇴근')
      .setDescription(`<@${message.author.id}> 님이 퇴근하셨습니다.`)
      .addField('닉네임', '```' + message.author.username + '```', true)
      .addField('아이디', '```' + message.author.id + '```', true)
      .addField('직급', '```매니저```', true)
      .addField('출퇴근 목록 확인하기', '```은이야 상태 목록```')
    message.channel.send(embed)
  }

  try {
    if (lastchul !== null && cooldown - (Date.now() - lastchul) > 0) {
      let timeObj = ms(cooldown - (Date.now() - lastchul))

      let hours = pad_zero(timeObj.hours).padStart(2, '0'),
        mins = pad_zero(timeObj.minutes).padStart(2, '0'),
        secs = pad_zero(timeObj.seconds).padStart(2, '0')

      let finalTime = `${hours}시간${mins}분${secs}초`
      embed = new discord.MessageEmbed()
        .setColor('#00FBFF')
        .setTitle('[] 출근')
        .setDescription(
          `<@${message.author.id}>님은 이미 출근을 한 상태입니다.`,
        )
        .addField('남은시간', '```' + finalTime + '```')
        // .setImage(user.displayAvatarURL({size: 4096, dynamic: true}))
        .setFooter('SHOP')
      return message.channel.send(embed)
    } else {
      if (text == '출근') {
        if (tr === true) return message.reply('당신은 이미 출근상태입니다!')
        db.set(`chuls.${message.author.id}`, true)
        db.add(`chulss.${message.guild.id}.manager`, 1)
        db.add(`chul.${message.author.id}`, 1)
        const embed = new discord.MessageEmbed()
          .setColor('#FE2EF7')
          .setTitle(' 출근')
          .setDescription(`<@${message.author.id}> 님이 출근하셨습니다.`)
          .addField('닉네임', '```' + message.author.username + '```', true)
          .addField('아이디', '```' + message.author.id + '```', true)
          .addField('직급', '```매니저```', true)
          .addField('출퇴근 목록 확인하기', '```상태 목록```')
        message.channel.send(embed)
      }
    }
  } catch (error) {
    console.log(error)
    return message.channel.send(`알수없는 오류: ${error}`)
  }

  return
}

exports.help = {
  name: '매니저',
  description: '관리자, 매니저 출퇴근 명령어',
}

exports.conf = {
  aliases: [],
  cooldown: 0,
}
