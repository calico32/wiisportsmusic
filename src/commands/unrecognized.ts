import { CommandArguments } from './shared/args';
import { sendCurrentState } from './shared/sendCurrentState';

export async function unrecognized({ msg, args, cmd, queue, config }: CommandArguments) {
  await msg.channel.send(`Unrecognized command \`${cmd}\`.`);
  sendCurrentState({ msg, args, cmd, config, queue });
}
