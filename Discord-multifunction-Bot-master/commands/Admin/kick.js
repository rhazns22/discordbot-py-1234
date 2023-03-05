const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("권한이  없습니다.");
 
    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("권한없음");
 
    if (!args[0]) return message.reply("지정된 사용자가 없습니다.");
 
    if (!args[1]) return message.reply("사유를 적어주세요.");
 
    var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
 
    var reason = args.slice(1).join(" ");
 
    if (!kickUser) return message.reply("사용자를 찾을 수 없습니다.");
 
    var embed = new discord.MessageEmbed()
        .setColor("#ff0000")
        .setThumbnail(kickUser.user.displayAvatarURL)
        .setFooter(message.member.displayName, message.author.displayAvatarURL)
        .setTimestamp()
        .setDescription(`** 대상자: ** ${kickUser} (${kickUser.id})
        **관리자: ** ${message.author}
        **사유: ** ${reason}`);
 
    var embedPrompt = new discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor("30초 이내에 선택해주세요")
        .setDescription(`${kickUser}사용자를 킥하실건가요?`);
 
 
    message.channel.send(embedPrompt).then(async msg => {
 
        var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
 
        if (emoji === "✅") {
 
            msg.delete();

            kickUser.kick(reason).catch(err => {
                if (err) return message.channel.send(`사용자를 킥하였습니다`);
            });
 
            message.reply(embed);
 
        } else if (emoji === "❌") {
 
            msg.delete();
 
            message.reply("사용자를 킥하지 않았습니다").then(m => m.delete(5000));
 
        }
 
    });   
}

async function promptMessage(message, author, time, reactions){

    time *= 1000;

    for(const reaction of reactions){
        await message.react(reaction);
    }

    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    return message.awaitReactions(filter, {max:1, time: time}).then(collected => collected.first() && collected.first().emoji.name);

}

exports.help = {
  name: "킥",
  description: "서버에서 킥해줍니다.!",
  usage: "킥 <@유저> <사유>",
  example: "킥 @우진#2222 테스트"
};

exports.conf = {
  aliases: ["킥"],
  cooldown: 5
}
