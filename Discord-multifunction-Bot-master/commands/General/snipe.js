const Discord = require('discord.js'),
      db = require("quick.db");

exports.run = async (client, message, args) => {
  let data = db.get(`snipe.${message.guild.id}`);
  if (!data) return message.channel.send("마지막으로 지운 메시지가 없습니다.");
  
  let content = data.content,
      user = data.user,
      channel = data.channel;
  
  const embed = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTimestamp()
  .setTitle("지워진 메시지")
  .setDescription(`삭제 된 메시지를 받았습니다. 유저: **<@${user}>** 채널: **<#${channel}>** \n> ${content}`)
  message.channel.send(embed);
}

exports.help = {
  name: "삭제",
  description: "마지막에 지운 메시지를 불러옵니다",
  usage: "삭제",
  example: "삭제"
};

exports.conf = {
  aliases: [],
  cooldown: 10
}
