module.exports = {
  evaluate (command, message) {
    return !global.commands.has(message.content.slice(global.config.prefix.length).split(/ +/)[0])
  },
  execute (command, message) {
    return true
  }
}
