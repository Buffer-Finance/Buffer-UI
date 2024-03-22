export default function getTokens(
  inputString: string,
  delimiter: string
): string[] {
  const delimiterIndex = inputString.indexOf(delimiter);
  if (delimiterIndex !== -1) {
    const firstPart = inputString.slice(0, delimiterIndex);
    const secondPart = inputString.slice(-delimiter.length);
    return [firstPart, secondPart];
  }
  return [inputString];
}
