export default class Util {
  static jsonToMap = (jsonString: string): Map<any, any> => {
    return new Map(JSON.parse(jsonString));
  };
  static mapToJSON = (map: Map<any, any>, indent?: boolean): string => {
    if (indent) return JSON.stringify([...map], null, 2);
    else return JSON.stringify([...map]);
  };
}
