const fs = require('fs')
const Discord = require('discord.js')
const config = require('./config.json')

const client = new Discord.Client()
client.prefix = config.prefix
client.commands = new Discord.Collection()
client.cooldowns = new Discord.Collection()
client.msgConditionals = []
client.handlers = []

const handlerFiles = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'))

for (const file of handlerFiles) {
  const handler = require(`./handlers/${file}`)
  client.handlers.push(handler)
}

for (const handler of client.handlers) {
  if (handler.initialise) handler.initialise(client)
  client.on(handler.event, handler.handle)
}

client.login(config.token)
