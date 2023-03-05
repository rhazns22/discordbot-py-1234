const ms = require("ms");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.any(["ADMINISTRATOR", "MANAGE_CHANNELS"])) {
    return message.channel.send("당신은 권한이 없습니다.");
  }
  
  let channel = message.mentions.channels.first(),
      time = args.slice(1).join(" ");
  
  if (!channel) time = args.join(" "), channel = message.channel;
  // If the user doesn't includes the channel.
  
  if (message.flags[0] === "종료") {
    channel.setRateLimitPerUser(0);
    return message.channel.send(`<#${channel.id}> 슬로우가 비활성화되었습니다.`);
  }
  
  if (!time) return message.channel.send("시간을 적어주세요 ex)5초 = 5s 1시간 = 1hrs");
  
  let convert = ms(time); // This will results the milliseconds.
  let toSecond = Math.floor(convert / 1000); // This will convert the ms to s. (seconds)
  
  if (!toSecond || toSecond == undefined) return message.channel.send("형식이 알맞지 않습니다. 형식을 다시 적어주세요! ex)5초 = 5s 1시간 = 1hrs");
  
  if (toSecond > 21600) return message.channel.send("타이머는 6시간 이하만 가능합니다.");
  else if (toSecond < 1) return message.channel.send("타이머는 1초 이상 이여야 합니다.");
  
  await channel.setRateLimitPerUser(toSecond);
  return message.channel.send(`슬로우된 채널: <#${channel.id}> 슬로우 시간: **${ms(ms(time), {long: true})}**.`);
}

exports.help = {
  name: "슬로우",
  description: "채널의 채팅에 슬로우를 추가합니다.",
  usage: "슬로우 [채널] <시간>",
  example: "슬로우 #일반 5s \n슬로우 5.25 hrs"
}

exports.conf = {
  aliases: ["슬로우"],
  cooldown: 10
}
