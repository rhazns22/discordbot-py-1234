const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {

    if (message.channel.id !== "765855090049155092") {
        message.delete()
        return message.reply("이름표 제거가능한 채널이 아닙니다!")
    }

    let member;
    if (message.mentions.users.first()) {
        member = message.mentions.users.first();
    } else {
        member = message.author;
    }

    pi = message.guild.roles.cache.get("765850341828460587");
    re = message.guild.roles.cache.get("756721844760871004");
    bl = message.guild.roles.cache.get("765850573160448041");
    ye = message.guild.roles.cache.get("765850433909948416");
    gr = message.guild.roles.cache.get("765850517662203914");

    message.member.roles.remove(pi)
    message.member.roles.remove(re)
    message.member.roles.remove(bl)
    message.member.roles.remove(ye)
    message.member.roles.remove(gr)

    message.channel.send("> 정삭정으로 이름표의 색을 제거했습니다.")
}

exports.help = {
    name: "색제거",
    description: "착용하고있는 색을 제거합니다",
    usage: "색제거",
    example: "색제거"
}

exports.conf = {
    aliases: ["색이름표"],
    cooldown: 10
}
