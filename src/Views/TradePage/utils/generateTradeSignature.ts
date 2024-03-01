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
  size: string,
  duration: string | number,
  targetContract: string,
  strike: string,
  slippage: string,
  partialFill: boolean,
  referral: string,
  // NFTid: string,
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
  const hashedMessage: string[] = ['partial', 'full'].map((s, idx) => {
    return ethers.utils.solidityKeccak256(args[idx].types, args[idx].values);
  });
  return await Promise.all(
    hashedMessage.map((s) => wallet?.signMessage(arrayify(s)))
  );
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
      version: '1',
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
};
