import { CommandArguments } from '../shared/types';
import { Video } from '../shared/youtube';
import { updateQueueMessage } from './controlMessages';
import { play, addToQueue } from './playback';

export async function video({ execArgs, cmd, args, msg, guildQueue, guildVoice, queue, youtube }: CommandArguments) {
  let loops = 1;
  if (args.includes('--loops')) loops = parseInt(args[args.indexOf('--loops') + 1]);
  let video: Video;
  try {
    if (cmd.match(/^[\w-]{11}$/)) video = await youtube.getVideoByID(cmd);
    else video = await youtube.getVideo(cmd);
  } catch (err) {
    return;
  }
  for (let i = 0; i < loops; i++)
    addToQueue({
      ...execArgs,
      video,
      voiceChannel: msg.member.voice.channel
    });

  updateQueueMessage(execArgs);
  queue.set(msg.guild.id, guildQueue);
  
  const voiceArgs = {
    ...execArgs,
    voiceChannel: msg.member.voice.channel,
    song: guildQueue.songs[0]
  };
  if (!guildVoice.playing) play(voiceArgs);
}
