import { MessageEmbed } from 'discord.js';
import * as path from 'path';
import { CommandArguments } from './shared/types';
import { createFields, embedDefaults, embedSpacer } from './shared/embed';
import { sendCurrentState } from './shared/sendCurrentState';

export async function help({ msg, cmd, args, config, queue }: CommandArguments) {
  const { prefix } = config.get(msg.guild.id);
  const command = name => `\`${prefix}${name}\``;

  const embed = new MessageEmbed()
    .setAuthor(...embedDefaults.author)
    .setColor(embedDefaults.color)
    .setTitle('Help')
    .addFields(
      createFields(
        [
          'Global Commands', 
          'These commands can be used in any channel.', 
          false
        ],
        ['Ping', command('ping')],
        ['Set bot prefix', command('prefix')],
        ['Initial setup', command('install')],
        ['Remove configuration', command('uninstall')],
        ['Help menu', command('help')],
        embedSpacer,
        [ 
          'Music Channel Commands',
          'These commands can only be used in the control channel. Prefixes and extra parameters are optional.',
          false
        ],
        ['Lookup + play', command('play')],
        ['Search videos', command('search')],
        ['Play video/playlist', '<YouTube URL> --loops <number>'],
        ['Help menu', command('help')]
      )
    );
  await msg.channel.send({
    embed,
    files: [
      {
        attachment: path.resolve('./assets/circle-192.png'),
        name: 'circle-192.png'
      }
    ]
  });
  sendCurrentState({ msg, args, cmd, config, queue });
}
