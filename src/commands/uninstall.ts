import { writeConfig } from '../bot';
import { CommandArguments, defaults } from './shared/args';
import { sendCurrentState } from './shared/sendCurrentState';

export async function uninstall({ msg, args, cmd, config, queue }: CommandArguments) {
  const guildConfig = config.get(msg.guild.id);
  
  if (!guildConfig.setupCompleted) {
    msg.channel.send(`wiisportsmusic is not installed! Run setup with \`${guildConfig.prefix}install\`.`);
    return;
  }
  const controlChannel = msg.guild.channels.resolve(guildConfig.controlChannelId);
  if (controlChannel) controlChannel.delete(`User called ${guildConfig.prefix}remove`);

  config.set(msg.guild.id, defaults.config);
  queue.set(msg.guild.id, defaults.queue);
  console.log(config.get(msg.guild.id));
  await msg.channel.send('Control channel was removed and configuration was set back to defaults.');
  sendCurrentState({ msg, args, cmd, config, queue });

  writeConfig(config);
}
