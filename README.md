# discord-auth-bot

Follow this guide to setting up a bot. 
- https://www.sitepoint.com/discord-bot-node-js/

* https://discord.com/developers/applications
* Create new application
* Add Name, Picture, Discription
* Click OAUTH2
* Under Scopes, Click Bot
* Select Manage Roles and Send Messages as permissions.

## Create .env file
Create a .env file in the same folder. The Cookies are from existing logged in user.  Can be found in chrome or firefox in developer tools.  Chrome its under the Developer Tools => Application => Storage => Cookies. Open fourms in browser cookies should be visable. Copy and paste the values.  These will need to be updated every few months and the application closed and reopened to refresh.

Token is from the bot created in the guide. This bot will need Manage Roles and Send Messages.

## .env
TOKEN=DISCORD BOT TOKEN

COOKIE_SESSIONID=XXXXX
COOKIE_SESSIONHASH=XXXX
COOKIE_BBUSERID=XXX
COOKIE_BBPASSWORD=XXXX

# Building
Follow create .env file section and place in root folder.
* npm i
* npm run build
* npm start


# To Create a Windows Portable Exe
* npm run package
