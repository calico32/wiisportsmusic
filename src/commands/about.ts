import { Message } from 'discord.js';
import { Command, commands } from '.';
import { Embed } from '../embed';
import { CmdArgs } from '../types';

export class CommandAbout implements Command {
  cmd = 'about';
  docs = {
    usage: 'about',
    description: 'Show about message.',
  };
  async executor(cmdArgs: CmdArgs): Promise<void | Message> {
    const embed = new Embed().setTitle('about!!!!!!1');
    embed
      .addField('wheere is source code', 'go to https://github.com/wiisportsresort/wiisportsmusic')
      .addField('why is this so bad', 'yes')
      .addField('bye', 'g00dbEy');
    return cmdArgs.msg.channel.send(embed);
  }
}
