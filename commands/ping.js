module.exports = {
  name: 'ping',
  description: 'Get the latency of the bot.',
  cooldown: 5,
  execute (message) {
    message.channel.send(`Pong! ${Date.now() - message.createdTimestamp}ms`)
  }
}
