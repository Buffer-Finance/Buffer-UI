import { toFixed } from '@Utils/NumString';
import { multiply } from '@Utils/NumString/stringArithmatics';
import { ethers } from 'ethers';
import { arrayify } from 'ethers/lib/utils.js';

const generateTradeSignature = async (
  address: any,
  size: string,
  duration: string | number,
  targetContract: string,
  strike: string,
  slippage: string,
  partialFill: boolean,
  referral: string,
  NFTid: string,
  ts: number,
  settlementFee: string | number,
  isUp: boolean,
  wallet: ethers.Wallet
): Promise<string[]> => {
  const baseArgTypes = [
    'address',
    'uint256',
    'uint256',
    'address',
    'uint256',
    'uint256',
    'bool',
    'string',
    'uint256',
  ];
  const baseArgs = [
    address,
    toFixed(size, 0),
    +duration * 60 + '',
    targetContract,
    toFixed(multiply(strike, 8), 0),
    slippage,
    partialFill,
    referral,
    NFTid,
  ];
  const isLimit = settlementFee == 0;
  const baseArgsEnding = isLimit ? [ts] : [ts, settlementFee];
  const baseArgsEndingTypes = isLimit ? ['uint256'] : ['uint256', 'uint256'];
  const args = [
    {
      values: [...baseArgs, ...baseArgsEnding],
      types: [...baseArgTypes, ...baseArgsEndingTypes],
    },
    {
      values: [...baseArgs, isUp, ...baseArgsEnding],
      types: [...baseArgTypes, 'bool', ...baseArgsEndingTypes],
    },
  ];
  console.log(`index-edit-deb-args: `, args[0], args[1]);
  const hashedMessage: string[] = ['partial', 'full'].map((s, idx) => {
    return ethers.utils.solidityKeccak256(args[idx].types, args[idx].values);
  });
  return await Promise.all(
    hashedMessage.map((s) => wallet?.signMessage(arrayify(s)))
  );
};

export default generateTradeSignature;
