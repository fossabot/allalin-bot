module.exports = {
  name: 'kick',
  permissions: ['KICK_MEMBERS'],
  execute(message, args) {
    message.channel.send('This doesnt do anything')
  }
}
