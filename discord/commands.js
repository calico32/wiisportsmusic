/* jslint ignore: start */
const text = require('./text');

module.exports = {
  play: async ({ 
    msg, 
    youtube, 
    handleVideo, 
    url, 
    searchString
  }) => {
    const voiceChannel = msg.member.voiceChannel;

    if (!voiceChannel) return msg.channel.send(text.user.notInVoiceChannel);

    const permissions = voiceChannel.permissionsFor(msg.client.user);

    if (!permissions.has('CONNECT')) return msg.channel.send(text.bot.cannotConnect);
    if (!permissions.has('SPEAK')) return msg.channel.send(text.bot.cannotSpeak);

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id);
        await handleVideo({
          video: video2, 
          msg, 
          voiceChannel, 
          playlist: true
        });
      }

      return msg.channel.send(text.bot.addToQueueF(playlist.title));
    } else {
      let video, videos, response;
      try {
        video = await youtube.getVideo(url);
      } catch (error) {
        try {
          videos = await youtube.searchVideos(searchString, 10);
          msg.channel.send(text.bot.searchResultsF(videos));
          try {
            response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
              maxMatches: 1,
              time: 10000,
              errors: ['time']
            });
          } catch (err) {
            console.error(err);
            return msg.channel.send(text.user.invalidSearchSelection);
          }
          const videoIndex = parseInt(response.first().content);
          video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch (err) {
          console.error(err);
          return msg.channel.send(text.bot.noSearchResults);
        }
      }
      return handleVideo({video, msg, voiceChannel});
    }
  },
  skip: ({ msg, serverQueue }) => {
    if (!msg.member.voiceChannel) return msg.channel.send(text.user.notInVoiceChannel);
    if (!serverQueue) return msg.channel.send(text.bot.nothingPlaying);

    serverQueue.connection.dispatcher.end('Skip command has been used!');

    return;
  },
  stop: ({ msg, queue, serverQueue }) => {
    if (!msg.member.voiceChannel) return msg.channel.send(text.user.notInVoiceChannel);
    if (!queue) return msg.channel.send(text.bot.nothingPlaying);

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end('Stop command has been used!');

    return;
  },
  volume: ({ msg, serverQueue, args }) => {
    if (!msg.member.voiceChannel) return msg.channel.send(text.user.notInVoiceChannel);
    if (!serverQueue) return msg.channel.send(text.bot.nothingPlaying);

    if (!args[1]) return msg.channel.send(text.bot.currentVolumeF(serverQueue.volume));

    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return msg.channel.send(text.bot.setVolumeF(args[1]));
  },
  playing: ({ msg, serverQueue }) => {
    if (!serverQueue) return msg.channel.send(text.bot.nothingPlaying);
    return msg.channel.send(text.bot.playF(serverQueue.songs[0].title));
  },
  queue: ({ msg, serverQueue }) => {
    if (!serverQueue) return msg.channel.send(text.bot.nothingPlaying);
    return msg.channel.send(text.bot.queueF(serverQueue.songs));
  },
  pause: ({ msg, serverQueue }) => {
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return msg.channel.send(text.bot.pausePlayback);
    }
    return msg.channel.send(text.bot.nothingPlaying);
  },
  resume: ({ msg, serverQueue }) => {
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return msg.channel.send(text.bot.resumePlayback);
    }
    return msg.channel.send(text.bot.nothingPlaying);
  },
  help: ({ msg, prefix }) => msg.channel.send(text.user.helpF(prefix)),
  source: ({ msg }) => msg.channel.send(text.bot.sourceCode),
  prefix: ({ msg }) => {},
  restart: ({ msg, config }) => {
    
    if (msg.author.id === config.ownerId) {
      console.log(text.bot.restarting);
      msg.channel.send(text.bot.restarting);
      process.exit(0);
    } else return msg.channel.send(text.user.insufficientPermissions)
  },
  unrecognized: () => {}
};
