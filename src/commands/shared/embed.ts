import { EmbedFieldData } from 'discord.js';

export const embedDefaults = {
  author: <[string, string, string]>['wiisportsmusic', 'attachment://circle-192.png', ''],
  color: '#1e90ff'
};

export const embedSpacer = <EmbedFieldData>{
  name: '\u200b',
  value: '\u200b'
}
// protip: you can look at the console
export function createFields(...fields: Array<[string, string, boolean?] | EmbedFieldData>): EmbedFieldData[] {
  let output = <Array<EmbedFieldData>>[];
  for (let field of fields) {
    if (Array.isArray(field)) {
      let [name, value, inline] = field;
      if (inline == null) inline = true;
      output.push(<EmbedFieldData>{ name, value, inline });
    } else output.push(field);
  }
  return output;
}
