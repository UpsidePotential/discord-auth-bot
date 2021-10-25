import Discord from 'discord.js';

import { Auth } from './auth';

require('dotenv').config();

const auth = new Auth();
const client = new Discord.Client();
client.on('ready', () => {
  console.log('Connected to Discord Bot Services');
});

client.on('message', (msg) => {
  if (msg.author.bot) {
    return;
  }

  if (msg.type === 'GUILD_MEMBER_JOIN') {
    auth.userJoin(msg.author, (valid: Boolean, error: string) => {
      if (valid) {
        const role = msg.member.guild.roles.find((r) => r.name === 'Authed Goon');
        if (!role) {
          console.error(`Success auth'd ${msg.author.username}. Failed to assign role`);
          return;
        }
        console.log(`Success Auth'd User ${msg.author.username}`);
        msg.member.addRole(role).then(() => {
          msg.author.send('Your account has been verified and new permissions applied');
        });
      } else {
        console.error(`Failed to Auth'd User ${msg.author.username} due to ${error}`);
        msg.author.send(`Failed to authenticate due to ${error}`);
      }
    });
  } else if (msg.channel.type === 'dm') {
    auth.authUser(msg.cleanContent, msg.author);
  }
});

client.login(process.env.TOKEN);
