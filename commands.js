/* jslint ignore: start */
const text = require('./text');

module.exports = {
  play: async ({ 
    message: msg, 
    youtubeAPI: youtube, 
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
        await handleVideo(video2, msg, voiceChannel, true);
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
      return handleVideo(video, msg, voiceChannel);
    }
  },
  skip: ({ message: msg, serverQueue }) => {
    if (!msg.member.voiceChannel) return msg.channel.send(text.user.notInVoiceChannel);
    if (!serverQueue) return msg.channel.send(text.bot.nothingPlaying);

    serverQueue.connection.dispatcher.end('Skip command has been used!');

    return;
  },
  stop: ({ message: msg, queue, serverQueue}) => {
    if (!msg.member.voiceChannel) return msg.channel.send(text.user.notInVoiceChannel);
    if (!queue) return msg.channel.send(text.bot.nothingPlaying);

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end('Stop command has been used!');

    return;
  },
  volume: ({ message: msg, serverQueue, args }) => {
    if (!msg.member.voiceChannel) return msg.channel.send(text.user.notInVoiceChannel);
    if (!serverQueue) return msg.channel.send(text.bot.nothingPlaying);

    if (!args[1]) return msg.channel.send(text.bot.currentVolumeF(serverQueue.volume));

    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return msg.channel.send(text.bot.setVolumeF(args[1]));
  },
  playing: ({ message: msg, serverQueue }) => {
    if (!serverQueue) return msg.channel.send(text.bot.nothingPlaying);
    return msg.channel.send(text.bot.playF(serverQueue.songs[0].title));
  },
  queue: ({ message: msg, serverQueue }) => {
    if (!serverQueue) return msg.channel.send(text.bot.nothingPlaying);
    return msg.channel.send(text.bot.queueF(serverQueue.songs));
  },
  pause: ({ message: msg, serverQueue }) => {
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return msg.channel.send(text.bot.pausePlayback);
    }
    return msg.channel.send(text.bot.nothingPlaying);
  },
  resume: ({ message: msg, serverQueue }) => {
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return msg.channel.send(text.bot.resumePlayback);
    }
    return msg.channel.send(text.bot.nothingPlaying);
  },
  help: ({ message: msg, prefix }) => msg.channel.send(text.user.helpF(prefix)),
  source: ({ message: msg }) => msg.channel.senf(text.bot.sourceCode)
};

/*
client.on("message", async msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(commandPrefix)) return;

  const args = msg.content.split(" ");
  const searchString = args.slice(1).join(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(msg.guild.id);

  let command = msg.content.toLowerCase().split(" ")[0];
  command = command.slice(commandPrefix.length);

  if (command === "play") {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel)
      return msg.channel.send(
        "I'm sorry but you need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT")) {
      return msg.channel.send(
        "I cannot connect to your voice channel, make sure I have the proper permissions!"
      );
    }
    if (!permissions.has("SPEAK")) {
      return msg.channel.send(
        "I cannot speak in this voice channel, make sure I have the proper permissions!"
      );
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      return msg.channel.send(
        `✅ Playlist: **${playlist.title}** has been added to the queue!`
      );
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 10);
          let index = 0;
          msg.channel.send(`
__**Song selection:**__

${videos.map(video2 => `**${++index} -** ${video2.title}`).join("\n")}

Please provide a value to select one of the search results ranging from 1-10.
					`);
          // eslint-disable-next-line max-depth
          try {
            var response = await msg.channel.awaitMessages(
              msg2 => msg2.content > 0 && msg2.content < 11,
              {
                maxMatches: 1,
                time: 10000,
                errors: ["time"]
              }
            );
          } catch (err) {
            console.error(err);
            return msg.channel.send(
              "No or invalid value entered, cancelling video selection."
            );
          }
          const videoIndex = parseInt(response.first().content);
          var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch (err) {
          console.error(err);
          return msg.channel.send("🆘 I could not obtain any search results.");
        }
      }
      return handleVideo(video, msg, voiceChannel);
    }
  } else if (command === "skip") {
    if (!msg.member.voiceChannel)
      return msg.channel.send("You are not in a voice channel!");
    if (!serverQueue)
      return msg.channel.send(
        "There is nothing playing that I could skip for you."
      );
    serverQueue.connection.dispatcher.end("Skip command has been used!");
    return undefined;
  } else if (command === "stop") {
    if (!msg.member.voiceChannel)
      return msg.channel.send("You are not in a voice channel!");
    if (!serverQueue)
      return msg.channel.send(
        "There is nothing playing that I could stop for you."
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("Stop command has been used!");
    return undefined;
  } else if (command === "volume") {
    if (!msg.member.voiceChannel)
      return msg.channel.send("You are not in a voice channel!");
    if (!serverQueue) return msg.channel.send("There is nothing playing.");
    if (!args[1])
      return msg.channel.send(
        `The current volume is: **${serverQueue.volume}**`
      );
    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return msg.channel.send(`I set the volume to: **${args[1]}**`);
  } else if (command === "np") {
    if (!serverQueue) return msg.channel.send("There is nothing playing.");
    return msg.channel.send(
      `🎶 Now playing: **${serverQueue.songs[0].title}**`
    );
  } else if (command === "queue") {
    if (!serverQueue) return msg.channel.send("There is nothing playing.");
    return msg.channel.send(`
__**Song queue:**__

${serverQueue.songs.map(song => `**-** ${song.title}`).join("\n")}

**Now playing:** ${serverQueue.songs[0].title}
		`);
  } else if (command === "pause") {
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return msg.channel.send("⏸ Paused the music for you!");
    }
    return msg.channel.send("There is nothing playing.");
  } else if (command === "resume") {
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return msg.channel.send("▶ Resumed the music for you!");
    }
    return msg.channel.send("There is nothing playing.");
  } else if (command === "help") {
    
  }

  return undefined;
});
 */
