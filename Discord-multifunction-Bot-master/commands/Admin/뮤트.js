const Discord = require('discord.js');
const ms = require("ms");

exports.run = async (client, message, args) => {

    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("권한이 없습니다.");

    if (!args[0]) return message.reply("지정된 사용자가 없습니다.");
 
    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("멘션하신 유저는 권한이 강력하여 뮤트할 수 없습니다.");
 
    var mutePerson = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
 
    if (!mutePerson) return message.reply("사용자를 찾을 수 없습니다.");

    if(mutePerson.hasPermission("MANAGE_MESSAGES")) return message.reply("권한이 강력하여 사용자를 뮤트시킬 수 없습니다.");

    var muteRole = message.guild.roles.cache.get("750237982514085980");
    if(!muteRole) return message.channel.send("뮤트된 역할이 업습니다.");

    var user = message.guild.roles.cache.get("724871325650518077");
    if(!user) return message.channel.send("시민역할이 없습니다..");

    var muteTime = args[1];

    if(!muteTime) return message.channel.send("지정된 시간이 없습니다");

    await(mutePerson.roles.remove(user.id));
    await(mutePerson.roles.add(muteRole.id));
    message.channel.send(`${mutePerson}님이 뮤트되었습니다 남은시간: ${muteTime}`);

    setTimeout(() =>{

        mutePerson.roles.remove(muteRole.id);
        mutePerson.roles.add(user.id);

        message.channel.send(`${mutePerson} 뮤트해제 되었습니다`);

    },ms(muteTime));

}

exports.help = {
  name: "뮤트",
  description: "지정한 유저를 뮤트시킵니다",
  usage: "뮤트 <유저멘션> 뮤트시간",
  example: "뮤트 @이은이 60"
};

exports.conf = {
  aliases: ["뮤트"],
  cooldown: 5
}
