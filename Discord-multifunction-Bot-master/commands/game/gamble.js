const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

exports.run = async (client, message, args) => {

    if (message.channel.id !== "803964960068599869") {
        message.delete()
        return message.reply("도박 가능한 채널이 아닙니다!")
    }

    const amount = parseInt(args[0]);
    const result = Math.floor(Math.random() * 10);
    const balance = db.get(`account.${message.author.id}.balance`);

    if (!amount) return message.channel.send("포인트을 입력해주세요.");
    if (isNaN(amount)) return message.channel.send("포인트는 숫자만 가능합니다");
    if (amount > balance || !balance || balance === 0) return message.channel.send("포인트가 충분하지 않습니다.");
    
    // Optional:
    if (amount < 50) return message.channel.send("도박 최소 포인트는 50 포인트입니다.");

    let cooldown = 5000; // 25 Seconds.
    let pad_zero = num => (num < 10 ? '0' : '') + num;
    let lastGamble = await db.get(`lastGamble.${message.author.id}`);

    if (lastGamble !== null && cooldown - (Date.now() - lastGamble) > 0) {
        let timeObj = ms(cooldown - (Date.now() - lastGamble));
        let second = pad_zero(timeObj.seconds).padStart(2, "0");
        return message.channel.send(`다시 도전하려면 **${second}** 후에 다시도전해주세요!`);
    }

    const winem = new Discord.MessageEmbed()
    .setTitle(`${message.author.username}님의 승리입니다!`)
    .addField("승/패", "``` 승리 ```", true)
    .addField("얻은포인트", "```" + amount + "```", true)
    .setColor("GREEN")
    .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)

    const loseem = new Discord.MessageEmbed()
    .setTitle(`${message.guild.me.displayName}님의 승리입니다!`)
    .addField("승/패", "``` 패배 ```", true)
    .addField("잃은포인트", "```" + amount + "```", true)
    .setColor("RED")
    .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)

    // 50:50
    if (result < 5) {
        await db.set(`lastGamble.${message.author.id}`, Date.now());
        await db.subtract(`account.${message.author.id}.balance`, amount);
        return message.channel.send(loseem);
    } else if (result > 5) {
        await db.set(`lastGamble.${message.author.id}`, Date.now());
        await db.add(`account.${message.author.id}.balance`, amount);
        return message.channel.send(winem);
    }
}

exports.help = {
    name: "도박",
    description: "진짜 도박은 아니지만 게임으로서 즐길 수있습니다.\n너무 무리해서 하지 말아주세요",
    usage: "도박 <배팅포인트>",
    example: "도박 500"
}

exports.conf = {
    aliases: ["도박"],
    cooldown: 5
}
