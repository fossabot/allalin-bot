const fs = require('fs')
const Discord = require('discord.js')
global.config = require('./config.json')

const client = new Discord.Client()

global.commands = new Discord.Collection()
global.cooldowns = new Discord.Collection()
global.msgConditionals = []
global.handlers = []

const handlerFiles = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'))

for (const file of handlerFiles) {
  const handler = require(`./handlers/${file}`)
  global.handlers.push(handler)
}

for (const handler of global.handlers) {
  if (handler.initialise) handler.initialise()
  client.on(handler.event, handler.handle)
}

client.login(global.config.token)
