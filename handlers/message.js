module.exports = {
  event: 'message',
  initialise () {
    const fs = require('fs')
    const Discord = require('Discord.js')

    global.commands = new Discord.Collection()
    global.cooldowns = new Discord.Collection()
    global.msgConditionals = []
    global.cmdConditionals = []

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

    const cmdConditionalFiles = fs.readdirSync('./conditionals/commands').filter(file => file.endsWith('.js'))

    for (const file of cmdConditionalFiles) {
      const conditional = require(`../conditionals/commands/${file}`)
      global.cmdConditionals.push(conditional)
    }
  },
  handle (message) {
    const Discord = require('discord.js')

    var result
    global.msgConditionals.forEach(conditional => {
      if (conditional.evaluate(message)) {
        result = conditional.execute(message)
      }
    })
    if (result) return

    if (message.content.startsWith(global.config.prefix)) {
      const args = message.content.slice(global.config.prefix.length).split(/ +/)
      const commandName = args.shift().toLowerCase()

      const command = global.commands.get(commandName)

      global.cmdConditionals.forEach(conditional => {
        if (conditional.evaluate(command, message)) {
          result = conditional.execute(command, message)
        }
      })
      if (result) return

      try {
        command.execute(message, args)
      } catch (error) {
        console.error(error)
        message.reply(`an error occured whilst trying to execute \`${global.config.prefix}${command.name}\`.`)
      }
    }
  }
}
