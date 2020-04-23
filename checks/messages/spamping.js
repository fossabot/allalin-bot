module.exports = {
  execute (message) {
    if (message.mentions.users.size > 4) {
      message.member.ban()
    }
  }
}
