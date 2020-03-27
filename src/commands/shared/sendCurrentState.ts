import { MessageEmbed } from 'discord.js';
import { CommandArguments } from './args';
import { createFields, embedDefaults } from './embed';

export async function sendCurrentState({ msg, args, cmd, config, queue }: CommandArguments) {
  const guildConfig = config.get(msg.guild.id);
  const guildQueue = queue.get(msg.guild.id);
  const embed = new MessageEmbed()
    .setDescription('Current State')
    .setColor(embedDefaults.color)
    .addFields(
      createFields(
        ['Full message', `\`${msg.content}\``],
        ['Command', `\`${cmd}\``],
        ['Arguments', args.length != 0 ? `\`${args.join(', ')}\`` : '(none)'],
        ['Guild config', '```json\n' + JSON.stringify(guildConfig, null, 2) + '```', false],
        ['Guild queue', '```json\n' + JSON.stringify(guildQueue, null, 2) + '```', false]
      )
    );
  msg.channel.send(embed);
}
