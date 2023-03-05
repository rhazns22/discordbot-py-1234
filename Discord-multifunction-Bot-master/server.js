const Discord = require("discord.js");
const tutorialBot = require("./handler/ClientBuilder.js"); // We're gonna create this soon.
const client = new tutorialBot({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
const db = require("quick.db");

require("./handler/module.js")(client);
require("./handler/Event.js")(client);

client.package = require("./package.json");
client.on("warn", console.warn); // This will warn you via logs if there was something wrong with your bot.
client.on("error", console.error); // This will send you an error message via logs if there was something missing with your coding.
client.login("MTA4MTcyNTYwNjk3MjEwMDY4OQ.G5X3bd.loQjMNzQImby9kVo9Uvbte_dlHHAAKOsZV3hts").catch(console.error); // This token will leads to the .env file. It's safe in there.

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    const channel = db.get(`inzungs.${reaction.message.guild.id}.channel`);
    if (!channel) return message.reply("채널지정을 해주세요!");
    const role = db.get(`inzungs.${reaction.message.guild.id}.role`);
    if (!role) return message.reply("역할지정을 해주세요!");
    const delrole = db.get(`inzungs.${reaction.message.guild.id}.rerole`);
    const del = db.get(`roledels.${reaction.message.guild.id}`);

    if (reaction.message.channel.id === channel) {
        if (reaction.emoji.name === '✅') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(role)
            if (del === true) {
                await reaction.message.guild.members.cache.get(user.id).roles.remove(delrole)
            }
        }
    }

    if (reaction.message.channel.id === "777003250809307156") {
        if (reaction.emoji.name === '✅') {
            reaction.message.guild.channels.create('문의 카테고리', { type: 'category' }, [{
                id: reaction.message.guild.id,
                deny: ['CONNECT']
            }]).then(chan => {
                chan.setPosition(0)
                reaction.message.guild.channels.create(user.username.toLowerCase() + "-" + "티켓", { type: 'channel' }, [{
                    id: reaction.message.guild.id,
                    deny: ['CONNECT']
                }]).then(async channel5 => {
                    channel5.updateOverwrite(user.id, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    });
                    channel5.updateOverwrite(reaction.message.guild.roles.cache.find(x => x.name === '@everyone'), {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false
                    });
                    channel5.setParent(chan.id)
                    var embedParent = new Discord.MessageEmbed()
                        .setTitle(`티켓주인: ${user.username}`)
                        .setDescription("채널이 열였습니다 / 문의 채널이 열렸습니다.")
                        .setFooter("티켓을 이용해주셔서 감사합니다!");

                    var msgEM = await channel5.send(embedParent);
                    msgEM.react('🔒')
                })
            })
        }
    }
})