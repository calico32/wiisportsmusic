import { Message } from 'discord.js';
import { CmdArgs } from '../types';
import { CommandAbout } from './about';
import { CommandHelp } from './help';
import { CommandPlay } from './play';
import { CommandPrefix } from './prefix';
import { CommandQueue } from './queue';
import { CommandSkip } from './skip';
import { CommandStop } from './stop';

export interface Command {
  cmd: string | string[];
  executor: (args: CmdArgs) => Promise<void | Message>;
  docs: CommandDocs | CommandDocs[];
}

export interface CommandDocs {
  usage: string | string[];
  description: string;
}

export const commands: Command[] = [
  new CommandAbout(),
  new CommandHelp(),
  new CommandPlay(),
  new CommandPrefix(),
  new CommandQueue(),
  new CommandSkip(),
  new CommandStop(),
];
