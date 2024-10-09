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

const tradeParamTypes = [
  { name: 'user', type: 'address' },
  { name: 'totalFee', type: 'uint256' },
  { name: 'period', type: 'uint256' },
  { name: 'targetContract', type: 'address' },
  { name: 'strike', type: 'uint256' },
  { name: 'slippage', type: 'uint256' },
  { name: 'allowPartialFill', type: 'bool' },
  { name: 'referralCode', type: 'string' },
  // { name: 'traderNFTId', type: 'uint256' },
];

const isUpType = { name: 'isAbove', type: 'bool' };
const settlementFeeType = { name: 'settlementFee', type: 'uint256' };
const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];
const generateBuyTradeSignature = async (
  address: any,
  size: string,
  duration: string | number,
  targetContract: string,
  strike: string,
  slippage: string,
  partialFill: boolean,
  referral: string,
  ts: number,
  settlementFee: string | number,
  isUp: boolean,
  oneCtPk: string,
  activeChainId: any,
  routerContract: string
): Promise<string[]> => {
  const wallet = getWalletFromOneCtPk(oneCtPk);

  const isLimit = settlementFee == 0;

  const baseMessage = {
    user: address,
    totalFee: size,
    period: +duration * 60 + '',
    targetContract,
    strike,
    slippage,
    allowPartialFill: partialFill,
    referralCode: referral,
  };
  const domain = {
    name: 'Validator',
    version: '1',
    chainId: activeChainId,
    verifyingContract: routerContract,
  };
  const key = isLimit
    ? { partial: 'UserTradeSignature', full: 'MarketDirectionSignature' }
    : {
      partial: 'UserTradeSignatureWithSettlementFee',
      full: 'UserTradeSignatureWithSettlementFee',
    };
  const extraArgTypes = !isLimit
    ? [{ name: 'timestamp', type: 'uint256' }, settlementFeeType]
    : [{ name: 'timestamp', type: 'uint256' }];
  const extraArgs = !isLimit
    ? { settlementFee, timestamp: ts }
    : { timestamp: ts };
  const partialSignatureParams = {
    types: {
      EIP712Domain,
      [key.partial]: [...tradeParamTypes, ...extraArgTypes],
    },
    primaryType: key.partial,
    domain,
    message: { ...baseMessage, ...extraArgs },
  };
  const fullSignatureParams = {
    types: {
      EIP712Domain,
      [key.full]: [...tradeParamTypes, ...extraArgTypes, isUpType],
    },
    primaryType: key.full,
    domain,
    message: { ...baseMessage, ...extraArgs, isAbove: isUp },
  };
  const res = await Promise.all([
    wallet.signTypedData(partialSignatureParams),
    wallet.signTypedData(fullSignatureParams),
  ]);
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
  console.log(approveSignatureParams, 'approve-deb')
  const res = await signMethod(approveSignatureParams);

  return [res, getRSVFromSignature(res)];
};

export {
  generateApprovalSignature,
  generateBuyTradeSignature,
  getRSVFromSignature,
};


/*
Server
{'types': {'EIP712Domain': [{'name': 'name', 'type': 'string'}, {'name': 'version', 'type': 'string'}, {'name': 'chainId', 'type': 'uint256'}, {'name': 'verifyingContract', 'type': 'address'}], 'Permit': [{'name': 'owner', 'type': 'address'}, {'name': 'spender', 'type': 'address'}, {'name': 'value', 'type': 'uint256'}, {'name': 'nonce', 'type': 'uint256'}, {'name': 'deadline', 'type': 'uint256'}]},
 'domain': 
 {'name': 'USD Coin', 
 'version': '2',
  'chainId': 42161121,
   'verifyingContract': '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
  }, 'primaryType': 'Permit', 
 'message': {'owner': '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  'spender': '0x2BAA48961C1CD376484b601278bF7A51E94293a9', 
  'value': 115792089237316195423570985008687907853269984665640564039457584007913129639935, 
  'nonce': 1, 'deadline': 1728392202}}"}


{
    "types": {
        "EIP712Domain": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "version",
                "type": "string"
            },
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ],
        "Permit": [
            {
                "name": "owner",
                "type": "address"
            },
            {
                "name": "spender",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            },
            {
                "name": "nonce",
                "type": "uint256"
            },
            {
                "name": "deadline",
                "type": "uint256"
            }
        ]
    },
    "primaryType": "Permit",
    "domain": {
        "name": "USD Coin",
        "version": "2",
        "chainId": 42161121,
        "verifyingContract": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
    },
    "message": {
        "nonce": 1,
        "value": "115792089237316195423570985008687907853269984665640564039457584007913129639935",
        "owner": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "deadline": "1728392202",
        "spender": "0xf4cc4978C5d80945364fBdBD3750429505ADeB89"
    }
}

*/
