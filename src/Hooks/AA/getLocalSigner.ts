import { SignMessageArgs } from '@wagmi/core';
import { ethers } from 'ethers';

export const getLocalSigner = async (
  signMessage: (args?: SignMessageArgs) => Promise<`0x${string}`>
): Promise<ethers.Wallet> => {
  const msg = import.meta.env.VITE_STORAGE_KEY;

  // sign the message
  const signature = await signMessage({ message: msg });
  console.log(`signature: `, signature);
  // hash the signature and use as public key to create a session signer
  const sessionSigner = new ethers.Wallet(ethers.utils.keccak256(signature));
  // rerurn the session signer
  return sessionSigner;
};
