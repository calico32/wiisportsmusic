import * as Discord from 'discord.js';
import YoutubeAPI from 'simple-youtube-api';
import { Video, Thumbnail, DurationObject } from './youtube';

export interface CommandArguments {
  msg: Discord.Message | Discord.PartialMessage;
  args?: Array<string>;
  cmd?: string;
  config?: ConfigMap;
  queue?: QueueMap;
  youtube?: YoutubeAPI;
  video?: Video;
  voice?: VoiceMap;
  song?: Song;
  voiceChannel?: Discord.VoiceChannel;
  client?: Discord.Client;
  guildQueue?: GuildQueue;
  guildConfig?: GuildConfig;
  guildVoice?: GuildVoice;
  execArgs?: CommandArguments
}
export type ConfigMap = Map<Discord.Snowflake, GuildConfig>;
export type QueueMap = Map<Discord.Snowflake, GuildQueue>;
export type VoiceMap = Map<Discord.Snowflake, GuildVoice>;

export interface GuildConfig {
  prefix: string;
  controlChannelId: Discord.Snowflake;
  setupCompleted: boolean;
  controlMessages: {
    thumbnailEmbed: Discord.Message;
    queueList: Discord.Message;
  }
}

export interface GuildQueue {
  songs: Array<Song>;
  thumbnailMessage: Discord.Message;
  queueMessage: Discord.Message;
}

export interface GuildVoice {
  playing: boolean;
  connection: Discord.VoiceConnection;
}

export const defaults = {
  config: <GuildConfig>{
    prefix: '^',
    setupCompleted: false
  },
  queue: <GuildQueue>{
    songs: [],
    thumbnailMessage: null,
    queueMessage: null
  },
  voice: <GuildVoice>{
    playing: false,
    connection: null
  }
};

export interface Song {
  video: {
    id: string;
    title: string;
    url: string;
    thumbnail: Thumbnail;
    duration: DurationObject;
  };
  requester: Discord.Snowflake;
}
