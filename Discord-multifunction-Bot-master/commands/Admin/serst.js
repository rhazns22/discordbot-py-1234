const Discord = require('discord.js');
const db = require('quick.db');
const serverstats = new db.table('ServerStats');

exports.run = async (client, message, args, tools) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`:x: **MANAGE_GUILD** 현재 봇의 권한이 부족합니다. **메시지 관리** 권한을 지급해주세요!`)
    if (!args[0]) return message.channel.send(":x: 활성화 혹은 비활성화를 적어주세요! ex) `스텟 활성화` | `스텟 비활성화`");
    if (args[0] === '활성화') {
        let totusers = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.totusers' })
        let membcount = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.membcount' })
        let botcount = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.botcount' })
        if (totusers !== null || membcount !== null || botcount !== null) return message.channel.send(`:x: 서버스텟이 이미 활성화 되어있습니다!`)
        if (!message.guild.me.hasPermission(`MANAGE_CHANNELS`)) return message.channel.send(`:x: **MANAGE_CHANNELS** 현재 봇의 권한이 부족합니다. **채널 생성** 권한을 지급해주세요!`);
        const totalsize = message.guild.memberCount;
        const botsize = message.guild.members.cache.filter(m => m.user.bot).size;
        const humansize = totalsize - botsize;
        message.guild.channels.create('📈서버 스텟📈', { type: 'category' }, [{
            id: message.guild.id,
            deny: ['CONNECT']
        }]).then(channel => {
            channel.setPosition(0)
            message.guild.channels.create("🌟│모든유저: " + totalsize, { type: 'voice' }, [{
                id: message.guild.id,
                deny: ['CONNECT']
            }]).then(channel1 => {
                channel1.setParent(channel.id)
                let x = channel1.id
                message.guild.channels.create("🌟│유저: " + humansize, { type: 'voice' }, [{
                    id: message.guild.id,
                    deny: ['CONNECT']
                }]).then(channel2 => {
                    channel2.setParent(channel.id)
                    let y = channel2.id
                    message.guild.channels.create("🌟│봇: " + botsize, { type: 'voice' }, [{
                        id: message.guild.id,
                        deny: ['CONNECT']
                    }]).then(async channel3 => {
                        channel3.setParent(channel.id)
                        let z = channel3.id
                        await serverstats.set(`Stats_${message.guild.id}`, { guildid: message.guild.id, totusers: x, membcount: y, botcount: z, categid: channel.id })
                    })
                })
            })
        })
        message.channel.send(`:white_check_mark: 채널이 생성되었습니다. ^~^`)
    } else if (args[0] === '비활성화') {

        let totusers = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.totusers' })
        let membcount = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.membcount' })
        let botcount = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.botcount' })
        let categ = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.categid' })
        if (totusers === null || membcount === null || botcount === null) return message.channel.send(`:x: 서버스텟은 활성화되있지 않습니다`)
        client.channels.cache.get(totusers).delete()
        client.channels.cache.get(membcount).delete()
        client.channels.cache.get(botcount).delete()
        client.channels.cache.get(categ).delete()

        serverstats.delete(`Stats_${message.guild.id}`)
        message.channel.send(`:white_check_mark: 관리자권한으로 삭제처리되었습니다 ^~^`)
    } else if (args[0] === '새로고침') {

        let totusers = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.totusers' })
        let membcount = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.membcount' })
        let botcount = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.botcount' })
        let categ = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.categid' })
        client.channels.cache.get(totusers).delete()
        client.channels.cache.get(membcount).delete()
        client.channels.cache.get(botcount).delete()
        client.channels.cache.get(categ).delete()

        serverstats.delete(`Stats_${message.guild.id}`)

        if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`:x: **MANAGE_GUILD** 현재 봇의 권한이 부족합니다. **메시지 관리** 권한을 지급해주세요!`)
        if (!args[0]) return message.channel.send(":x: 활성화 혹은 비활성화를 적어주세요! ex) `스텟 활성화` | `스텟 비활성화`");
        if (!message.guild.me.hasPermission(`MANAGE_CHANNELS`)) return message.channel.send(`:x: **MANAGE_CHANNELS** 현재 봇의 권한이 부족합니다. **채널 생성** 권한을 지급해주세요!`);
        const totalsize = message.guild.memberCount;
        const botsize = message.guild.members.cache.filter(m => m.user.bot).size;
        const humansize = totalsize - botsize;
        message.guild.channels.create('📈서버 스텟📈', { type: 'category' }, [{
            id: message.guild.id,
            deny: ['CONNECT']
        }]).then(channel => {
            channel.setPosition(0)
            message.guild.channels.create("🌟│모든유저: " + totalsize, { type: 'voice' }, [{
                id: message.guild.id,
                deny: ['CONNECT']
            }]).then(channel1 => {
                channel1.setParent(channel.id)
                let x = channel1.id
                message.guild.channels.create("🌟│유저: " + humansize, { type: 'voice' }, [{
                    id: message.guild.id,
                    deny: ['CONNECT']
                }]).then(channel2 => {
                    channel2.setParent(channel.id)
                    let y = channel2.id
                    message.guild.channels.create("🌟│봇: " + botsize, { type: 'voice' }, [{
                        id: message.guild.id,
                        deny: ['CONNECT']
                    }]).then(async channel3 => {
                        channel3.setParent(channel.id)
                        let z = channel3.id
                        await serverstats.set(`Stats_${message.guild.id}`, { guildid: message.guild.id, totusers: x, membcount: y, botcount: z, categid: channel.id })
                    })
                })
            })
        })
        message.channel.send(`:white_check_mark: 스텟이 새로고침되었습니다. ^~^`)
    }
}

exports.help = {
    name: "스텟",
    description: "서버인원체크를 해주는 채널을 생성해줍니다.",
    usage: "스텟 <활성화/비활성화>",
    example: "스텟 활성화"
};

exports.conf = {
    aliases: ["스텟"],
    cooldown: 5
}
