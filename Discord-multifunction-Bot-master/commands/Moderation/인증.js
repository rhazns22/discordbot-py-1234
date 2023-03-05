const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
    if (!message.member.permissions.any(["MANAGE_GUILD", "ADMINISTRATOR"])) {
        return message.channel.send("당신은 권한이 없습니다");
    }

    let toggling = ["채널지정", "역할지정", "미인증제거"];
    if (!toggling.includes(args[0])) {
        return message.channel.send("채널을 지정하려면 `채널지정` 역할을 지정하려면 `역할지정` 를 적어주세요 \n인증시 미인증역할을 제거하고싶다면 `미인증제거` 를 적어주세요!");
    }

    if (args[0] === "채널지정") {
        let channel = message.mentions.channels.first();
        if (!channel) return message.reply("인증채널을 멘션해주세요!");
        await db.set(`inzung.${message.guild.id}.channel`, channel.id);
        await db.set(`roledel.${message.guild.id}`, false);
        return message.reply(`인증채널이 지정되었습니다. <#${channel.id}>`);
    }

    if (args[0] === "역할지정") {
        let role = message.mentions.roles.first();
        if (!role) return message.reply("로그를 남길 채널을 멘션해주세요");
        await db.set(`inzung.${message.guild.id}.role`, role.id);
        return message.reply(`역할지정이 되었습니다. <@${role.id}>`);
    }

    if (args[0] === "미인증제거") {
        let toggling = ["활성화", "비활성화"];
        if (!toggling.includes(args[1])) {
            return message.channel.send("미인증제거를 활성화하려면 `활성화 @역할` | 비활성화하려면 `비활성화` 를 적어주세요!");
        }
        if (args[1] === "활성화") {
            let role = message.mentions.roles.first();
            if (!role) return message.reply("제거할 미인증역할을 멘션해주세요");
            await db.set(`roledel.${message.guild.id}`, true);
            await db.set(`inzung.${message.guild.id}.rerole`, role.id);
            message.reply(`인증시 역할지정된 역할 지급후 미인증역할을 제거합니다.`)
        }
        if (args[1] === "비활성화") {
            await db.set(`roledel.${message.guild.id}`, false);
            message.reply(`비활성화 되었습니다.`)
        }
    }
}

exports.help = {
    name: "인증설정",
    description: "",
    usage: "인증설정 <채널지정 | 역할지정> <@역할/#채널>",
    example: "인증설정 채널지정 #채널 / 인증설정 역할지정 @역할"
};

exports.conf = {
    aliases: ["설정"],
    cooldown: 0
}
