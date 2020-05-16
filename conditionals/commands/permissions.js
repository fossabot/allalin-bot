module.exports = {
  evaluate (command, message) {
    return command.permissions
  },
  execute (command, message) {
    if (!message.member.hasPermission(command.permissions)) {
      message.reply('you don\'t have enough permissions to run this command.')
      return true
    }
  }
}
