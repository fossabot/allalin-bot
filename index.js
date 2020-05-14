const fs = require('fs')
const Discord = require('discord.js')
const config = require('./config.json')

const client = new Discord.Client()
client.prefix = config.prefix
client.commands = new Discord.Collection()
client.msgConditionals = []
client.handlers = []

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
const msgConditionalFiles = fs.readdirSync('./conditionals/messages').filter(file => file.endsWith('.js'))
const handlerFiles = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

for (const file of msgConditionalFiles) {
  const conditional = require(`./conditionals/messages/${file}`)
  client.msgConditionals.push(conditional)
}

for (const file of handlerFiles) {
  const handler = require(`./handlers/${file}`)
  client.handlers.push(handler)
}

client.cooldowns = new Discord.Collection()

for (const handler of client.handlers) {
  if (handler.initialise) handler.initialise()
  client.on(handler.event, handler.handle)
}

client.login(config.token)
