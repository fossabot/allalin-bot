module.exports = {
  evaluate (command, message) {
    return command.argsreq
  },
  execute (command, message) {
    if (!(message.content.slice(global.config.prefix.length).split(/ +/).length - 1)) {
      var response = 'you need to pass more arguments into this command.'
      if (command.usage) response += `\n\`\`\`${command.usage}\`\`\``
      message.reply(response)

      return true
    }
  }
}
