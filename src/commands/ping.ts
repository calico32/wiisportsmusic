import { CommandArguments } from './shared/args';
import { sendCurrentState } from './shared/sendCurrentState';

export async function ping({ msg, args, cmd, config, queue }: CommandArguments) {
  await msg.channel.send(`Pong!`);
  sendCurrentState({ msg, args, cmd, config, queue })
}
