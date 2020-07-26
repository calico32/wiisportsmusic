/* eslint-disable no-empty */
import { Message, MessageEmbed } from 'discord.js';
import { Command, CommandDocs, commands } from '.';
import { Embed } from '../embed';
import { CmdArgs } from '../types';

export class CommandHelp implements Command {
  cmd = ['help', 'h'];
  docs = {
    usage: 'help',
    description: 'Show this message.',
  };
  async executor(cmdArgs: CmdArgs): Promise<void | Message> {
    const { msg, configStore } = cmdArgs;
    const { prefix } = configStore.get(msg.guild?.id as string);
    const embed = new Embed().setTitle('help!!!!!!1');
    for (const command of commands) {
      const fieldName = Array.isArray(command.cmd)
        ? command.cmd.map(cmd => `\`${prefix}${cmd}\``).join(', ')
        : `\`${prefix}${command.cmd}\``;

      const fieldValue = Array.isArray(command.docs)
        ? command.docs.map(this.formatFieldValue).join('\n\n')
        : this.formatFieldValue(command.docs);

      embed.addField(fieldName, fieldValue + '\n---', false);
    }
    return cmdArgs.msg.channel.send(embed);
  }

  formatFieldValue(docs: CommandDocs): string {
    let usage = '`' + docs.usage + '`';
    if (Array.isArray(docs.usage)) {
      usage = docs.usage.map(v => '`' + v + '`').join('\n');
    }
    return `${usage}\n${docs.description}`;
  }
}
