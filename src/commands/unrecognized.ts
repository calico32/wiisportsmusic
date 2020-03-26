import { CommandArguments } from './shared/args';
import { messageDetails } from './shared/messageDetails';

export function unrecognized({ msg, args, cmd, serverPrefix }: CommandArguments) {
  return msg.channel.send(`Unrecognized command \`${cmd}\`.
${messageDetails({ msg, cmd, args, serverPrefix })}`);
}
