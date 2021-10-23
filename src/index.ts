import Discord from 'discord.js';
require('dotenv').config();

import {Auth} from './auth';

const auth = new Auth();

const client = new Discord.Client();
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', msg => {
  if(msg.author.bot) {
    return;
  }

  if(msg.type === 'GUILD_MEMBER_JOIN') {
    auth.userJoin(msg.author, () => {
      const role = msg.member.guild.roles.find(role => role.name === "Authed Goon");
      if (!role) return;
      msg.member.addRole(role);
    });
  } else {
    if(msg.channel.type === 'dm') {
      //todo scrub this content. regex it for a valid username
      auth.authUser(msg.cleanContent, msg.author);
    }
  } 
});

client.login(process.env.TOKEN);