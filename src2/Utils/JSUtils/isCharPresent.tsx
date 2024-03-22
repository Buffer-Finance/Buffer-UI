const isCharPresent = (str: string, char: string) => {
  let strLen = str.length
  for (let i = 0; i < strLen; i++) {
    if (str[i] === char) return i
  }
  return false
}
export default isCharPresent
