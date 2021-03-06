module.exports = {
  evaluate (message) {
    return message.mentions.users.size
  },
  execute (message) {
    const filter = m => {
      return m.mentions.users.size && m.author.id === message.author.id
    }

    let counter = 0
    const collector = message.channel.createMessageCollector(filter, { time: 10000 })

    collector.on('collect', m => {
      counter += 1
      if (counter > 4) {
        message.member.ban()
        collector.stop()
      }
    })
  }
}
