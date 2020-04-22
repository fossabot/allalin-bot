const fs = require('fs')
const Discord = require('discord.js')
const { prefix, token } = require('./config.json')

const client = new Discord.Client()
client.commands = new Discord.Collection()

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

    try {
      command.execute(message,args)
    } catch (error) {
      console.error(error)
      message.reply('An error occured whilst trying to execute that command.')
    }
  }
})

client.login(token)
