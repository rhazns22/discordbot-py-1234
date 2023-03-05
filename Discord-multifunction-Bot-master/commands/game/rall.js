const Discord = require('discord.js');
const { promptMessage } = require("../../functions.js");
const db = require("quick.db");
const ms = require("parse-ms");

const chooseArr = ["✊", "🖐️", "✌️"];

exports.run = async (client, message, args) => {

    if (message.channel.id !== "803964960068599869") {
        message.delete()
        return message.reply("주사위돌리기가 가능한 채널이 아닙니다!")
    }

    let user;
    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else {
        user = message.author;
    }
    const amount = parseInt(args[0]);
    const balance = db.get(`account.${message.author.id}.balance`);
    const pl1 = random(1, 6);
    const pl2 = random(1, 6);
    const bo1 = random(1, 6);
    const bo2 = random(1, 6);
    const plto = pl1 + pl2
    const boto = bo1 + bo2
    const plarr = [];
    const boarr = [];
    plarr.push(pl1)
    plarr.push(pl2)
    boarr.push(bo1)
    boarr.push(bo2)

    if (!amount) return message.channel.send("포인트을 입력해주세요.");
    if (isNaN(amount)) return message.channel.send("포인트는 숫자만 가능합니다");
    if (amount > balance || !balance || balance === 0) return message.channel.send("포인트가 충분하지 않습니다.");

    if (amount < 50) return message.channel.send("도박 최소 포인트는 50 포인트입니다.");

    let cooldown = 5000; // 25 Seconds.
    let pad_zero = num => (num < 10 ? '0' : '') + num;
    let lastGamble = await db.get(`lastGamble.${message.author.id}`);

    if (lastGamble !== null && cooldown - (Date.now() - lastGamble) > 0) {
        let timeObj = ms(cooldown - (Date.now() - lastGamble));
        let second = pad_zero(timeObj.seconds).padStart(2, "0");
        return message.channel.send(`다시 도전하려면 **${second}** 후에 다시도전해주세요!`);
    }

    const embed = new Discord.MessageEmbed()
        .setColor("#FAFAFA")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
        .setDescription("주사위던지기를 시작합니다")
        .setTimestamp();

    const m = await message.channel.send(embed);

    const plembed = new Discord.MessageEmbed()
        .setDescription(`${user}님의 주사위입니다. 첫번째 주사위: ${pl1}`)
        .setColor("#FAFAFA")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    message.channel.send(plembed)
    const plembed2 = new Discord.MessageEmbed()
        .setDescription(`${user}님의 주사위입니다. 두번째 주사위: ${pl2}`)
        .setColor("#FAFAFA")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    message.channel.send(plembed2)

    const totalpl = new Discord.MessageEmbed()
        .setTitle(`${user.username}님의 합계입니다`)
        .setDescription(`${user}님의 합계: ${plto}`)
        .setColor("GREEN")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    message.channel.send(totalpl)


    const boembed = new Discord.MessageEmbed()
        .setDescription(`${message.guild.me}님의 주사위입니다. 첫번째 주사위: ${bo1}`)
        .setColor("#FAFAFA")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    message.channel.send(boembed)
    const boembed2 = new Discord.MessageEmbed()
        .setDescription(`${message.guild.me}님의 주사위입니다. 첫번째 주사위: ${bo2}`)
        .setColor("#FAFAFA")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    message.channel.send(boembed2)

    const totalbo = new Discord.MessageEmbed()
        .setTitle(`${message.guild.me.displayName}님의 합계입니다`)
        .setDescription(`${message.guild.me}님의 합계: ${boto}`)
        .setColor("GREEN")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    message.channel.send(totalbo)



    const winem = new Discord.MessageEmbed()
        .setTitle(`${user.username}님의 승리입니다!`)
        .setDescription(`${plto} vs ${boto} 으로 승리하셨습니다`)
        .addField("승/패", "``` 승리 ```", true)
        .addField("얻은포인트", "```" + amount + "```", true)
        .setColor("GREEN")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)

    const loseem = new Discord.MessageEmbed()
        .setTitle(`${message.guild.me.displayName}님의 승리입니다!`)
        .setDescription(`${plto} vs ${boto} 으로 패배하셨습니다`)
        .addField("승/패", "``` 패배 ```", true)
        .addField("잃은포인트", "```" + amount + "```", true)
        .setColor("RED")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)

    if (plto < boto) {
        await db.set(`lastGamble.${message.author.id}`, Date.now());
        await db.subtract(`account.${message.author.id}.balance`, amount);
        return message.channel.send(loseem);
    } else if (plto > boto) {
        await db.set(`lastGamble.${message.author.id}`, Date.now());
        await db.add(`account.${message.author.id}.balance`, amount);
        return message.channel.send(winem);
    }

}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.help = {
    name: "주사위",
    description: "주사위던지기",
    usage: "주사위 <배팅>",
    example: "주사위 100"
};

exports.conf = {
    aliases: ["호우"],
    cooldown: 5
}
