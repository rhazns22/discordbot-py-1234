const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {

    if (message.channel.id !== "765854593162281001") {
        message.delete()
        return message.reply("이름표 착용가능한 채널이 아닙니다!")
    }

    let member;
    if (message.mentions.users.first()) {
        member = message.mentions.users.first();
    } else {
        member = message.author;
    }

    let toggling = ["핑크색", "빨간색", "파란색", "노란색", "초록색"];
    if (!toggling.includes(args[0])) {
        return message.channel.send("구매하실 색이름표를 적어주세요");
    }

    pi = message.guild.roles.cache.get("765850662135005234");
    re = message.guild.roles.cache.get("765850341828460587");
    bl = message.guild.roles.cache.get("765850573160448041");
    ye = message.guild.roles.cache.get("765850433909948416");
    gr = message.guild.roles.cache.get("765850517662203914");

    if (args[0] === "핑크색") {
        p = db.get(`color.${member.id}.pink`)
        if (!p) return message.reply("핑크색을 구매하시지 않았습니다!")
        message.member.roles.add(pi);
        message.member.roles.remove(re);
        message.member.roles.remove(bl);
        message.member.roles.remove(ye);
        message.member.roles.remove(gr);
        pink = new Discord.MessageEmbed()
        .setColor("PINK")
        .setDescription(`${member}님께서 ${pi} 를 착용하셨어요!`)
        message.channel.send(pink)
    }

    if (args[0] === "빨간색") {
        r = db.get(`color.${member.id}.red`)
        if (!r) return message.reply("빨강색을 구매하시지 않았습니다!")
        message.member.roles.remove(pi);
        message.member.roles.add(re);
        message.member.roles.remove(bl);
        message.member.roles.remove(ye);
        message.member.roles.remove(gr);
        red = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(`${member}님께서 ${re} 를 착용하셨어요!`)
        message.channel.send(red)
    }

    if (args[0] === "파란색") {
        b = db.get(`color.${member.id}.blue`)
        if (!b) return message.reply("파란색을 구매하시지 않았습니다!")
        message.member.roles.remove(pi);
        message.member.roles.remove(re);
        message.member.roles.add(bl);
        message.member.roles.remove(ye);
        message.member.roles.remove(gr);
        blue = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setDescription(`${member}님께서 ${bl} 를 착용하셨어요!`)
        message.channel.send(blue)
    }

    if (args[0] === "노란색") {
        y = db.get(`color.${member.id}.yellow`)
        if (!y) return message.reply("노란색을 구매하시지 않았습니다!")
        message.member.roles.remove(pi);
        message.member.roles.remove(re);
        message.member.roles.remove(bl);
        message.member.roles.add(ye);
        message.member.roles.remove(gr);
        yellow = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setDescription(`${member}님께서 ${ye} 를 착용하셨어요!`)
        message.channel.send(yellow)
    }

    if (args[0] === "초록색") {
        g = db.get(`color.${member.id}.green`)
        if (!g) return message.reply("초록색을 구매하시지 않았습니다!")
        message.member.roles.remove(pi);
        message.member.roles.remove(re);
        message.member.roles.remove(bl);
        message.member.roles.remove(ye);
        message.member.roles.add(gr);
        green = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setDescription(`${member}님께서 ${gr} 를 착용하셨어요!`)
        message.channel.send(green)
    }
}

exports.help = {
    name: "착용",
    description: "구매하신 색이름표를 착용하실수있습니다",
    usage: "착용 <색이름>",
    example: "착용 빨강색"
}

exports.conf = {
    aliases: ["색이름표"],
    cooldown: 10
}
