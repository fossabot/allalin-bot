module.exports = {
  evaluate (message) {
    return message.mentions.users.size > 4
  },
  execute (message) {
    message.member.ban()
  }
}
