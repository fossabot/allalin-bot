module.exports = {
  name: 'kick',
  description: 'Kick a member from the guild.',
  usage: 'kick [mention]',
  argsreq: true,
  mentionreq: true,
  permissions: ['KICK_MEMBERS'],
  async execute (message, args) {
    const target = await message.guild.members.fetch(message.mentions.users.first().id)

    if (!target.kickable) return message.reply(`${target.user.tag} cannot be kicked.`)

    message.reply(`Do you want to kick ${target.user.tag}? \`yes\`/\`no\``)

    const filter = m => {
      return m.author.id === message.author.id
    }

    const collector = message.channel.createMessageCollector(filter, { time: 10000 })

    collector.on('collect', m => {
      if (m.content.includes('yes')) {
        target.kick()
        message.reply(`Kicked ${target.user.tag} (${target.user.id}) successfully.`)
        collector.stop()
      } else if (m.content.includes('no')) {
        message.reply(`Cancelled kicking of ${target.user.tag}.`)
        collector.stop()
      } else {
        message.reply('Please send either `yes` or `no`.')
      }
    })

    collector.on('end', (c, r) => {
      if (r === 'time') return message.reply('command timed out.')
    })
  }
}
