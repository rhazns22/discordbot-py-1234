const Discord = require("discord.js"), cooldowns = new Discord.Collection(), db = require("quick.db");
// cooldowns will store the user when they are still in the cooldown mode.

module.exports = async (client, message) => {
  // Prevent any chit-chats with other bots, or by himself.
  if (message.author.bot || message.author === client.user) return;
  
  let prefix = client.config.prefix;
  
  // let inviteLink = ["discord.gg/", "discord.com/invite", "discordapp.com/invite"];
  
  // if (inviteLink.some(word => message.content.toLowerCase().includes(word))) {
  //   await message.delete();
  //   return message.channel.send("이곳에서 홍보는 금지입니다")
  //   .then(m => m.delete({timeout: 10000})) // Add this if you want the message automatically deleted.
  // }
  
  // Verification Site
  if (message.channel.id === "764697092517658664") { // Verification Text Channel
    // Re-send Code System
    if (message.content.startsWith("재인증")) {
      let code = db.get(`verification.${message.author.id}`);
      if (!code) code = number;
      else code = code;
      await message.delete();
      const dm = new Discord.MessageEmbed()
      .setColor(0x7289DA)
      .setTitle(`어서오세요! ${message.guild.name}!`)
      .setDescription("서버를 들어오기전 로봇이 아닌걸 인증해주세요!")
      .addField("인증채널에 코드를 입력해주세요.", `**당신의 코드:** ${code}`)
      await message.author.send(dm).catch(() => {
        return message.reply("DM기능이 차단되어있거나 개인설정되있으신거 같아요! 해제후 \`재인증\` 을 입력해주세요!")
        .then(i => i.delete({timeout: 10000}));
      })
      
      return message.reply("디엠을 확인해주세요").then(i => i.delete({timeout: 10000}));
    }
    
    // Verify System
    if (!client.config.owners.includes(message.author.id)) {
      if (!message.author.bot) {
        let verify = parseInt(message.content);
        let code = db.get(`verification.${message.author.id}`);
        if (verify !== code) {
          message.delete()
          return message.reply("입력하신코드가 일치하지 않습니다.").then(i => i.delete({timeout: 10000}));
        }
        
        if (verify === code) {
          message.delete();
          db.delete(`verification.${message.author.id}`);
          message.reply("5초후에 역할이 지급됩니다.").then(i => i.delete({timeout: 7500}));
          setTimeout(function() {
            message.member.roles.add("764721513559490601");
          }, 5000)
        }
      }
    }
  }
  
  client.emit('experience', message);
  
  // If the user doesn't doing any to the bot, return it.
  if (!message.content.startsWith(prefix)) return;
  
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let msg = message.content.toLowerCase();
  let cmd = args.shift().toLowerCase();
  let sender = message.author;
  
  // Many people don't know what is message.flags.
  // We've already seen a bot who has a message.flags or they would called, parameter things.
  message.flags = []
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1)); // Example: /play -soundcloud UP pice
  }
  
  let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!commandFile) return; // If the commands doesn't exist, ignore it. Don't send any warning on this.
  
  // This will set a cooldown to a user after typing a command.
  if (!cooldowns.has(commandFile.help.name)) cooldowns.set(commandFile.help.name, new Discord.Collection());
  
  const member = message.author;
        now = Date.now(),
        timestamps = cooldowns.get(commandFile.help.name),
        cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;
  
  if (!timestamps.has(member.id)) {
    if (!client.config.owners.includes(message.author.id)) {
      // If the user wasn't you or other owners that stored in config.json
      timestamps.set(member.id, now);
    }
  } else {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;
    
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.channel.send(`명령어를 다시 사용하려면 **${timeLeft.toFixed(1)}**초 기다려주세요`);
    }
    
    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount); // This will delete the cooldown from the user by itself.
  }
  
  try {
    if (!commandFile) return;
    commandFile.run(client, message, args);
  } catch (error) {
    console.log(error.message);
  } finally {
    // If you want to really know, who is typing or using your bot right now.
    console.log(`${sender.tag} (${sender.id}) 사용함: ${cmd}`);
  }
}

function randomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}