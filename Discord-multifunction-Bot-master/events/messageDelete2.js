// Choose one of them.
// Don't copy-paste it just like that.
// Learn the system first.
// Thank you. -h.

const {MessageEmbed} = require("discord.js");
const db = require("quick.db");

module.exports = async (client, message) => {
    if (message.partial) await message.fetch();
    // In before, this will help you to fetch or get the previous content since the bot get started.

    const User = message.author;

    let modlog = db.get(`moderation.${message.guild.id}.modlog`);
    if (!modlog) return;
    // Return if it's not enabled.

    if (message.channel.id === modlog.channel) return;
    // This will prevent any chaos when deleting some message inside the modlog.

    let toggle = modlog.toggle;
    if (!toggle || toggle == null || toggle == false) return;

    const embed = new MessageEmbed()
    .setTitle("메시지 삭제됨")
    .setDescription(`<#${message.channel.id}>에서  **${User.tag}** 님이 메시지를 지웠습니다. \n> ${message.content}`)
    .setTimestamp()
    .setColor(0xcc5353)

    return message.guild.channels.cache.get(modlog.channel).send(embed);
}
