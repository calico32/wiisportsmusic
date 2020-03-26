import { CommandArguments } from './shared/args';
import { messageDetails } from './shared/messageDetails';

export function ping({ msg, args, cmd, serverPrefix }: CommandArguments) {
  msg.channel.send(`Pong!
${messageDetails({ msg, args, cmd, serverPrefix })}`);
}
