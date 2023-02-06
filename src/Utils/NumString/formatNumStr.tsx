import toFixed from './toFixed'
import Big from 'big.js'

/**
 * formats numString to fixed precision, may convert wei to decimal and vice-versa
 * @param numString number string you want to format
 * @param precision  OPTIONAL precision you want, defaults to zero
 * @param conversion OPTIONAL 1 means decimal to wei, 2 is vice versa
 * @returns formatted string
 */
const formatNumStr = (numString: string, precision?: number, conversion?: 1 | 2) => {
  if (conversion) {
    const factor = 1e18
    const BigNumString = Big(numString)
    switch (conversion) {
      case 1:
        const resStr = toFixed(BigNumString.times(factor).toString(), 0)
        if (precision) {
          return toFixed(resStr, precision)
        }
        return toFixed(resStr, 0)
      case 2:
        const res = BigNumString.div(factor).toString()
        if (precision) {
          return toFixed(res, precision)
        }
        return
      default:
        return toFixed(numString, precision)
    }
  }
  if (precision) {
    return toFixed(numString, precision)
  }
  return toFixed(numString, 0)
}

export default formatNumStr
