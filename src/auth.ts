import got from 'got';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'discord.js';
import { CookieJar } from 'tough-cookie';
import { promisify } from 'util';

interface AuthUser {
    discordUser: string;
    token: string;
    callback: (valid: Boolean, value: string) => void;
}

export class Auth {
    private static SA_PROFILE_URL: string = 'https://forums.somethingawful.com/member.php?action=getinfo&username=';

    private authUsers: AuthUser[] = [];

    userJoin(user: User, callback: (valid: Boolean, value: string) => void): void {
      const token = Auth.generateToken().replace('-', '');

      user.send({
        embed: {
          color: 3447003,
          title: 'Welcome to our discord',
          description: 'To verify you have an active account. Edit your profile and add the token anywhere on the profile page. '
                    + 'Once finished, reply to this message with your Username. You account page will be scaned for the token then your account with be authenticated.',
          fields: [
            { name: 'Edit Profile', value: 'https://forums.somethingawful.com/member.php?action=editprofile' },
          ],
        },
      });

      user.send(`token: ${token}`);

      this.authUsers.push({ discordUser: user.id, token, callback });
    }

    async authUser(forumsUsername: string, discordUser: User): Promise<void> {
      const user = this.authUsers.find((v) => v.discordUser === discordUser.id);
      if (user === undefined) {
        return;
      }

      try {
        const validated = await Auth.validateToken(forumsUsername, user.token);
        if (validated) {
          user.callback(true, forumsUsername);
        } else {
          user.callback(false, 'Failed to find token on page. Verify token is on page and resend username');
        }
      } catch (e) {
        user.callback(false, e);
      }
    }

    public static generateToken(): string {
      return uuidv4();
    }

    private static async validateToken(username: string, token: string): Promise<Boolean> {
      const cookieJar = new CookieJar();
      const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));

      await setCookie(`sessionid=${process.env.COOKIE_SESSIONID}`, 'https://forums.somethingawful.com');
      await setCookie(`sessionhash=${process.env.COOKIE_SESSIONHASH}`, 'https://forums.somethingawful.com');
      await setCookie(`bbuserid=${process.env.COOKIE_BBUSERID}`, 'https://forums.somethingawful.com');
      await setCookie(`bbpassword=${process.env.COOKIE_BBPASSWORD}`, 'https://forums.somethingawful.com');

      const result = await got(`${Auth.SA_PROFILE_URL}${encodeURIComponent(username)}`, { cookieJar });
      // check if page failed to login and throw if not
      if (result.body.includes('Sorry, you must be a registered forums member to view this page.')) {
        throw Error('Failed to verify account, cookies have expired. Contact mods');
      }
      return result.body.includes(token);
    }
}
