//return joint string from two strings
export default function joinStrings(
  firstString: string,
  secondString: string,
  delimiter: string
): string {
  return `${firstString}${delimiter}${secondString}`;
}
