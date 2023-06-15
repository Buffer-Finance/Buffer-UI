import {
  divide,
  gt,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { baseUrl } from './config';
import axios from 'axios';
import { toFixed } from '@Utils/NumString';
import { ethers } from 'ethers';
import { arrayify } from 'ethers/lib/utils.js';

// returns the token1 and toklen0 value from string
export function getTokens(inputString: string, delimiter: string): string[] {
  const delimiterIndex = inputString.indexOf(delimiter);
  if (delimiterIndex !== -1) {
    const firstPart = inputString.slice(0, delimiterIndex);
    const secondPart = inputString.slice(-delimiter.length);
    return [firstPart, secondPart];
  }
  return [inputString];
}

//return joint string from two strings
export function joinStrings(
  firstString: string,
  secondString: string,
  delimiter: string
): string {
  return `${firstString}${delimiter}${secondString}`;
}

//returns payout percentage
export function getPayout(payout: string) {
  //   if (!payout) return null;
  return subtract('100', multiply('2', divide(payout, 2) as string));
}

//returns the time from seconds in HH:MM format
export function secondsToHHMM(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}

//returns the time fromHH:MM format in seconds
export function HHMMToSeconds(time: string) {
  const [hours, minutes] = time.split(':');
  return Number(hours) * 3600 + Number(minutes) * 60;
}

//returns the maximum value from two strings
export function getMaximumValue(value1: string, value2: string): string {
  if (gt(value1, value2)) {
    return value1;
  }
  return value2;
}

//returns the maximum value from multiple strings
export function getMaximumValueFromArray(values: string[]): string {
  return values.reduce((acc, curr) => {
    return getMaximumValue(acc, curr);
  }, '0');
}

//returns the minimum value from two strings
export function getMinimumValue(value1: string, value2: string): string {
  if (gt(value1, value2)) {
    return value2;
  }
  return value1;
}

//returns the minimum value from multiple strings
export function getMinimumValueFromArray(values: string[]): string {
  return values.reduce((acc, curr) => {
    return getMinimumValue(acc, curr);
  }, '0');
}

export const cancelQueueTrade = async (params: {
  user_signature: string;
  user_address: `0x${string}`;
  environment: number;
  queue_id: number;
}) => {
  return await axios.post(`${baseUrl}trade/cancel/`, null, { params });
};
export const editQueueTrade = async (
  user_signature: string,
  queue_id: number | string,
  signature_timestamp: number,
  strike: string,
  period: number,
  partial_signature: string,
  full_signature: string,
  user_address: string,
  slippage: number,
  is_above: boolean,
  limit_order_expiration: number,
  environment: number
) => {
  return await axios.get(`${baseUrl}trade/edit/`, {
    params: {
      user_signature,
      queue_id,
      signature_timestamp,
      strike,
      period,
      partial_signature,
      full_signature,
      user_address,
      slippage,
      is_above,
      limit_order_expiration,
      environment,
    },
  });
};

export const generateTradeSignature = async (
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
  const baseArgsEnding = [ts, settlementFee];
  const baseArgsEndingTypes = ['uint256', 'uint256'];
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
  const hashedMessage: string[] = ['partial', 'full'].map((s, idx) => {
    return ethers.utils.solidityKeccak256(args[idx].types, args[idx].values);
  });
  return await Promise.all(
    hashedMessage.map((s) => wallet?.signMessage(arrayify(s)))
  );
};
