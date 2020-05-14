module.exports = {
  event: 'message',
  initialise (client) {
    const fs = require('fs')
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {
      const command = require(`../commands/${file}`)
      client.commands.set(command.name, command)
    }

    const msgConditionalFiles = fs.readdirSync('./conditionals/messages').filter(file => file.endsWith('.js'))

    for (const file of msgConditionalFiles) {
      const conditional = require(`../conditionals/messages/${file}`)
      client.msgConditionals.push(conditional)
    }
  },
  handle (message) {
    const Discord = require('discord.js')
    message.client.msgConditionals.forEach(conditional => {
      conditional.execute(message)
    })

    if (message.author.bot || message.channel.type !== 'text') return
    if (message.content.startsWith(message.client.prefix)) {
      const args = message.content.slice(message.client.prefix.length).split(/ +/)
      const commandName = args.shift().toLowerCase()

      if (!message.client.commands.has(commandName)) return

      const command = message.client.commands.get(commandName)

      if (command.permissions) {
        if (!message.member.hasPermission(command.permissions)) return message.reply('you don\'t have enough permissions to run this command.')
      }

      if (command.argsreq && !args.length) {
        let response = 'you need to pass more arguments into this command.'
        if (command.usage) response += `\n\`\`\`${command.usage}\`\`\``

        return message.reply(response)
      }

      if (command.mentionreq && !message.mentions.users.size) return message.reply('you need to mention at least one user.')

      if (command.cooldown) {
        if (!message.client.cooldowns.has(command.name)) {
          message.client.cooldowns.set(command.name, new Discord.Collection())
        }

        const now = Date.now()
        const timestamps = message.client.cooldowns.get(command.name)
        const cooldownAmount = command.cooldown * 1000

        if (timestamps.has(message.author.id)) {
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount

          if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000
            return message.reply(`please wait ${timeLeft.toFixed(1)} second(s) before using \`${prefix}${command.name}\` again.`)
          }
        }

        timestamps.set(message.author.id, now)
        setTimeout(_ => timestamps.delete(message.author.id), cooldownAmount)
      }

      try {
        command.execute(message, args)
      } catch (error) {
        console.error(error)
        message.reply(`an error occured whilst trying to execute \`${prefix}${command.name}\`.`)
      }
    }
  }
}
