/* jshint ignore: start */
const fs = require('fs');
const Discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const express = require('express');

const text = require('./discord/text');
const commands = require('./discord/commands');

const expressPort = 3000;
 
//
//
// Discord stuff
// (express at the bottom)
//
//
const props = ['discordBotToken', 'youtubeApiKey', 'botId', 'ownerId'];
const config = {};
try {
  let file = JSON.parse(fs.readFileSync('config.json'));
  props.forEach(prop => (config[prop] = file[prop]));
} catch (err) {
  props.forEach(prop => (config[prop] = process.env[prop]));
}

if (config.discordBotToken === null || config.youtubeApiKey === null) throw new Error(text.other.keysUndefined);

const client = new Discord.Client({ disableEveryone: true });
const youtube = new YouTube(config.youtubeApiKey);

let commandPrefix = '^';
const queue = new Map();

async function onReady() {
  console.log(text.bot.ready);
  client.user.setActivity('ALPHA TESTING: ' + commandPrefix + 'help');
}

async function handleMessage(msg) {
  // Do not respond to messages by a bot or without commandPrefix
  if (msg.author.bot) return;
  if (!msg.content.startsWith(commandPrefix)) return;

  const args = msg.content.split(' ');
  const searchString = args.slice(1).join(' ');
  const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  const serverQueue = queue.get(msg.guild.id);

  // Remove command prefix and arguments
  const command = msg.content
    .toLowerCase()
    .split(' ')[0]
    .slice(commandPrefix.length);

  // Command arguments
  let commandArgs = {
    msg,
    handleVideo,
    youtube,
    serverQueue,
    queue,
    url,
    searchString,
    config,
    prefix: commandPrefix
  };

  // See commands.js
  if (commands.hasOwnProperty(command)) return commands[command](commandArgs);
  else return commands.unrecognized(commandArgs);
}

async function handleVideo({video, msg, voiceChannel, playlist = false}) {
  const serverQueue = queue.get(msg.guild.id);
  console.log(`Playing video ${video.title}.`);
  const song = {
    id: video.id,
    title: Discord.Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`
  };

  // Generate queue if it doesn't exist
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    // Map to queue
    queue.set(msg.guild.id, queueConstruct);

    // Add first song
    queueConstruct.songs.push(song);

    // Attempt to connect, deafen self, and play first song
    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      msg.guild.members.get(config.botId).setDeaf(true);
      play(msg.guild, queueConstruct.songs[0]);
    } catch (error) {
      // Clear queue map and send error
      console.error(error);
      queue.delete(msg.guild.id);
      return msg.channel.send(text.bot.cannotConnectF(error));
    }
  }

  // If a queue exists already
  else {
    // Add the song
    serverQueue.songs.push(song);
    console.log(`Queue length: ${serverQueue.songs.length}`);

    // Do not send text if there is a playlist
    if (!playlist) return msg.channel.send(text.bot.addToQueueF(song.title));
    else return;
  }

  return;
}

async function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  // After no more songs, disconnect and delete guild queue
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  console.log(`Queue length: ${serverQueue.songs.length}`);

  const dispatcher = serverQueue.connection
    .playStream(ytdl(song.url, { filter: 'audioonly' }))
    .on('end', reason => {
      if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', error => console.error)
    .on('disconnect', () => console.log(text.bot.voiceDisconnect));

  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.send(text.bot.playF(song.title));
}

client
  .on('warn', console.warn)
  .on('error', console.error)
  .on('disconnect', () => console.log(text.bot.disconnected))
  .on('reconnecting', () => console.log(text.bot.reconnecting))
  .on('ready', onReady)
  .on('message', handleMessage)
  .login(config.discordBotToken)
  .catch(err => console.error);

//
//
// Express stuff
//
//

const app = express();
app.use(express.static('express/static'));

app.get('/', (_req, res) => res.sendFile(__dirname + '/express/index.html'));

app.use((_req, res, _next) => res.status(404).sendFile(__dirname + '/express/404.html'));

const listener = app.listen(expressPort, async () => console.log(text.other.expressStartF(expressPort)));
