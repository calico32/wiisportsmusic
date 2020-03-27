import { help } from './commands/help';
import { install } from './commands/install';
import { ping } from './commands/ping';
import { prefix } from './commands/prefix';
import { uninstall } from './commands/uninstall';
import { channel } from './commands/channel';

export const globalCommands = { ping, prefix, install, help, uninstall, channel };
export const playback = [ 'play', 'stop', 'remove', 'skip', 'search' ]