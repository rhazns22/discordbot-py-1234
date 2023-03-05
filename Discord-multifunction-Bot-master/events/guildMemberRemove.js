module.exports = async (client, member) => {
  const db = require("quick.db");
  const Discord = require("discord.js");
  const Canvas = require('canvas');

  let codeExist = db.get(`verification.${member.user.id}`);
  if (codeExist) db.delete(`verification.${member.user.id}`);

  let channel = {
    total: "764716735755976714",
    member: "764716752935321601",
    bot: "764716763304558633",
    serverID: "764444105182019595"
  }

  // if (member.guild.id !== channel.serverID) return;

  // client.channels.cache.get(channel.total).setName(`🌟│모든유저: ${member.guild.memberCount}`);
  // client.channels.cache.get(channel.member).setName(`🌟ㅣ유저: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
  // client.channels.cache.get(channel.bot).setName(`🌟ㅣ봇: ${member.guild.members.cache.filter(m => m.user.bot).size}`);

  const channel2 = member.guild.channels.cache.get("764797708917407745");
  if (!channel2) return;

  const canvas = Canvas.createCanvas(1000, 450);
  const ctx = canvas.getContext('2d');

  const background = await Canvas.loadImage('./welcome-image.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#74037b';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Slightly smaller text placed above the member's display name
  // ctx.font = applyText(canvas, `${member.user.tag}!`);
  ctx.font = '40px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${member.user.tag} 님이 서버를 나가셨습니다 ㅠㅠ`, canvas.width / 6.8, canvas.height / 1.3);

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

  channel2.send(`LEEDU 접속해주신걸 감사합니다, ${member}!`, attachment);

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
