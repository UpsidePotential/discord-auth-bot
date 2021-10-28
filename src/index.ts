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
    auth.userJoin(msg.author, (valid: Boolean, value: string) => {
      if (valid) {
        const role = msg.member.guild.roles.find((r) => r.name === 'Authed Goon');
        if (!role) {
          console.error(`Success auth'd ${msg.author.username}. Failed to assign role`);
          return;
        }
        console.log(`Success Auth'd User ${msg.author.username}`);
        
        const addRole = msg.member.addRole(role);
        const sendDm = msg.author.send('Your account has been verified and new permissions applied');
        const sendChannelMsg = msg.channel.send(`Welcome ${msg.author} (SA: ${value} )` );

        Promise.all([addRole, sendDm,sendChannelMsg])
          .then( () => console.log('Assigned new role.'))
          .catch( (err) => console.error('Failed to assign role: ', err));
        
      } else {
        console.error(`Failed to Auth'd User ${msg.author.username} due to ${value}`);
        msg.author.send(`Failed to authenticate due to ${value}`);
      }
    });
  } else if (msg.channel.type === 'dm') {
    auth.authUser(msg.cleanContent, msg.author);
  }
});

console.log('Logging in to discord');

client.login(process.env.TOKEN).then(() => {
  console.log('logged in.');
},
(error) => {
  console.error('failed to log in error: ', error);
});
