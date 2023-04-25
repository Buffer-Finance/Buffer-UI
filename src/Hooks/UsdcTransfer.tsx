import { encodeMulti } from 'ethers-multisend';
import TestAvatarAbi from '@Views/TestAvatarAbi.json';
import { useWriteCall } from './useWriteCall';
import { useReadCall } from '@Utils/useReadCall';

const UsdcTransfer: React.FC<any> = ({}) => {
  const { writeCall } = useWriteCall(
    '0xE69334B9Ca6409fDbe590efC2f16A847D12B673B',
    TestAvatarAbi
  );
  const calls = [
    {
      address: '0xE69334B9Ca6409fDbe590efC2f16A847D12B673B',
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
          to: '0xB66127377ff3618b595177b5E84f8ee9827CD061',
          value: '10000000',
          data: '0x00',
        },
        {
          to: '0x4E6f6E255246f2392A15662d03396aBF08890866',
          value: '10000000',
          data: '0x00',
        },
      ],
      '0xAb3224e76fa5a46D9f8364cd14F4cB03087d6Fd8'
    );
    console.log(`encoded.to: `, encoded.to);
    writeCall(
      () => {
        console.log('success');
      },
      'execTransactionFromModule',
      [encoded.to, encoded.value, encoded.data, encoded.operation || 0],
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
