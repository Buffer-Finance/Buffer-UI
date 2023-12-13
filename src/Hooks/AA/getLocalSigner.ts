import { ethers } from 'ethers';

export const getLocalSigner = (userAddress: string | `0x${string}`) => {
  const key = import.meta.env.VITE_STORAGE_KEY;
  // genearte a privatekey from user address local signer key by hashing them
  console.log(`deb-main- key + userAddress: `, key + userAddress);
  const signer = new ethers.Wallet(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(key + userAddress))
  );
  console.log(`deb-main- key + userAddress: `, signer.privateKey);

  return signer;
};
