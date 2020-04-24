module.exports = {
  name: 'user',
  description: 'Get information about the mentioned users.',
  usage: 'user [mention]',
  argsreq: true,
  mentionreq: true,
  cooldown: 5,
  execute (message) {
    message.mentions.users.forEach(async user => {
      let member = await message.guild.members.fetch(user.id)
      message.channel.send(`**${user.tag}** *${member.nickname}*
ID: ${user.id}
Account created: ` + user.createdAt + `
Join date: ` + member.joinedAt)
    })
  }
}
