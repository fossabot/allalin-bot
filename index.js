const fs = require('fs')
const Discord = require('discord.js')
const { prefix, token } = require('./config.json')

const client = new Discord.Client()
client.commands = new Discord.Collection()

const cooldowns = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.once('ready', _ => console.log('Ready!'))

client.on('message', message => {
  if (message.author.bot || message.channel.type !== 'text') return
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(/ +/)
    const commandName = args.shift().toLowerCase()

    if (!client.commands.has(commandName)) return

    const command = client.commands.get(commandName)

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
      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
      }

      const now = Date.now()
      const timestamps = cooldowns.get(command.name)
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
})

client.login(token)
