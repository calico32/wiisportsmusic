import { playback } from '../../commands';
import { CommandArguments } from '../shared/types';
import { video } from './video';
import { playlist } from './playlist';

export default async function controlEntry({ msg, cmd, args, config, queue, youtube, voice }: CommandArguments) {
  try {
    const guildQueue = queue.get(msg.guild.id);
    const guildVoice = voice.get(msg.guild.id);

    const command = validCommand(cmd);
    if (!msg.member.voice.channel && command != null) {
      const error = await msg.channel.send(`<@${msg.author.id}>, you must be in a voice channel to use this command.`);
      setTimeout(() => error.delete(), 5000);
      return;
    }

    msg.delete();

    const execArgs: CommandArguments = {
      msg,
      args,
      cmd,
      config,
      queue,
      youtube,
      voice,
      guildQueue,
      guildVoice
    };

    switch (command) {
      case null:
        return;
      case 'video':
        video({ ...execArgs, execArgs });
        return;
      case 'playlist':
        playlist({ ...execArgs, execArgs });
        return;
      // TODO case 'play':
      // TODO case 'stop':
      // TODO case 'remove':
    }
  } catch (err) {
    console.error(err);
  }
}

function validCommand(cmd): string {
  if (cmd === 'msg') return 'msg';
  else if (playback.includes(cmd)) return cmd;
  else if (cmd.match(/^(https?:\/\/)?((www|music|)\.?youtube\.com)\/playlist(.*)$/i)) return 'playlist';
  else if (
    cmd.match(
      /(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/\S*?[^\w\s-])((?!videoseries)[\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*|[\w-]{11}/i
    )
  )
    return 'video';
  else return null;
}
