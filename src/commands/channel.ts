import { CommandArguments } from './shared/args';

export function channel({ msg, config }: CommandArguments) {
  const guildConfig = config.get(msg.guild.id);
  
  if (!guildConfig.setupCompleted) {
    msg.channel.send(`wiisportsmusic is not installed! Run setup with \`${guildConfig.prefix}install\`.`);
    return;
  }

  msg.channel.send(`The music control channel is <#${guildConfig.controlChannelId}>.`)
}
