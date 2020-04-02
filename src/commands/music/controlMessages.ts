import { MessageEmbed, TextChannel } from 'discord.js';
import { embedDefaults } from '../shared/embed';
import { CommandArguments, Song } from '../shared/types';
import { DurationObject } from '../shared/youtube';

export async function createControlMessages({ msg, queue, config }: CommandArguments) {
  const guildConfig = config.get(msg.guild.id);
  const guildQueue = queue.get(msg.guild.id);

  const controlChannel = (await msg.client.channels.fetch(guildConfig.controlChannelId)) as TextChannel;

  let thumbnailEmbed = new MessageEmbed()
    .setAuthor(...embedDefaults.author)
    .setTitle('Nothing playing')
    .attachFiles([embedDefaults.attachments['circle-192.png']]);

  const queueList = makeQueueMessage(guildQueue.songs);

  const thumbnailMessage = await controlChannel.send(thumbnailEmbed);
  const queueMessage = await controlChannel.send(queueList);

  guildQueue.thumbnailMessage = thumbnailMessage;
  guildQueue.queueMessage = queueMessage;

  queue.set(msg.guild.id, guildQueue);
}

export async function updateQueueMessage({ msg, queue, config }: CommandArguments) {
  // const guildConfig = config.get(msg.guild.id);
  const guildQueue = queue.get(msg.guild.id);

  // const controlChannel = (await msg.client.channels.fetch(guildConfig.controlChannelId)) as TextChannel;

  const queueList = makeQueueMessage(guildQueue.songs);

  guildQueue.queueMessage.edit(queueList);
}

export async function updateThumbnail({ msg, queue, config }: CommandArguments) {
  const guildQueue = queue.get(msg.guild.id);
  const thisSong = guildQueue.songs[0].video;

  const thumbnailEmbed = makeThumbnailEmbed({
    duration: thisSong.duration,
    thumbnailUrl: thisSong.thumbnail.url,
    title: thisSong.title
  });

  guildQueue.thumbnailMessage.edit(thumbnailEmbed);
}

function makeThumbnailEmbed({ thumbnailUrl, title, duration }: { thumbnailUrl: string; title: string; duration: DurationObject }) {
  const thumbnailEmbed = new MessageEmbed()
    .attachFiles([embedDefaults.attachments['circle-192.png']])
    .setAuthor(...embedDefaults.author)
    .setTitle(title + ' ' + formatDuration(duration))
    .setImage(thumbnailUrl);

  return thumbnailEmbed;
}

function makeQueueMessage(songs: Song[]) {
  let queueList = '**Queue**\n';

  const maxSongs = 15;
  const songsToDisplay = songs.length > maxSongs ? maxSongs : songs.length - 1;
  for (let i = 0; i < songsToDisplay; i++) {
    const song = songs[i + 1];
    const formattedDuration = formatDuration(song.video.duration);
    queueList += `${i + 1}. ${song.video.title} ${formattedDuration}\n`;
  }
  if (songs.length > maxSongs) queueList += `*${songs.length - maxSongs} more...*`;

  return queueList;
}

function formatDuration(durationObj: DurationObject) {
  let output = '[';
  output += durationObj.hours ? durationObj.hours + ':' : '';
  output += durationObj.minutes ? durationObj.minutes + ':' : '0:';
  output += durationObj.seconds ? durationObj.seconds.toString().padStart(2, '0') + ']' : '';
  return output;
}

