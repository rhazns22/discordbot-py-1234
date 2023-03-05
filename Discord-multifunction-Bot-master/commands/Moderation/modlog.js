const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
    if (!message.member.permissions.any(["MANAGE_GUILD", "ADMINISTRATOR"])) {
        return message.channel.send("당신은 권한이 없습니다");
    }

    let toggling = ["비활성화", "활성화"];
    if (!toggling.includes(args[0])) {
        return message.channel.send("로그를 끄려면 **비활성화** 로그를 키려면 **활성화** 를 적어주세요");
    }

    if (args[0] === "활성화") {
        let channel = message.mentions.channels.first();
        if (!channel) return message.channel.send("로그를 남길 채널을 멘션해주세요");

        await db.set(`moderation.${message.guild.id}.modlog.toggle`, true);
        await db.set(`moderation.${message.guild.id}.modlog.channel`, channel.id);
        return message.channel.send(`로그가 활성화 되었습니다. <#${channel.id}>`);
    }

    if (args[0] === "비활성화") {
        let toggle = db.get(`moderation.${message.guild.id}.modlog.toggle`);
        if (!toggle || toggle == false) return message.channel.send("로그는 이미 비활성화 되있습니다.");
        await db.set(`moderation.${message.guild.id}.modlog.toggle`, false);
        await db.delete(`moderation.${message.guild.id}.modlog.channel`);
        return message.channel.send("로그가 비활설화 되었습니다.");
    }
}

exports.help = {
    name: "로그",
    description: "변경/생성 등 업데이트를 알려줍니다.",
    usage: "로그 <비활성화 | 활성화> <#채널>",
    example: "로그 활성화 #로그채널 \n로그 비활성화"
};

exports.conf = {
    aliases: ["안티로그"],
    cooldown: 8
}
