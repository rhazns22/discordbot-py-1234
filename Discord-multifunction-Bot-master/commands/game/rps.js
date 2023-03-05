const Discord = require('discord.js');
const { promptMessage } = require("../../functions.js");
const db = require("quick.db");
const ms = require("parse-ms");

const chooseArr = ["✊", "🖐️", "✌️"];

exports.run = async (client, message, args) => {

    if (message.channel.id !== "803964960068599869") {
        message.delete()
        return message.reply("가위바위보 가능한 채널이 아닙니다!")
    }

    const amount = parseInt(args[0]);
    const balance = db.get(`account.${message.author.id}.balance`);

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
        .setColor("#ffffff")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
        .setDescription("이 이모티콘 중 하나에 반응을 추가하여 게임을 플레이하세요!")
        .setTimestamp();

    const m = await message.channel.send(embed);
    const reacted = await promptMessage(m, message.author, 30, chooseArr);

    const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

    const result = await getResult(reacted, botChoice);
    await m.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))

    embed
        .setDescription("")
        .addField(result, `${reacted} vs ${botChoice}`);

    m.edit(embed);

    function getResult(me, clientChosen) {
        if ((me === "✊" && clientChosen === "✌️") ||
            (me === "🖐️" && clientChosen === "✊") ||
            (me === "✌️" && clientChosen === "🖐️")) {
            db.set(`lastGamble.${message.author.id}`, Date.now());
            db.add(`account.${message.author.id}.balance`, amount);
            return "당신이 승리하셨습니다!";
        } else if (me === clientChosen) {
            db.set(`lastGamble.${message.author.id}`, Date.now());
            return "비겼습니다!";
        } else {
            db.set(`lastGamble.${message.author.id}`, Date.now());
            db.subtract(`account.${message.author.id}.balance`, amount);
            return "당신은 패배하셨습니다 ㅠㅠ";
        }
    }
}


exports.help = {
    name: "도전",
    description: "가위바위보하기",
    usage: "도전 <배팅>",
    example: "도전 100"
};

exports.conf = {
    aliases: ["호우"],
    cooldown: 5
}
