import * as Discord from 'discord.js';
import { config as dotenvConfig } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as YoutubeAPI from 'simple-youtube-api';
import { globalCommands } from './commands';
import playbackCommand from './commands/playback';
import { CommandArguments, ConfigMap, defaults, GuildConfig, GuildQueue } from './commands/shared/args';
import { Youtube } from './commands/shared/youtube';
import { unrecognized } from './commands/unrecognized';
import Util from './Util';

dotenvConfig({ path: '../.env' });

const client = new Discord.Client();
const youtube: Youtube = new YoutubeAPI(process.env.YOUTUBE_API_KEY);

// ytdl('https://youtu.be/Xl2P4a7kM2U')

const configFilePath = path.resolve('./data/config.json');
let config = new Map<Discord.Snowflake, GuildConfig>();
let queue = new Map<Discord.Snowflake, any>();

client.on('message', msg => {
  if (msg.author.bot) return;
  let guildConfigCache = config.get(msg.guild.id);
  if (guildConfigCache) if (!msg.content.startsWith(config.get(msg.guild.id).prefix) && msg.channel.id !== guildConfigCache.controlChannelId) return;

  try {
    console.log('Successfully read config file from ' + configFilePath);
    config = Util.jsonToMap(fs.readFileSync(configFilePath, 'utf8'));
  } catch (err) {
    console.log('There was an error reading the config file:\n  - ' + err + '\nThe config map was set to an empty map.');
    config = new Map<Discord.Snowflake, GuildConfig>();
  }

  let guildConfig: GuildConfig;
  if (config.has(msg.guild.id)) guildConfig = config.get(msg.guild.id);
  else {
    guildConfig = defaults.config;
    config.set(msg.guild.id, defaults.config);
  }

  let guildQueue: GuildQueue;
  if (queue.has(msg.guild.id)) guildQueue = queue.get(msg.guild.id);
  else {
    guildQueue = defaults.queue;
    queue.set(msg.guild.id, defaults.queue);
  }

  const inControlChannel = msg.channel.id === guildConfig.controlChannelId;
  if (!msg.content.startsWith(guildConfig.prefix) && !inControlChannel) return;
  if (inControlChannel && msg.content.match(/<(.+)>/)) msg.content = msg.content.replace(/<(.+)>/g, '');

  const args = msg.content.split(' ').slice(1);
  let cmd = msg.content.split(' ')[0]; 

  if (!inControlChannel) cmd = cmd.toLowerCase().slice(guildConfig.prefix.length);
  else if (msg.content.startsWith(guildConfig.prefix) && inControlChannel) cmd = cmd.slice(guildConfig.prefix.length);

  const execArgs: CommandArguments = { msg, args, cmd, config, queue, youtube };

  if (inControlChannel) {
    playbackCommand(execArgs);
  } else {
    if (Object.hasOwnProperty.call(globalCommands, cmd)) globalCommands[cmd](execArgs);
    else unrecognized(execArgs);
  }
});

export function writeConfig(configMap: ConfigMap) {
  fs.writeFileSync(configFilePath, Util.mapToJSON(configMap, true));
}

client
  .on('error', console.error)
  .on('debug', console.debug)
  .on('ready', () => console.log(`${client.user.tag} ready!`));

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
