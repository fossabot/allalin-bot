module.exports = {
  name: 'ban',
  description: 'Ban a member from the guild.',
  usage: 'ban [mention]',
  argsreq: true,
  mentionreq: true,
  permissions: ['BAN_MEMBERS'],
  async execute (message, args) {
    const target = await message.guild.members.fetch(message.mentions.users.first().id)

    if (!target.bannable) return message.reply(`${target.user.tag} cannot be banned.`)

    message.reply(`do you want to ban ${target.user.tag}? \`yes\`/\`no\``)

    const filter = m => {
      return m.author.id === message.author.id
    }

    const collector = message.channel.createMessageCollector(filter, { time: 10000 })

    collector.on('collect', m => {
      if (m.content.includes('yes')) {
        target.kick()
        message.reply(`banned ${target.user.tag} (${target.user.id}) successfully.`)
        collector.stop()
      } else if (m.content.includes('no')) {
        message.reply(`cancelled banning of ${target.user.tag}.`)
        collector.stop()
      } else {
        message.reply('please send either `yes` or `no`.')
      }
    })

    collector.on('end', (c, r) => {
      if (r === 'time') return message.reply('command timed out.')
    })
  }
}
