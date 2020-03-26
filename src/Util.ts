export default class Util {
  static jsonToMap = (jsonString: string): Map<any, any> => {
    return new Map(JSON.parse(jsonString));
  }
  static mapToJSON = (map: Map<any, any>): string => {
    return JSON.stringify([...map]);
  }
}
