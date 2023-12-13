import { ethers } from 'ethers';

export const getLocalSigner = (userAddress: string | `0x${string}`) => {
  const key = import.meta.env.VITE_LOCAL_SIGNER_KEY;
  // genearte a privatekey from user address local signer key by hashing them
  const signer = new ethers.Wallet(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(key + userAddress))
  );
  return signer;
};
