import YoutubeAPI from 'simple-youtube-api';

export interface Channel {
  commentCount: number;
  country: string;
  customURL: string;
  defaultLanguage: string;
  description: string;
  full: boolean;
  hiddenSubscriberCount: boolean;
  id: string;
  kind: string;
  localized: Object;
  publishedAt: Date;
  raw: Object;
  relatedPlaylists: Object;
  subscriberCount: number;
  thumbnails: Object;
  title: string;
  type: string;
  url: string;
  videoCount: number;
  viewCount: number;
  youtube: YoutubeAPI;
  extractID: (urL: string) => string;
  fetch: (options?: object) => Channel;

}
export interface Video {
  channel?: Channel;
  description?: string;
  duration?: DurationObject;
  durationSeconds?: number;
  full?: boolean;
  id?: string;
  kind?: string;
  maxRes?: object;
  publishedAt?: Date;
  raw?: object;
  shortURL?: string;
  thumbnails?;
  title?: string;
  url?: string;
  youtube?: YoutubeAPI;
  extractID?: (url: string) => string;
  fetch?: (options?: object) => Promise<Video>;
}
export interface Playlist {
  channel: Channel;
  channelTitle: string;
  defaultLanguage: string;
  description: string;
  embedHTML: string;
  id: string;
  length: number;
  localized: Object;
  privacy: string;
  publishedAt: Date;
  thumbnails;
  title: string;
  url: string;
  videos: Array<Video>
  youtube: YoutubeAPI;
  fetch: (options?: object) => Video;
}
export interface Youtube {
  key: string;
  getChannel: (url: string, options?: object) => Promise<Channel>;
  getChannelByID: (id: string, options?: object) => Promise<Channel>;
  
  getPlaylist: (url: string, options?: object) => Promise<Playlist>;
  getPlaylistByID: (id: string, options?: object) => Promise<Playlist>;
  
  getVideo: (url: string, options?: object) => Promise<Video>;
  getVideoByID: (id: string, options?: object) => Promise<Video>;

  search: (query: string, limit?: number, options?: object) => Promise<Array<(Video|Playlist|Channel|null)>>
  
  searchChannels: (query: string, limit?: number, options?: object) => Promise<Array<Channel>>
  
  searchPlaylists: (query: string, limit?: number, options?: object) => Promise<Array<Playlist>>
  
  searchVideos: (query: string, limit?: number, options?: object) => Promise<Array<Video>>
  
}

export type DurationObject = {
  hours: number;
  minutes: number;
  seconds: number;
}