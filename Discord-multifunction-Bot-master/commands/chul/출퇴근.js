const discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  if (message.channel.id !== "767345325509705730") {
    message.reply("출퇴근가능한 채널이 아닙니다.")
    return;
  }

  await message.delete();

  const text = args[0];
  if (!text) return message.reply(`상태를 적어주세요! \`목록\``)

  if (text === "목록") {
    const admin = db.get(`chulss.${message.guild.id}.admin`) || 0;
    const manager = db.get(`chulss.${message.guild.id}.manager`) || 0;
    const embed = new discord.MessageEmbed()
    .setColor("#3ADF00")
    .setTitle("LEEDU 출퇴근 목록")
    .setDescription(`<@${message.author.id}> 님이 퇴근하셨습니다.`)
    .addField("닉네임", "```" + message.author.username + "```", true)
    .addField("아이디", "```" + message.author.id + "```", true)
    .addField("어드민출근목록", "```" + admin + "명```")
    .addField("매니저출근목록", "```" + manager + "명```", true)
    .addField("출퇴근 목록 확인하기", "```은이야 상태 목록```")
    message.channel.send(embed)
  }

  if (text === "초기화") {
    db.delete(`chul.${message.guild.id}.admin`);
    db.delete(`chul.${message.guild.id}.manager`);
    embed = new discord.MessageEmbed()
    .setDescription(`어드민/매니저 \`출근기록\` | \`퇴근기록\`이 모두 초기화되었습니다.`)
    message.channel.send(embed)
  }

  return;
}

exports.help = {
  name: "상태",
  description: "관리자, 매니저 출퇴근 상태"
}

exports.conf = {
  aliases: [],
  cooldown: 0
}