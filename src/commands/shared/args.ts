import { Message, PartialMessage, Snowflake } from 'discord.js';

export interface CommandArguments {
  msg: Message | PartialMessage;
  args: Array<string>;
  cmd: string;
  serverPrefix?: string;
  prefixes?: Map<Snowflake, string>;
  prefixesFilePath?: string;
}
