import { writeConfig } from '../bot';
import { CommandArguments } from './shared/args';
import { sendCurrentState } from './shared/sendCurrentState';

export async function install({ msg, args, cmd, config, queue }: CommandArguments) {
  const guildConfig = config.get(msg.guild.id);
  
  if (guildConfig.setupCompleted) {
    msg.channel.send(
      `wiisportsmusic is already installed! If you need to reinstall, use \`${guildConfig.prefix}uninstall\` and \`${guildConfig.prefix}install\` to regenerate the control channel and configuration.`
    );
    return;
  }
  const guildMemberAuthor = await msg.guild.members.fetch(msg.author);
  if (!guildMemberAuthor.hasPermission('ADMINISTRATOR')) {
    msg.channel.send('You must have the `ADMINISTRATOR` permission to use this command.');
    return;
  }

  const controlChannel = await msg.guild.channels.create('wiisportsmusic', {
    type: 'text',
    topic: 'wiisportsmusic control panel'
  });
  
  guildConfig.controlChannelId = controlChannel.id;
  guildConfig.setupCompleted = true;
  config.set(msg.guild.id, guildConfig);

  await msg.channel.send(
    `The channel <#${controlChannel.id}> was successfully created. Use this channel to control the music and see what's playing. You can rename and move this channel however you wish.`
  );
  sendCurrentState({ msg, args, cmd, config, queue });

  writeConfig(config);
}
