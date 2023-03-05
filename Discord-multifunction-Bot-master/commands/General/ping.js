const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  message.channel.send("퐁!");
}

exports.help = {
  name: "핑",
  description: "핑퐁!",
  usage: "핑",
  example: "핑"
};

exports.conf = {
  aliases: ["호우"],
  cooldown: 5
}
