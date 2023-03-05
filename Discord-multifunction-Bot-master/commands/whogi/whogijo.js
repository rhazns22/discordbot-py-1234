const Discord = require('discord.js');
const fs = require("fs");
const Database = require("./Helpers/Database");
// const db = require("quick.db");
// const whogis = new db.table('whogis');

exports.run = async (client, message, args) => {

  const User = message.guild.member(message.mentions.users.first() || message.author );

  const db = new Database("./Servers/" + message.guild.id, "Whogis");

  const whogi = db.get(`whogi.${User.id}`) || 0;
  const star = db.get(`star.${User.id}`) || 0;

  const embed = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setDescription(`${User}님의 후기 개수는 ${whogi}개 평점 개수는 ${star}개 입니다`)
  message.channel.send(embed);
}

exports.help = {
  name: "후기조회",
  description: "후기조회하기",
  usage: "후기조회 (@멘션)",
  example: "후기조회 (@멘션)"
};

exports.conf = {
  aliases: ["ㅈㅎ"],
  cooldown: 5
}
