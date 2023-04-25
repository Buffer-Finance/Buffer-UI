import { encodeMulti } from 'ethers-multisend';
import TestAvatarAbi from '@Views/TestAvatarAbi.json';
import { useWriteCall } from './useWriteCall';

const UsdcTransfer: React.FC<any> = ({}) => {
  const { writeCall } = useWriteCall(
    '0x99c758a4Aff8d0d51F18c5fBd94fD182ec49BaaA',
    TestAvatarAbi
  );
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
