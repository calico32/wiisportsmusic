import * as Discord from 'discord.js';
import YoutubeAPI from 'simple-youtube-api';
import { Video } from './youtube';

export interface CommandArguments {
  msg: Discord.Message | Discord.PartialMessage;
  args?: Array<string>;
  cmd?: string;
  config?: ConfigMap;
  queue?: QueueMap;
  youtube?: YoutubeAPI;
  video?: Video;
  song?: Song;
  voiceChannel?: Discord.VoiceChannel;
}
export type ConfigMap = Map<Discord.Snowflake, GuildConfig>;
export type QueueMap = Map<Discord.Snowflake, GuildQueue>;

export interface GuildConfig {
  prefix: string;
  controlChannelId: Discord.Snowflake;
  setupCompleted: boolean;
}

export interface GuildQueue {
  playing: boolean;
  voiceChannel: Discord.VoiceChannel;
  connection: Discord.VoiceConnection;
  songs: Array<Song>;
  volume: 0|1|2|3|4|5;
}

export const defaults = {
  config: <GuildConfig>{
    prefix: '^',
    setupCompleted: false,
  },
  queue: <GuildQueue>{
    songs: [],
    volume: 3,
    playing: false,
  }
};

export interface Song {
  video: {
    id: string;
    title: string;
    url: string;
    
  }
  requester: Discord.User;
}