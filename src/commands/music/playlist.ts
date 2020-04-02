import { CommandArguments } from '../shared/types';
import { Video } from '../shared/youtube';
import { updateQueueMessage } from './controlMessages';
import { addToQueue, play } from './playback';

export async function playlist({ cmd, msg, guildQueue, guildVoice, queue, youtube, execArgs }: CommandArguments) {
  const playlist = await youtube.getPlaylist(cmd);
  const videos: Array<Video> = await playlist.getVideos();
  
  let fetchedVideos: Video[] = [];
  const loadingMessage = await msg.channel.send('Fetching videos...');
  for (const playlistVideo of Object.values(videos)) {
    const video = await playlistVideo.fetch();
    fetchedVideos.push(video);
  }
  loadingMessage.delete();
  fetchedVideos.forEach(video => addToQueue({ msg, video, guildQueue }));

  updateQueueMessage(execArgs);
  queue.set(msg.guild.id, guildQueue);

  const voiceArgs = {
    ...execArgs,
    voiceChannel: msg.member.voice.channel,
    song: guildQueue.songs[0]
  };
  if (!guildVoice.playing) play(voiceArgs);
}
