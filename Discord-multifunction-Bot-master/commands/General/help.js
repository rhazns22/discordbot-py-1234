const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  let prefix = client.config.prefix;
  
  if (!args[0]) {
    // This will turn the folder (category) into array.
    let module = client.helps.array();
    
    // This will hide a folder from display that includes "hide: true" in their module.json
    if (!client.config.owners.includes(message.author.id)) module = client.helps.array().filter(x => !x.hide);
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setThumbnail("https://cdn.discordapp.com/avatars/712997983037423616/c86ddc1dee1e7cbf58a582e2ac472e16.webp?size=4096")
    .setTimestamp(new Date())
    .setDescription(`\`${prefix}도움말 [명령어]\` 명령어를 구체적이게 볼수있습니다.`)
    .setTitle("관리봇")
    
    for (const mod of module) {
      // You can change the .join(" | ") to commas, dots or every symbol.
      embed.addField(`${mod.name}`, mod.cmds.map(x => `\`${x}\``).join(" | "));
    }
    
    return message.channel.send(embed);
  } else {
    let cmd = args[0];
    
    // If the user type the [command], also with the aliases.
    if (client.commands.has(cmd) || client.commands.get(client.aliases.get(cmd))) {
      let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
      let name = command.help.name; // The command name.
      let desc = command.help.description; // The command description.
      let cooldown = command.conf.cooldown + " 초(s)"; // The command cooldown.
      let aliases = command.conf.aliases.join(", ") ? command.conf.aliases.join(", ") : "명칭이 없습니다.";
      let usage = command.help.usage ? command.help.usage : "사용법이 없습니다.";
      let example = command.help.example ? command.help.example : "예시가 없습니다.";
      
      let embed = new Discord.MessageEmbed()
      .setColor(0x7289DA)
      .setTitle(name)
      .setDescription(desc)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter("[] = 선택 사항, <> =  필수, 명령어을 입력할때 앞 기호들은 포함하지 말아주세요!")
      .addField("쿨타임", cooldown)
      .addField("명칭", aliases, true)
      .addField("사용법", usage, true)
      .addField("예시", example, true)
      
      return message.channel.send(embed);
    } else {
      // If the user type the wrong command.
      return message.channel.send({embed: {color: "RED", description: "없는 명령어입니다!"}});
    }
  }
}

exports.help = {
  name: "도움말",
  description: "모든 명령어를 보여줍니다.",
  usage: "!도움말 [명령어]",
  example: "!도움말 별명변경"
}

exports.conf = {
  aliases: ["?"],
  cooldown: 5
}
