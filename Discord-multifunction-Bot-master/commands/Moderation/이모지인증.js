const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
    if (!message.member.permissions.any(["MANAGE_GUILD", "ADMINISTRATOR"])) {
        return message.channel.send("당신은 권한이 없습니다");
    }

    let toggling = ["인증채널지정", "인증역할지정", "미인증역할제거", "메시지설정", "임배드설정", "보내기"];
    if (!toggling.includes(args[0])) {
        return message.channel.send("채널을 지정하려면 `인증채널지정` 역할을 지정하려면 `인증역할지정` 를 적어주세요 \n인증시 미인증역할을 제거하고싶다면 `미인증역할제거` 를 적어주세요!\n일반 메시지인증을 설정하려면 `메시지설정 <메시지>` | 임배드인증을 설정하려면 `임배드설정 <메시지>` 를 적어주세요!\n인증메시지를 보내고싶다면 `보내기`를 해주세요!");
    }

    if (args[0] === "인증채널지정") {
        let channel = message.mentions.channels.first();
        if (!channel) return message.reply("인증채널을 멘션해주세요!");
        await db.set(`inzungs.${message.guild.id}.channel`, channel.id);
        await db.set(`roledels.${message.guild.id}`, false);
        return message.reply(`인증채널이 지정되었습니다. <#${channel.id}>`);
    }

    if (args[0] === "인증역할지정") {
        let role = message.mentions.roles.first();
        if (!role) return message.reply("로그를 남길 채널을 멘션해주세요");
        await db.set(`inzungs.${message.guild.id}.role`, role.id);
        return message.reply(`역할지정이 되었습니다. <@${role.id}>`);
    }

    if (args[0] === "미인증역할제거") {
        let toggling = ["활성화", "비활성화"];
        if (!toggling.includes(args[1])) {
            return message.channel.send("미인증제거를 활성화하려면 `활성화 @역할` | 비활성화하려면 `비활성화` 를 적어주세요!");
        }
        if (args[1] === "활성화") {
            let role = message.mentions.roles.first();
            if (!role) return message.reply("제거할 미인증역할을 멘션해주세요");
            await db.set(`roledels.${message.guild.id}`, true);
            await db.set(`inzungs.${message.guild.id}.rerole`, role.id);
            message.reply(`인증시 역할지정된 역할 지급후 미인증역할을 제거합니다.`)
        }
        if (args[1] === "비활성화") {
            await db.set(`roledels.${message.guild.id}`, false);
            message.reply(`비활성화 되었습니다.`)
        }
    }

    if (args[0] === "메시지설정") {
        const text = message.content.split(' ').slice(3).join(' ');
        if (!text) return message.reply("이모지인증메시지를 적어주세요!")
        await db.set(`emojis.${message.guild.id}`, true);
        await db.set(`emojiembeds.${message.guild.id}`, false);
        await db.set(`emoji.${message.guild.id}`, text);
        message.reply(`메시지설정이 완료되었습니다 설정된메시지: \`${text}\``)
    }

    if (args[0] === "임배드설정") {
        const text = message.content.split(' ').slice(3).join(' ');
        if (!text) return message.reply("이모지인증메시지를 적어주세요!")
        await db.set(`emojiembeds.${message.guild.id}`, true);
        await db.set(`emojis.${message.guild.id}`, false);
        await db.set(`emojiembed.${message.guild.id}`, text);
        message.reply(`임배드설정이 완료되었습니다 설정된메시지: \`${text}\``)
    }

    if (args[0] === "보내기") {
        const message1 = db.get(`emojiembeds.${message.guild.id}`);
        const message2 = db.get(`emojis.${message.guild.id}`);
        const messages1 = db.get(`emojiembed.${message.guild.id}`);
        const messages2 = db.get(`emoji.${message.guild.id}`);
        if (message1 === true) {
            const channel = db.get(`inzungs.${message.guild.id}.channel`);
            const channels = client.channels.cache.get(channel)
            let msgEM = await channels.send({ embed: { color: "GREEN", description: messages1 } })
            msgEM.react('✅')
        }
        if (message2 === true) {
            const channel = db.get(`inzungs.${message.guild.id}.channel`);
            const channels = client.channels.cache.get(channel)
            let msgEM = await channels.send(messages2)
            msgEM.react('✅')
        }
    }
}

exports.help = {
    name: "이모지인증설정",
    description: "",
    usage: "인증설정 <채널지정 | 역할지정> <@역할/#채널>",
    example: "인증설정 채널지정 #채널 / 인증설정 역할지정 @역할"
};

exports.conf = {
    aliases: ["이모지"],
    cooldown: 0
}
