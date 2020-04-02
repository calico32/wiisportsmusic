import ytdl from 'ytdl-core';
import { CommandArguments } from '../shared/types';
import { updateQueueMessage, updateThumbnail } from './controlMessages';

export function addToQueue({ msg, video, guildQueue }: CommandArguments) {
  const { id, title, url, thumbnails, duration: { hours, minutes, seconds } } = video;
  const songItem = {
    video: {
      id,
      title,
      url,
      thumbnail: thumbnails.high,
      duration: { hours, minutes, seconds }
    },
    requester: msg.author.id
  };
  
  console.log('added song ' + songItem.video.title);
  guildQueue.songs.push(songItem);
}


export async function play({ queue, msg, voiceChannel, song, voice, config }: CommandArguments) {
  const guildQueue = queue.get(msg.guild.id);
  const guildVoice = voice.get(msg.guild.id);

  // no more songs in queue
  if (song == null) {
    guildVoice.connection.disconnect();
    guildVoice.playing = false;
    voice.set(msg.guild.id, guildVoice);

    guildQueue.songs = [];
    queue.set(msg.guild.id, guildQueue);
    return;
  }

  updateThumbnail({ msg, queue, config });
  updateQueueMessage({ msg, queue, config });

  guildVoice.playing = true;
  guildVoice.connection = await voiceChannel.join();
  msg.guild.voice.setSelfDeaf(true);

  guildVoice.connection
    .play(ytdl(song.video.url, { filter: 'audioonly' }))
    .on('finish', (reason: string) => {
      if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
      else console.log(reason);

      guildQueue.songs.shift();
      queue.set(msg.guild.id, guildQueue);
      play({ queue, msg, voiceChannel, song: guildQueue.songs[0], voice, config });
    })
    .on('error', console.error);
  voice.set(msg.guild.id, guildVoice);
}
