import { playback } from '../commands';
import { CommandArguments, Song } from './shared/args';
import { sendCurrentState } from './shared/sendCurrentState';
import { Video } from './shared/youtube';
import ytdl from 'ytdl-core';

export default async function playbackCommand({ msg, cmd, args, config, queue, youtube }: CommandArguments) {
  const command = validCommand(cmd);
  if (!msg.member.voice.channel && command != null) {
    const error = await msg.channel.send(`<@${msg.author.id}>, you must be in a voice channel to use this command.`);
    setTimeout(() => error.delete(), 5000);
    return;
  }
  switch (command) {
    case null:
      msg.delete();
      return;
    case 'video':
      videoLink({ msg, args, cmd, config, queue, youtube });
      return;
    case 'playlist':
      playlistLink({ msg, args, cmd, config, queue, youtube });
      return;
    // TODO case 'search':
    // TODO case 'play':
    // TODO case 'stop':
    // TODO case 'remove':
  }

  msg.channel.send('Valid command recieved!');
  sendCurrentState({ msg, args, cmd, config, queue });
}

function validCommand(cmd): string {
  if (playback.includes(cmd)) return cmd;
  else if (cmd.match(/^(https?:\/\/)?((www|music|)\.?youtube\.com)\/playlist(.*)$/i)) return 'playlist';
  else if (
    cmd.match(
      /(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/\S*?[^\w\s-])((?!videoseries)[\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*|[\w-]{11}/i
    )
  )
    return 'video';
  else return null;
}

async function videoLink({ cmd, args, msg, config, queue, youtube }: CommandArguments) {
  let loops = 1;
  if (args.includes('--loops')) {
    loops = parseInt(args[args.indexOf('--loops') + 1]);
  }
  let video: Video;
  console.log(JSON.stringify(cmd));
  try {
    if (cmd.match(/^[\w-]{11}$/)) {
      video = await youtube.getVideoByID(cmd);
    } else {
      video = await youtube.getVideo(cmd);
    }
  } catch (err) {
    console.error(err);
    return;
  }

  play({
    msg,
    video,
    voiceChannel: msg.member.voice.channel,
    queue
  });

  msg.channel.send('Video link received! Loops: ' + loops);

  sendCurrentState({ msg, args, cmd, config, queue });
}
async function playlistLink({ cmd, args, msg, config, queue, youtube }: CommandArguments) {
  const playlist = await youtube.getPlaylist(cmd);
  const videos: Array<Video> = await playlist.getVideos();
  let output: string = '';
  for (const playlistVideo of Object.values(videos)) {
    const video = await playlistVideo.fetch();
    output += video.title + '\n';
  }

  msg.channel.send('Playlist link received!\nVideo titles: \n' + output);

  sendCurrentState({ msg, args, cmd, config, queue });
}

async function play({ msg, video, voiceChannel, queue }: CommandArguments) {
  const guildQueue = queue.get(msg.guild.id);

  const { id, title, url } = video;
  guildQueue.songs.push({ video: { id, title, url }, requester: msg.author });

  if (guildQueue.playing) return;
  else {
    const connection = await voiceChannel.join();
    voiceChannel.guild.voice.setSelfDeaf(true);
    const dispatcher = connection
    .play(
      ytdl(video.url, {
        filter: 'audioonly'
      })
    )
    .on('end', reason => {
      if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
      else console.log(reason);
      //serverQueue.songs.shift();
      //play(guild, serverQueue.songs[0]);
    })
    .on('error', error => console.error)
    .on('disconnect', () => {});
  }
}
/*
export interface Song {
  video: {
    id: string;
    title: string;
    url: string;
  }
  requester: Discord.GuildMember;
}
*/
