import { MessageEmbed, MessageEmbedOptions } from 'discord.js';

export class Embed extends MessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
    this.setColor(0xff8d1e);
    this.setAuthor('yt bot');
    this.setFooter(`epic bot | ${Date.now()}`);
  }
}
