const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

exports.run = async (client, message, args) => {

    if (message.channel.id !== "803964960068599869") {
        message.delete()
        return message.reply("블랙잭 가능한 채널이 아닙니다!")
    }

    const amount = parseInt(args[0]);
    const plca = Math.floor(Math.random() * 11) + 2;
    const plca2 = Math.floor(Math.random() * 11)+ 2;
    const botca = Math.floor(Math.random() * 11) + 2;
    const botca2 = Math.floor(Math.random() * 11)+ 2;
    const plto = plca + plca2
    const plarr = [];
    const boarr = [];
    plarr.push(plca)
    plarr.push(plca2)
    boarr.push(botca)
    boarr.push(botca2)
    const balance = db.get(`account.${message.author.id}.balance`);

    if (!amount) return message.channel.send("포인트을 입력해주세요.");
    if (isNaN(amount)) return message.channel.send("포인트는 숫자만 가능합니다");
    if (amount > balance || !balance || balance === 0) return message.channel.send("포인트가 충분하지 않습니다.");
    
    // Optional:
    if (amount < 50) return message.channel.send("도박 최소 포인트는 50 포인트입니다.");

    let cooldown = 5000; // 25 Seconds.
    let pad_zero = num => (num < 10 ? '0' : '') + num;
    let lastGamble = await db.get(`lastGamble.${message.author.id}`);

    if (lastGamble !== null && cooldown - (Date.now() - lastGamble) > 0) {
        let timeObj = ms(cooldown - (Date.now() - lastGamble));
        let second = pad_zero(timeObj.seconds).padStart(2, "0");
        return message.channel.send(`다시 도전하려면 **${second}** 후에 다시도전해주세요!`);
    }

    const embed = new Discord.MessageEmbed()
    .setColor("#ffffff")
    .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    .setTitle("블랙잭")
    .setDescription(`게임을 계속진행하고싶다면 ✅ 멈추고싶다면 ❌ 를 눌러 선택하세요!\n당신의 카드: ${plca},${plca2}: ${plto}\n봇의 카드: ${botca}, ???:???`)
    .setTimestamp();
    message.channel.send(embed).then(msg => {
        msg.react("✅").then(r => {
            msg.react("❌")
            const stanfl = (reaction, user) =>
            reaction.emoji.name === "❌" && user.id === message.author.id
            const hitfl = (reaction, user) =>
            reaction.emoji.name === "✅" && user.id === message.author.id
            const stand = msg.createReactionCollector(stanfl, {
                time: 60000,
                max: 1
            });
            const hit = msg.createReactionCollector(hitfl, {
                time: 60000
            });

            let sum2 = boarr.reduce(function(a, d) {
                return a + d;
            }, 0);
            let botcu;
            botcu = sum2;
            let sum1 = plarr.reduce(function(a, d) {
                return a + d;
            }, 0);
            let plcu;
            plcu = sum1;

            if (plcu > 21 && botcu > 21) {
                embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                .setColor("RED")
                msg.edit(embed)
                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                db.set(`lastGamble.${message.author.id}`, Date.now());
                db.subtract(`account.${message.author.id}.balance`, amount);
                hit.stop()
                stand.stop()
            } else if(plcu === 21 && botcu < 21){
                embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n당신이 승리하셨습니다!`)
                .setColor("GREEN")
                msg.edit(embed)
                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                db.set(`lastGamble.${message.author.id}`, Date.now());
                db.add(`account.${message.author.id}.balance`, amount);
                hit.stop()
                stand.stop()
            } else if(botcu === 21 && plcu < 21){
                embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                .setColor("RED")
                msg.edit(embed)
                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                db.set(`lastGamble.${message.author.id}`, Date.now());
                db.subtract(`account.${message.author.id}.balance`, amount);
                hit.stop()
                stand.stop()
            } else if(botcu === 21 && plcu > 21){
                embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                .setColor("RED")
                msg.edit(embed)
                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                db.set(`lastGamble.${message.author.id}`, Date.now());
                db.subtract(`account.${message.author.id}.balance`, amount);
                hit.stop()
                stand.stop()
            } else if(plcu === 21 && botcu > 21){
                embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n당신이 승리하셨습니다!`)
                .setColor("GREEN")
                msg.edit(embed)
                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                db.set(`lastGamble.${message.author.id}`, Date.now());
                db.add(`account.${message.author.id}.balance`, amount);
                hit.stop()
                stand.stop()
            } else if(botcu > 21){
                embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n당신이 승리하셨습니다!`)
                .setColor("GREEN")
                msg.edit(embed)
                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                db.set(`lastGamble.${message.author.id}`, Date.now());
                db.add(`account.${message.author.id}.balance`, amount);
                hit.stop()
                stand.stop()
            } else if(plcu > 21){
                embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                .setColor("RED")
                msg.edit(embed)
                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                db.set(`lastGamble.${message.author.id}`, Date.now());
                db.subtract(`account.${message.author.id}.balance`, amount);
                hit.stop()
                stand.stop()
            } 

            stand.on("collect", r => {

                let sum2 = boarr.reduce(function(a, d) {
                    return a + d;
                }, 0);
                let botcu;
                botcu = sum2;
                let sum1 = plarr.reduce(function(a, d) {
                    return a + d;
                }, 0);
                let plcu;
                plcu = sum1;

                if (plcu > 21 && botcu > 21) {
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                    .setColor("RED")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.subtract(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(plcu === 21 && botcu < 21){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n당신이 승리하셨습니다!`)
                    .setColor("GREEN")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.add(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(botcu === 21 && plcu < 21){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                    .setColor("RED")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.subtract(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(botcu === 21 && plcu > 21){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                    .setColor("RED")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.subtract(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(plcu === 21 && botcu > 21){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n당신이 승리하셨습니다!`)
                    .setColor("GREEN")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.add(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(plcu > botcu){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n당신이 승리하셨습니다!`)
                    .setColor("GREEN")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.add(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(botcu > plcu){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                    .setColor("RED")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.subtract(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(botcu > 21){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n당신이 승리하셨습니다!`)
                    .setColor("GREEN")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.add(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(plcu > 21){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                    .setColor("RED")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.subtract(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } 
            })

            hit.on("collect", r => {
                const plca3 = Math.floor(Math.random() * 11) + 2
                const botca3 = Math.floor(Math.random() * 11) + 2
                let sum2 = boarr.reduce(function(a, d) {
                    return a + d;
                }, 0);
                let botcu;
                botcu = sum2;
                let sum1 = plarr.reduce(function(a, d) {
                    return a + d;
                }, 0);
                let plcu;
                plcu = sum1;
                plarr.push(plca3)
                boarr.push(botca3)

                if (plcu > 21 && botcu > 21) {
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                    .setColor("RED")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.subtract(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(plcu === 21 && botcu < 21){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n당신이 승리하셨습니다!`)
                    .setColor("GREEN")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.add(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(botcu === 21 && plcu < 21){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                    .setColor("RED")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.subtract(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(botcu === 21 && plcu > 21){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                    .setColor("RED")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.subtract(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(plcu === 21 && botcu > 21){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n당신이 승리하셨습니다!`)
                    .setColor("GREEN")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.add(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(botcu > 21){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n당신이 승리하셨습니다!`)
                    .setColor("GREEN")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.add(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else if(plcu > 21){
                    embed.setDescription(`당신의 카드: ${plarr}: ${plcu}\n봇의 카드: ${boarr}:${botcu}\n봇의 승리입니다!`)
                    .setColor("RED")
                    msg.edit(embed)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                    db.set(`lastGamble.${message.author.id}`, Date.now());
                    db.subtract(`account.${message.author.id}.balance`, amount);
                    hit.stop()
                    stand.stop()
                } else {
                    embed.setDescription(`당신의 카드: ${plarr}:${plcu}\n봇의 카드: ${botca}, ???:???`)
                } 
                msg.edit(embed)                
            })
            
        })
    })


}

exports.help = {
    name: "블랙잭",
    description: "진짜 블랙잭은 아니지만 게임으로서 즐길 수있습니다.\n너무 무리해서 하지 말아주세요",
    usage: "블랙잭 <배팅포인트>",
    example: "블랙잭 500"
}

exports.conf = {
    aliases: ["블랙잭"],
    cooldown: 5
}
