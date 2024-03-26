import { encodeMulti } from 'ethers-multisend';
import TestAvatarAbi from '@Views/TestAvatarAbi.json';
import { useWriteCall } from './useWriteCall';
import { useReadCall } from '@Utils/useReadCall';
import { ethers } from 'ethers';
const ifc = new ethers.utils.Interface(TestAvatarAbi);
const ExecutionModuleCallAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'unacceptedAddress',
        type: 'address',
      },
    ],
    name: 'NotAuthorized',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address payable', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'exec',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address payable', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      { internalType: 'uint8', name: 'operation', type: 'uint8' },
    ],
    name: 'execTransactionFromModule',
    outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'module',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bytes', name: '', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_module', type: 'address' }],
    name: 'setModule',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];

const UsdcTransfer: React.FC<any> = ({}) => {
  const { writeCall } = useWriteCall(
    '0x28346dd04079a2b48daF1AC933Fe8F04D92bc773',
    ExecutionModuleCallAbi
  );
  const calls = [
    {
      address: '0x28346dd04079a2b48daF1AC933Fe8F04D92bc773',
      abi: TestAvatarAbi,
      name: 'balanceOf',
      params: ['0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D'],
    },
  ];
  let copy = useReadCall({
    contracts: calls,
    swrKey: `UseActiveAssetState`,
  }).data as unknown as string[];
  const transfer = () => {
    const encoded = encodeMulti(
      [
        {
          to: '0x28346dd04079a2b48daF1AC933Fe8F04D92bc773',
          value: '0',
          data: ifc.encodeFunctionData('transfer', [
            '0xB66127377ff3618b595177b5E84f8ee9827CD061',
            '10000000',
          ]),
        },
        {
          to: '0x28346dd04079a2b48daF1AC933Fe8F04D92bc773',
          value: '0',
          data: ifc.encodeFunctionData('transfer', [
            '0x4E6f6E255246f2392A15662d03396aBF08890866',
            '10000000',
          ]),
        },
      ],
      '0xAb3224e76fa5a46D9f8364cd14F4cB03087d6Fd8'
    );
    writeCall(
      () => {
        console.log('success');
      },
      'execTransactionFromModule',
      [encoded.to, encoded.value, encoded.data, 1],
      null
    );
  };
  return (
    <div>
      Transfer Funds
      <button onClick={transfer}>Transfer</button>
    </div>
  );
};

export { UsdcTransfer };
