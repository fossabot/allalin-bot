module.exports = {
  evaluate (command, message) {
    return command.mentionreq && !message.mentions.users.size
  },
  execute (command, message) {
    message.reply('you need to mention at least one user.')
    return true
  }
}
