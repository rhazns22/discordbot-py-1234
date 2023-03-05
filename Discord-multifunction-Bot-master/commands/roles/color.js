const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
    if (message.channel.id !== "765854611898368040") {
        message.delete()
        return message.reply(`이름표리스트는 <#765854611898368040> 해당채널에서 확인해주세요!`)
    }

    pi = message.guild.roles.cache.get("765850662135005234");
    re = message.guild.roles.cache.get("765850341828460587");
    bl = message.guild.roles.cache.get("765850573160448041");
    ye = message.guild.roles.cache.get("765850433909948416");
    gr = message.guild.roles.cache.get("765850517662203914");

    prefix = client.config.prefix;

    embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setTitle("이름표리스트")
    .setDescription("이름표를 구매하고싶다면 밑 명령어를 쳐주세요! 모든 가격: 100 포인트")
    .addField(prefix + " 구매 핑크색", `이름의 색상을 ${pi}으로 변경할 수 있습니다.`)
    .addField(prefix + " 구매 빨간색", `이름의 색상을 ${re}으로 변경할 수 있습니다.`)
    .addField(prefix + " 구매 파란색", `이름의 색상을 ${bl}으로 변경할 수 있습니다.`)
    .addField(prefix + " 구매 노란색", `이름의 색상을 ${ye}으로 변경할 수 있습니다.`)
    .addField(prefix + " 구매 초록색", `이름의 색상을 ${gr}으로 변경할 수 있습니다.`)
    .addField(prefix + " 색제거", "착용중인 색상을 제거합니다.")
    .setFooter("사용해주셔서 감사합니다")
    message.channel.send(embed);
}

exports.help = {
    name: "이름표리스트",
    description: "구매하고싶은 이름표리스트를 볼 수 있습니다.",
    usage: "이름표리스트",
    example: "이름표리스트"
}

exports.conf = {
    aliases: ["색이름표"],
    cooldown: 10
}
