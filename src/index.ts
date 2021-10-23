import Discord from 'discord.js';

require('dotenv').config();

const client = new Discord.Client();
client.on('ready', () => {
  console.log('I am ready!');
});


client.login(process.env.TOKEN);
