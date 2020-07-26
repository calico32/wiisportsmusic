/* jshint esversion: 8 */
module.exports = {
  other: {
    expressStartF: port => "Express app started on port " + port,
    keysUndefined: `Your YouTube API key or Discord bot token was not found.
Either:
- add them to config.json with the key names "discordBotToken" and "youtubeApiKey".
- set the environment variables "discordBotToken" and "youtubeApiKey" to their respective values.`
  },
  user: {
    insufficientPermissions: "Insufficient permissions.",
    notInVoiceChannel: 'You need to be in a voice channel to use that command.',
    invalidSearchSelection: 'Invalid selection.',
    helpF: prefix =>
      `
__**wiisportsmusic**__
**A Discord Music Bot**

**Command prefix: ${prefix}**

*v. 0.1.0a*
**Note: This bot is still in early alpha. Expect playback and control bugs. If you'd like, report bugs by open an issue on the GitHub repo (type \`${prefix}source\`)**


\`${prefix}play\` - play a video from YouTube (Spotify and SoundCloud coming soon!). Parameter must be either a YouTube/YouTube Music video/playlist URL or a search query.
\`${prefix}queue\` - view queue of songs and current song.
\`${prefix}pause\` - pause playback.
\`${prefix}skip\` - skip current song.
\`${prefix}stop\` - stop playback and clear queue.
\`${prefix}playing\` - view current song.

\`${prefix}help\` - view this help message.
\`${prefix}source\` - get link to source code on GitHub.

Bot manager only:
\`${prefix}restart\` - restart application.
\`${prefix}edit\` - edit code.
\`${prefix}prefix\` - change server prefix (coming soon).

`
  },
  bot: {
    ready: `Bot ready!`,
    restarting: 'Restart command issued. Restarting...',
    disconnected: 'Bot disconnected.',
    reconnecting: 'Bot is reconnecting...',
    cannotConnect: 'Cannot join voice channel, permission not granted.',
    cannotSpeak: 'Cannot speak in voice channel, permission not granted.',
    pausePlayback: 'Paused playback.',
    resumePlayback: 'Resumed playback.',
    skip: 'Song was skipped.',
    nothingPlaying: 'There is nothing playing.',
    noSearchResults: 'No search results.',
    voiceDisconnect: 'Disconnected from voice channel.',
    sourceCode: 'Source code available at https://github.com/wiisportsresort/wiisportsmusic. Feel free to contribute and report bugs!',

    playF: title => `Now playing: **${title}**`,
    addToQueueF: title => `**${title}** was added to the queue.`,
    currentVolumeF: volume => `The current volume is **${volume}**`,
    setVolumeF: volume => `Set the volume to: **${volume}**`,
    cannotConnectF: reason => `Could not join voice channel: ${reason}`,
    queueF: songs => {
      let songResults = '';
      let index = 0;
      songs.map(song => {
        songResults += `**${++index} -** ${unescape(escape(song.title))} \n`;
      });

      return `__**Song queue:**__

${songResults}

Now playing: **${songs[0].title}**`;
    },
    searchResultsF: videos => {
      let videoResults = '';
      let index = 0;
      videos.map(video2 => {
        videoResults += `${++index} - ${unescape(escape(video2.title))}`;
        videoResults += '\n';
      });

      return `__**Song selection:**__

${videoResults}

Type 1-10 to select a video.
      `;
    }
  }
};

/* 
symbols
🎶
✅
▶
⏸ 
🆘 
*/
