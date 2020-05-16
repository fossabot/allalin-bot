module.exports = {
  evaluate (message) {
    return message.channel.type !== 'text'
  },
  execute (message) {
    return true
  }
}
