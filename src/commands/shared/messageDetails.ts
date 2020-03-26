import { CommandArguments } from "./args";

export function messageDetails({ msg, args, cmd, serverPrefix }: CommandArguments) {
  return `--
Message details:
  - Full message: \`${msg.content}\`
  - Command: \`${cmd}\`
  - Arguments: ${args.length != 0 ? `\`${args.join(', ')}\`` : '(none)'}
  - Guild prefix: \`${serverPrefix}\``;
}