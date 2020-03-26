import * as Discord from 'discord.js';
import { config } from 'dotenv';
import * as path from 'path';
import { ping } from './commands/ping';
import { prefix } from './commands/prefix';
import { CommandArguments } from './commands/shared/args';
import { unrecognized } from './commands/unrecognized';
import * as fs from 'fs';
import Util from './Util';
config({ path: '../.env' });

const client = new Discord.Client();

const prefixesFilePath = path.resolve(process.env.NODE_PATH, 'data/prefixes.json');

let prefixes: Map<Discord.Snowflake, string>;
try {
  prefixes = Util.jsonToMap(fs.readFileSync(prefixesFilePath, 'utf8'));
} catch (err) {
  console.log('There was an error reading the prefixes file:\n  ' + err + '\nThe prefixes map was set to an empty map.');
  prefixes = new Map<Discord.Snowflake, string>();
}

const queues = new Map<Discord.Snowflake, any>();
 
const defaults = {
  prefix: '^'
};

client.on('message', msg => {
  if (prefixes.get(msg.guild.id) == null) prefixes.set(msg.guild.id, defaults.prefix);
  const serverPrefix = prefixes.get(msg.guild.id);

  if (msg.author.bot || !msg.content.startsWith(serverPrefix)) return;

  const args = msg.content.split(' ').slice(1);
  const cmd = msg.content
    .toLowerCase()
    .split(' ')[0]
    .slice(serverPrefix.length);

  const execArgs: CommandArguments = { msg, args, cmd, serverPrefix, prefixes, prefixesFilePath };

  const allowedCommands = { ping, prefix };
  if (Object.hasOwnProperty.call(allowedCommands, cmd)) allowedCommands[cmd](execArgs);
  else unrecognized(execArgs);
});

client
  .on('error', console.error)
  .on('debug', console.debug)
  .on('ready', () => console.log(`${client.user.tag} ready!`));

client.login(process.env.TOKEN).catch(console.error);
