# wiisportsmusic

## A Discord Music Bot

### Installation and Usage

1. Install dependencies: `npm i`   
2. Add credentials for the YouTube Data API and for your Discord Application.
  a. Follow [this guide](https://console.developers.google.com/flows/enableapi?apiid=youtube) to create an API key for the YouTube API.
  
  b. Follow [this guide]() to create a Discord application and a bot token for it.
  
  c. Add the keys to either:
    - The environment variables `discordBotToken` and `youtubeApiKey`.
    - The keys `discordBotToken` and `youtubeApiKey` to `config.json` in the root directory.
  
3. Customize:   
  - Change the text in `text.js` to whatever you want.
  - Change `commandPrefix` in `server.js` to whatever you want.
  - Add new commands in `commands.js` by adding new keys to `module.exports`.
  - Enable the express.js landing page in `server.js`.
  
4. Start the bot: `npm start`
