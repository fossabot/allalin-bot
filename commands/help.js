module.exports = {
  name: 'help',
  description: 'Get all of the bot\'s commands and their descriptions.',
  cooldown: 5,
  execute (message) {
    let response = ''

    message.client.commands.forEach((value) => {
      response += `${value.name}: ${value.description}\n`
      if (value.usage) response += `\`\`\`${value.usage}\`\`\``
    })

    message.channel.send(response)
  }
}
