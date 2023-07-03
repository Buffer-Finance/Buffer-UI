import { Call } from '@Utils/Contract/multiContract';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { createPublicClient, http } from 'viem';
import { arbitrumGoerli } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const client = createPublicClient({
  chain: arbitrumGoerli,
  transport: http(),
});

// const blockNumber = await client.getBlockNumber();

const TestComponent: React.FC<any> = ({}) => {
  return <div>hello</div>;
};
export default TestComponent;
