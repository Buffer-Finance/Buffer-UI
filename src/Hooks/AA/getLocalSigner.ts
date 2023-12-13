import { ethers } from 'ethers';

export const getLocalSigner = (
  userAddress: string | `0x${string}`
): Promise<ethers.Wallet> => {
  const msg = import.meta.env.VITE_STORAGE_KEY;
  // genearte a privatekey from user address local signer key by hashing them
  console.log(`deb-main- key + userAddress: `, key + userAddress);
  const signer = new ethers.Wallet(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(key + userAddress))
  );
  console.log(`deb-main- key + userAddress: `, signer.privateKey);
  // sign the message
  // const signature = await signer.signMessage(message);
  // hash the signature and use as public key to create a session signer
  // const sessionSigner = new ethers.Wallet( ethers.utils.keccak256(signature));
  // rerurn the session signer
  return signer;
};
