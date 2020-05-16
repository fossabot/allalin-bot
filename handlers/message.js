module.exports = {
  event: 'message',
  initialise () {
    const fs = require('fs')
    const Discord = require('Discord.js')

    global.commands = new Discord.Collection()
    global.cooldowns = new Discord.Collection()
    global.msgConditionals = []

    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {
      const command = require(`../commands/${file}`)
      global.commands.set(command.name, command)
    }

    const msgConditionalFiles = fs.readdirSync('./conditionals/messages').filter(file => file.endsWith('.js'))

    for (const file of msgConditionalFiles) {
      const conditional = require(`../conditionals/messages/${file}`)
      global.msgConditionals.push(conditional)
    }
  },
  handle (message) {
    const Discord = require('discord.js')
    global.msgConditionals.forEach(conditional => {
      if (conditional.evaluate(message)) {
        conditional.execute(message)
      }
    })

    if (message.author.bot || message.channel.type !== 'text') return

    if (message.content.startsWith(global.config.prefix)) {
      const args = message.content.slice(global.config.prefix.length).split(/ +/)
      const commandName = args.shift().toLowerCase()

      if (!global.commands.has(commandName)) return

      const command = global.commands.get(commandName)

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
        message.reply(`an error occured whilst trying to execute \`${global.config.prefix}${command.name}\`.`)
      }
    }
  }
}
