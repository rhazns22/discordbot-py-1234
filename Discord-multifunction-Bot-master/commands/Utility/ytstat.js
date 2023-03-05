const fetch = require("node-superfetch"); // npm install node-superfetch
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    let name = args.join(" ");
    if (!name) return message.channel.send("검색하신 채널이 없습니다.");

    const channel = await fetch.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${name}&key=${client.config.google}&maxResults=1&type=channel`)
    .catch(() => message.channel.send("검색하신 채널이 없습니다."));

    if (!channel.body.items[0]) return message.channel.send("No channel result. Try again.");

    const data = await fetch.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&id=${channel.body.items[0].id.channelId}&key=${client.config.google}`)
    .catch(() => message.channel.send("검색하신 채널이 없습니다."));

    const embed = new Discord.MessageEmbed()
    .setColor(0x7289DA)
    .setThumbnail(channel.body.items[0].snippet.thumbnails.high.url)
    .setTimestamp(new Date())
    .addField("채널 이름", channel.body.items[0].snippet.channelTitle, true)
    .addField("채널 설명", channel.body.items[0].snippet.description, true)
    .addField("구독자", parseInt(data.body.items[0].statistics.subscriberCount).toLocaleString(), true)
    .addField("전체 조회수", parseInt(data.body.items[0].statistics.viewCount).toLocaleString(), true)
    .addField("젠체 동영상", parseInt(data.body.items[0].statistics.videoCount).toLocaleString(), true)
    .addField("생성 날자", new Date(channel.body.items[0].snippet.publishedAt).toDateString(), true)
    .addField("링크", `[${channel.body.items[0].snippet.channelTitle}](https://www.youtube.com/channel/${channel.body.items[0].id.channelId})`, true)
    return message.channel.send(embed);
}

exports.help = {
    name: "유튜브",
    description: "유튜브정보를 보여줍니다."
}

exports.conf = {
    aliases: ["유튜브"],
    cooldown: 10
}
