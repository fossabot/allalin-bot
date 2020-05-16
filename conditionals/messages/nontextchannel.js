module.exports = {
  evaluate (message) {
    return message.channel.type !== 'text'
  },
  execute (message) {
    return 1
  }
}
