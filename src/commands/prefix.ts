import { CommandArguments } from './shared/types';
import { sendCurrentState } from './shared/sendCurrentState';
import * as fs from 'fs';
import Util from '../Util';
import { writeConfig } from '../bot';

export async function prefix({ msg, args, cmd, config, queue }: CommandArguments) {
  const guildConfig = config.get(msg.guild.id);

  if (args.length > 1) {
    msg.channel.send('Too many arguments; only supply one argument.');
    return;
  }
  if (args.length == 0) {
    msg.channel.send('Not enough arguments; supply exactly one argument.');
    return;
  }
  guildConfig.prefix = args[0];

  config.set(msg.guild.id, guildConfig);

  writeConfig(config);

  await msg.channel.send(`Successfully set guild prefix to ${guildConfig.prefix}.`);
  sendCurrentState({ msg, args, cmd, config, queue });
}
