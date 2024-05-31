import { toFixed } from '@Utils/NumString';
import { multiply } from '@Utils/NumString/stringArithmatics';
import { ethers } from 'ethers';
import { arrayify } from 'ethers/lib/utils.js';
import { getAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export const getWalletFromOneCtPk = (oneCtPk: string) => {
  return privateKeyToAccount(`0x${oneCtPk}`);
};
const generateTradeSignature = async (
  address: any,
  expiration: string | number,
  totalFee: string | number,
  maxFeePerContract: string | number,
  targetContract: string,
  strike: string,
  partialFill: boolean,
  referral: string,
  ts: number,
  isAbove: boolean,

  activeChainId: number,
  routerContract: string,
  oneCtPk: string
): Promise<string> => {
  const wallet = getWalletFromOneCtPk(oneCtPk);

  const domain = {
    name: 'Validator',
    version: '1',
    chainId: activeChainId,
    verifyingContract: routerContract,
  };
  const fullSignatureParams = {
    types: {
      EIP712Domain,
      UserTradeSignature: [
        { name: 'user', type: 'address' },
        { name: 'targetContract', type: 'address' },
        { name: 'expiration', type: 'uint32' },
        { name: 'totalFee', type: 'uint256' },
        { name: 'strike', type: 'uint256' },
        { name: 'isAbove', type: 'bool' },
        { name: 'maxFeePerContract', type: 'uint256' },
        { name: 'allowPartialFill', type: 'bool' },
        { name: 'referralCode', type: 'string' },
        { name: 'timestamp', type: 'uint256' },
      ],
    },
    primaryType: 'UserTradeSignature',
    domain,
    message: {
      user: address,
      targetContract: getAddress(targetContract),
      expiration,
      totalFee,
      strike,
      isAbove,
      maxFeePerContract,
      allowPartialFill: partialFill,
      referralCode: referral,
      timestamp: ts,
    },
  };
  console.log(fullSignatureParams);

  const res = await wallet.signTypedData(fullSignatureParams);
  console.log('comes here');

  return res;
};

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];
const generateBuyTradeSignature = async (
  address: any,
  size: string,
  expiration: number,
  targetContract: string,
  partialFill: boolean,
  referral: string,
  ts: number,
  isUp: boolean,
  oneCtPk: string,
  activeChainId: number,
  routerContract: string
): Promise<string> => {
  const wallet = getWalletFromOneCtPk(oneCtPk);
  const domain = {
    name: 'Validator',
    version: '1',
    chainId: activeChainId,
    verifyingContract: routerContract,
  };
  const fullSignatureParams = {
    types: {
      EIP712Domain,
      UserTradeSignature: [
        { name: 'user', type: 'address' },
        { name: 'totalFee', type: 'uint256' },
        { name: 'expiration', type: 'uint32' },
        { name: 'targetContract', type: 'address' },
        { name: 'allowPartialFill', type: 'bool' },
        { name: 'referralCode', type: 'string' },
        { name: 'timestamp', type: 'uint256' },
        { name: 'isAbove', type: 'bool' },
      ],
    },
    primaryType: 'UserTradeSignature',
    domain,
    message: {
      user: address,
      totalFee: size,
      expiration,
      targetContract: getAddress(targetContract),
      allowPartialFill: partialFill,
      referralCode: referral,
      timestamp: ts,
      isAbove: isUp,
    },
  };
  console.log(fullSignatureParams);

  const res = await wallet.signTypedData(fullSignatureParams);
  console.log('comes here');

  return res;
};
const approveParamType = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
];
const getRSVFromSignature = (signature: string) => {
  const r = signature.slice(0, 66);
  const s = '0x' + signature.slice(66, 130);
  const v = '0x' + signature.slice(130, 132);
  return { r, s, v };
};

export default generateTradeSignature;
const generateApprovalSignature = async (
  nonce: number,
  amount: string,
  userMainAccount: string,
  tokenAddress: string,
  routerAddress: string,
  deadline: string,
  activeChainId: any,
  signMethod: any,
  domainName: string
): Promise<[string, { r: string; s: string; v: string }]> => {
  const approveMessage = {
    nonce: +nonce,
    value: amount,
    owner: getAddress(userMainAccount),
    deadline,
    spender: getAddress(routerAddress),
  };
  const approveSignatureParams = {
    types: {
      EIP712Domain,
      Permit: approveParamType,
    },
    primaryType: 'Permit',
    domain: {
      name: domainName,
      version: domainName === 'USD Coin' ? '2' : '1',
      chainId: activeChainId,
      verifyingContract: getAddress(tokenAddress),
    },
    message: approveMessage,
  } as const;
  const res = await signMethod(approveSignatureParams);

  return [res, getRSVFromSignature(res)];
};

export {
  generateApprovalSignature,
  generateBuyTradeSignature,
  getRSVFromSignature,
  generateTradeSignature,
};
