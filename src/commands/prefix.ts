import { CommandArguments } from './shared/args';
import { messageDetails } from './shared/messageDetails';
import * as fs from 'fs';
import Util from '../Util';

export function prefix({ msg, args, cmd, prefixes, prefixesFilePath }: CommandArguments) {
  if (args.length > 1) {
    msg.channel.send('Too many arguments; only supply one argument.')
    return;
  }
  prefixes.set(msg.guild.id, args[0]);
  const newPrefix = prefixes.get(msg.guild.id);

  fs.writeFileSync(prefixesFilePath, Util.mapToJSON(prefixes));

  msg.channel.send(`Successfully set guild prefix to ${newPrefix}.
${messageDetails({msg, args, cmd, serverPrefix: newPrefix })}`);
}
