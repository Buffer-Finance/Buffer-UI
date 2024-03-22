import { ethers } from 'ethers';
export function isZero(value: string) {
  return ethers.constants.HashZero.includes(value);
}
