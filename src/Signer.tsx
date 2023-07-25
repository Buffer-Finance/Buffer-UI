import { BigNumberish } from 'ethers';
import { useAccount, useProvider, useSigner, useSignTypedData } from 'wagmi';
const domain = {
  name: 'Validator',
  version: '1',
  chainId: 421613,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
} as const;

// The named list of all type definitions
const types = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ],
  one_ct: [
    { name: 'content', type: 'string' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const;

const message = {
  content: 'I want to create onect',
  nonce: '1' as BigNumberish,
} as const;
const Signer: React.FC<any> = ({}) => {
  const { address } = useAccount();
  const p = useProvider();
  const { data: signer, isError, isLoading } = useSigner();
  const response = useSignTypedData({
    domain,
    value: message,
    // primaryType: 'Mail',
    types,
    onSuccess: (d) => {
      console.log('success', d);
    },
    onError: (e) => {
      console.log('error', e);
    },
  });
  console.log(`Signer-response: `, response);

  const sign = async () => {
    const res = response.signTypedData();
    console.log(`Signer-res: `, res);
  };
  return (
    <div>
      <button onClick={sign}>hehsignd</button>
    </div>
  );
};

export { Signer };
