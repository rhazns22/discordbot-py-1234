module.exports = async (client, member) => {
  const db = require("quick.db");
  const Discord = require("discord.js");
  const Canvas = require('canvas');
  const guildInvites = new Map();

  if (member.user.bot) return;
  // If the user was a robot, return it.
  // Unless, you create a welcome/goodbye system. Put this under your welcome/goodbye system.

  let number = randomInteger(100000, 1000000);
  // The number will be shuffled from the range 100K - 1M

  let verifyChannel = member.guild.channels.cache.find(ch => ch.id === "764697092517658664");
  // Your Verification Text Channel.

  // await db.set(`verification.${member.user.id}`, number);

  // const dm = new Discord.MessageEmbed()
  //   .setColor("RANDOM")
  //   .setTitle(`어서오세요! ${member.guild.name}!`)
  //   .setDescription("서버를 들어오기전 로봇이 아닌걸 인증해주세요!")
  //   .addField("인증채널에 코드를 입력해주세요.", `**당신의 코드:** ${number}`)
  // await member.send(dm).catch(() => {
  //   verifyChannel.send(`<@!${member.user.id}> DM기능이 차단되어있거나 개인설정되있으신거 같아요! 해제후 \`재인증\` 을 입력해주세요!`)
  //     .then(i => i.delete({ timeout: 10000 }));
  // })

  // let channel = {
  //   total: "764716735755976714",
  //   member: "764716752935321601",
  //   bot: "764716763304558633",
  //   serverID: "764444105182019595"
  // }

  // if (member.guild.id !== channel.serverID) return;

  // client.channels.cache.get(channel.total).setName(`🌟│모든유저: ${member.guild.memberCount}`);
  // client.channels.cache.get(channel.member).setName(`🌟ㅣ유저: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
  // client.channels.cache.get(channel.bot).setName(`🌟ㅣ봇: ${member.guild.members.cache.filter(m => m.user.bot).size}`);

  const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 70;

    do {
      // Assign the font to the context and decrement it so it can be measured again
      ctx.font = `${fontSize -= 10}px sans-serif`;
      // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return ctx.font;
  };

  const channel2 = member.guild.channels.cache.get("764718060317704213");
  if (!channel2) return;

  const canvas = Canvas.createCanvas(1000, 450);
  const ctx = canvas.getContext('2d');

  const background = await Canvas.loadImage('./welcome-image.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#74037b';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Slightly smaller text placed above the member's display name
  ctx.font = applyText(canvas, `${member.user.tag}!`);
  ctx.font = '40px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${member.user.tag} 님이 서버에 들어오셨습니다!`, canvas.width / 6.8, canvas.height / 1.3);

  // Add an exclamation point here and below
  ctx.font = '35px sans-serif';
  ctx.fillStyle = '#939797';
  ctx.fillText(`Member #${member.guild.memberCount}`, canvas.width / 2.5, canvas.height / 1.1);

  ctx.beginPath();
  ctx.arc(495, 180, 120, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
  ctx.drawImage(avatar, 370, 50, 250, 250);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

  channel2.send(`LEEDU 에 오신걸 환영합니다, ${member}!`, attachment);



  const serverstats = new db.table('ServerStats');
  let sguildid = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.guildid' })
  let tusers = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.totusers' })
  let membs = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.membcount' })
  let bots = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.botcount' })
  
	const totalsize = member.guild.memberCount;
	const botsize = member.guild.members.cache.filter(m => m.user.bot).size;
	const humansize = totalsize - botsize;
  
  if(member.guild.id === sguildid) { 
		member.guild.channels.cache.get(tusers).setName("🌟│모든유저: " + totalsize);
		member.guild.channels.cache.get(membs).setName("🌟│유저: " + humansize);
		member.guild.channels.cache.get(bots).setName("🌟│봇: " + botsize);
  }
}


function randomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
