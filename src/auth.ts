import got from 'got';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'discord.js';
import {CookieJar} from 'tough-cookie';
import {promisify} from 'util';

interface AuthUser {
    discordUser: string;
    token: string;
}

export class Auth
{
    private static SA_PROFILE_URL: string = "https://forums.somethingawful.com/member.php?action=getinfo&username=";
    private authUsers: AuthUser[] = [];

    userJoin(user: User): void {
        const token = Auth.generateToken();

        user.send({
            embed: {
                color: 3447003,
                title: 'Welcome to our discord',
                description: 'Add this to your profile and reply with username',
                fields: [ 
                    { name: 'Token', value: token }
                ]
            }
        });

        this.authUsers.push({discordUser: user.id, token});
    }

    async authUser(forumsUsername: string, discordUser: User): Promise<void> {
       const user = this.authUsers.find( (v) => v.discordUser === discordUser.id)
       if(user === undefined) {
           return;
       }
       const validated = await this.validateToken(forumsUsername, user.token);
       if(validated) {
           console.log('welp this one is ok');
           //await discordUser.addRole('Auth Goon', 'bot did it');
       } else {
           throw Error('nopes');
       }
    }

    public static generateToken(): string {
        return uuidv4();
    }

    private async validateToken(username: string, token: string): Promise<Boolean> {
        const cookieJar = new CookieJar();
        const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));
        
        await setCookie(`sessionid=${process.env.COOKIE_SESSIONID}`, 'https://forums.somethingawful.com');
        await setCookie(`sessionhash=${process.env.COOKIE_SESSIONHASH}`, 'https://forums.somethingawful.com');
        await setCookie(`bbuserid=${process.env.COOKIE_BBUSERID}`, 'https://forums.somethingawful.com');
        await setCookie(`bbpassword=${process.env.COOKIE_BBPASSWORD}`, 'https://forums.somethingawful.com');

        const result = await got(`${Auth.SA_PROFILE_URL}${encodeURIComponent(username)}`, {cookieJar});
        return result.body.includes(token);
    }
}