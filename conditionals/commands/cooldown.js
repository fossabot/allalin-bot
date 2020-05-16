module.exports = {
  evaluate (command, message) {
    return command.cooldown
  },
  execute (command, message) {
    const Discord = require('Discord.js')

    if (!global.cooldowns.has(command.name)) {
          global.cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now()
    const timestamps = global.cooldowns.get(command.name)
    const cooldownAmount = command.cooldown * 1000

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000
        message.reply(`please wait ${timeLeft.toFixed(1)} second(s) before using \`${global.config.prefix}${command.name}\` again.`)
        return true
      }
    }

    timestamps.set(message.author.id, now)
    setTimeout(_ => timestamps.delete(message.author.id), cooldownAmount)
  }
}
