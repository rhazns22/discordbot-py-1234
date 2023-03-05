const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
    if (message.channel.id !== "765854566339051541") {
        message.delete()
        return message.reply("이름표 구매가능한 채널이 아닙니다!")
    }

    let member;
    if (message.mentions.users.first()) {
        member = message.mentions.users.first();
    } else {
        member = message.author;
    }

    const amount = 100;
    let buck = await db.get(`account.${message.author.id}.balance`);
    if (!buck) buck = 0;
    else buck = buck;
    if (amount > buck || !buck || buck === 0) return message.channel.send("포인트가 충분하지 않습니다.");

    let toggling = ["핑크색", "빨간색", "파란색", "노란색", "초록색"];
    if (!toggling.includes(args[0])) {
        return message.channel.send("구매하실 색이름표를 적어주세요");
    }

    if (args[0] === "핑크색") {
        pi = message.guild.roles.cache.get("765850662135005234");
        buyed = db.get(`color.${message.author.id}.pink`);
        if (buyed == true) return message.reply(`이미 ${pi} 을 가지고 계십니다!`)
        await db.subtract(`account.${message.author.id}.balance`, amount);
        db.set(`color.${message.author.id}.pink`, true)
        pink = new Discord.MessageEmbed()
            .setColor("PINK")
            .setDescription(`${member}님께서 ${pi} 를 구매하셨어요!`)
        message.channel.send(pink)
    }

    if (args[0] === "빨간색") {
        re = message.guild.roles.cache.get("765850341828460587");
        buyed = db.get(`color.${message.author.id}.red`);
        if (buyed == true) return message.reply(`이미 ${re} 을 가지고 계십니다!`)
        await db.subtract(`account.${message.author.id}.balance`, amount);
        db.set(`color.${message.author.id}.red`, true)
        red = new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(`${member}님께서 ${re} 를 구매하셨어요!`)
        message.channel.send(red)
    }

    if (args[0] === "파란색") {
        bl = message.guild.roles.cache.get("765850573160448041");
        buyed = db.get(`color.${message.author.id}.blue`);
        if (buyed == true) return message.reply(`이미 ${bl} 을 가지고 계십니다!`)
        await db.subtract(`account.${message.author.id}.balance`, amount);
        db.set(`color.${message.author.id}.blue`, true)
        blue = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setDescription(`${member}님께서 ${bl} 를 구매하셨어요!`)
        message.channel.send(blue)
    }

    if (args[0] === "노란색") {
        ye = message.guild.roles.cache.get("765850433909948416");
        buyed = db.get(`color.${message.author.id}.yellow`);
        if (buyed == true) return message.reply(`이미 ${ye} 을 가지고 계십니다!`)
        await db.subtract(`account.${message.author.id}.balance`, amount);
        db.set(`color.${message.author.id}.yellow`, true)
        yellow = new Discord.MessageEmbed()
            .setColor("YELLOW")
            .setDescription(`${member}님께서 ${ye} 를 구매하셨어요!`)
        message.channel.send(yellow)
    }

    if (args[0] === "초록색") {
        gr = message.guild.roles.cache.get("765850517662203914");
        buyed = db.get(`color.${message.author.id}.green`);
        if (buyed == true) return message.reply(`이미 ${gr} 을 가지고 계십니다!`)
        await db.subtract(`account.${message.author.id}.balance`, amount);
        db.set(`color.${message.author.id}.green`, true)
        green = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setDescription(`${member}님께서 ${gr} 를 구매하셨어요!`)
        message.channel.send(green)
    }
}

exports.help = {
    name: "구매",
    description: "이름표색을 구매하실수있습니다.",
    usage: "구매 <색이름>",
    example: "구매 빨강색"
}

exports.conf = {
    aliases: ["색이름표"],
    cooldown: 10
}
