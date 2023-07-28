import { Wallet } from 'ethers';
var address2SingatureCache: { [key: string]: string } = {};

export const getSingatureCached = async (oneCTWallet: Wallet | null) => {
  if (!oneCTWallet) return null;
  if (!address2SingatureCache[oneCTWallet.address]) {
    address2SingatureCache[oneCTWallet.address] = await oneCTWallet.signMessage(
      import.meta.env.VITE_SIGN_MESSAGE
    );
  }
  return (address2SingatureCache[oneCTWallet.address] =
    await oneCTWallet.signMessage(import.meta.env.VITE_SIGN_MESSAGE));
};
