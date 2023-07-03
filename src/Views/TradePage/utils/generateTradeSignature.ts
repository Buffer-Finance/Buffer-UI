import { toFixed } from '@Utils/NumString';
import { multiply } from '@Utils/NumString/stringArithmatics';
import { ethers } from 'ethers';
import { arrayify } from 'ethers/lib/utils.js';
import { privateKeyToAccount } from 'viem/accounts';

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
const normalTradeMeta = {
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    UserTradeSignatureWithSettlementFee: [
      { name: 'user', type: 'address' },
      { name: 'totalFee', type: 'uint256' },
      { name: 'period', type: 'uint256' },
      { name: 'targetContract', type: 'address' },
      { name: 'strike', type: 'uint256' },
      { name: 'slippage', type: 'uint256' },
      { name: 'allowPartialFill', type: 'bool' },
      { name: 'referralCode', type: 'string' },
      { name: 'traderNFTId', type: 'uint256' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'settlementFee', type: 'uint256' },
    ],
  },
  primaryType: 'UserTradeSignatureWithSettlementFee' as const,
  domain: {
    name: 'Validator',
    version: '1',
    chainId: 421613,
    verifyingContract: '0x0000000000000000000000000000000000000000',
  } as const,
};
const isUpType = { name: 'isAbove', type: 'bool' };

const generateBuyTradeSignature = async (
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
  oneCtPk: string
): Promise<string[]> => {
  const wallet = privateKeyToAccount(`0x${oneCtPk}`);

  const isLimit = settlementFee == 0;
  const message = {
    user: address,
    totalFee: size,
    period: +duration * 60 + '',
    targetContract,
    strike: toFixed(multiply(strike, 8), 0),
    slippage,
    allowPartialFill: partialFill,
    referralCode: referral,
    traderNFTId: NFTid,
    timestamp: ts,
    settlementFee: settlementFee,
  };
  console.log('call-dd');
  const res = await Promise.all([
    wallet.signTypedData({
      types: normalTradeMeta.types,
      primaryType: normalTradeMeta.primaryType,
      domain: normalTradeMeta.domain,
      message,
    }),
    wallet.signTypedData({
      types: {
        ...normalTradeMeta.types,
        UserTradeSignatureWithSettlementFee: [
          ...normalTradeMeta.types['UserTradeSignatureWithSettlementFee'],
          isUpType,
        ],
      },
      primaryType: normalTradeMeta.primaryType,
      domain: normalTradeMeta.domain,
      message: { ...message, isAbove: isUp },
    }),
  ]);
  console.log(`call-dd-res: `, res);
  return res;
};

export default generateTradeSignature;
export { generateBuyTradeSignature };
